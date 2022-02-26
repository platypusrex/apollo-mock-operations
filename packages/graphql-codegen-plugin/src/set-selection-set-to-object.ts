import {
  FieldNode,
  isObjectType,
  isUnionType,
  GraphQLField,
  SchemaMetaFieldDef,
  TypeMetaFieldDef,
  SelectionNode,
  GraphQLObjectType,
  GraphQLOutputType,
  DirectiveNode,
  GraphQLNamedType,
  SelectionSetNode,
  GraphQLSchema,
} from 'graphql';
import {
  BaseSelectionSetProcessor,
  BaseVisitorConvertOptions,
  ConvertNameFn,
  getFieldNodeNameValue,
  GetFragmentSuffixFn,
  getPossibleTypes,
  hasConditionalDirectives,
  LinkField,
  LoadedFragment,
  mergeSelectionSets,
  NameAndType,
  NormalizedScalarsMap,
  ParsedDocumentsConfig,
  ProcessResult,
  SelectionSetToObject as CodegenSelectionSetToObject
} from '@graphql-codegen/visitor-plugin-common';
import { getBaseType } from '@graphql-codegen/plugin-helpers';

type FragmentSpreadUsage = {
  fragmentName: string;
  typeName: string;
  onType: string;
  selectionNodes: Array<SelectionNode>;
};

function isMetadataFieldName(name: string) {
  return ['__schema', '__type'].includes(name);
}

const metadataFieldMap: Record<string, GraphQLField<any, any>> = {
  __schema: SchemaMetaFieldDef,
  __type: TypeMetaFieldDef,
};

export class SelectionSetToObject extends CodegenSelectionSetToObject {
  constructor(
    protected _processor: BaseSelectionSetProcessor<any>,
    protected _scalars: NormalizedScalarsMap,
    protected _schema: GraphQLSchema,
    protected _convertName: ConvertNameFn<BaseVisitorConvertOptions>,
    protected _getFragmentSuffix: GetFragmentSuffixFn,
    protected _loadedFragments: LoadedFragment[],
    protected _config: ParsedDocumentsConfig,
    protected _parentSchemaType?: GraphQLNamedType,
    protected _selectionSet?: SelectionSetNode
  ) {
    super(
      _processor,
      _scalars,
      _schema,
      _convertName,
      _getFragmentSuffix,
      _loadedFragments,
      _config,
      _parentSchemaType,
      _selectionSet
    );
  }

  public createNext(parentSchemaType: GraphQLNamedType, selectionSet: SelectionSetNode): SelectionSetToObject {
    return new SelectionSetToObject(
      this._processor,
      this._scalars,
      this._schema,
      this._convertName.bind(this),
      this._getFragmentSuffix.bind(this),
      this._loadedFragments,
      this._config,
      parentSchemaType,
      selectionSet
    );
  }

  protected _buildGroupedSelections(): {
    grouped: Record<string, string[]>;
    mustAddEmptyObject: boolean;
    transformedSelectionSets: ProcessResult;
  } {
    if (!this._selectionSet || !this._selectionSet.selections || this._selectionSet.selections.length === 0) {
      return { grouped: {}, mustAddEmptyObject: true, transformedSelectionSets: [] };
    }

    const selectionNodesByTypeName = this.flattenSelectionSet(this._selectionSet.selections);

    // in case there is not a selection for each type, we need to add a empty type.
    let mustAddEmptyObject = false;
    let transformedSelectionSets: ProcessResult = [];

    const grouped = getPossibleTypes(this._schema, this._parentSchemaType!).reduce((prev, type) => {
      const typeName = type.name;
      const schemaType = this._schema.getType(typeName);

      if (!isObjectType(schemaType)) {
        throw new TypeError(`Invalid state! Schema type ${typeName} is not a valid GraphQL object!`);
      }

      const selectionNodes = selectionNodesByTypeName.get(typeName) || [];

      if (!prev[typeName]) {
        prev[typeName] = [];
      }

      const { typeString, transformed } = this._buildSelectionSetObject(schemaType, selectionNodes);
      if (transformed) {
        transformedSelectionSets = transformed;
      }

      if (typeString) {
        prev[typeName].push(typeString);
      } else {
        mustAddEmptyObject = true;
      }

      return prev;
    }, {} as Record<string, string[]>);

    return { grouped, mustAddEmptyObject, transformedSelectionSets };
  }

  protected _buildSelectionSetObject(
    parentSchemaType: GraphQLObjectType,
    selectionNodes: Array<SelectionNode | FragmentSpreadUsage | DirectiveNode>
  ) {
    const primitiveFields = new Map<string, FieldNode>();
    const primitiveAliasFields = new Map<string, FieldNode>();
    const linkFieldSelectionSets = new Map<
      string,
      {
        selectedFieldType: GraphQLOutputType;
        field: FieldNode;
      }
      >();
    let requireTypename = false;

    // usages via fragment typescript type
    const fragmentsSpreadUsages: string[] = [];

    // ensure we mutate no function params
    selectionNodes = [...selectionNodes];
    let inlineFragmentConditional = false;

    for (const selectionNode of selectionNodes) {
      if ('kind' in selectionNode) {
        if (selectionNode.kind === 'Field') {
          if (!selectionNode.selectionSet) {
            if (selectionNode.alias) {
              primitiveAliasFields.set(selectionNode.alias.value, selectionNode);
            } else if (selectionNode.name.value === '__typename') {
              requireTypename = true;
            } else {
              primitiveFields.set(selectionNode.name.value, selectionNode);
            }
          } else {
            // @ts-ignore
            let selectedField: GraphQLField<any, any, any> = null;

            const fields = parentSchemaType.getFields();
            selectedField = fields[selectionNode.name.value];

            if (isMetadataFieldName(selectionNode.name.value)) {
              selectedField = metadataFieldMap[selectionNode.name.value];
            }

            if (!selectedField) {
              continue;
            }

            const fieldName = getFieldNodeNameValue(selectionNode);
            let linkFieldNode = linkFieldSelectionSets.get(fieldName);
            if (!linkFieldNode) {
              linkFieldNode = {
                selectedFieldType: selectedField.type,
                field: selectionNode,
              };
            } else {
              linkFieldNode = {
                ...linkFieldNode,
                field: {
                  ...linkFieldNode.field,
                  selectionSet: mergeSelectionSets(linkFieldNode.field.selectionSet!, selectionNode.selectionSet),
                },
              };
            }
            linkFieldSelectionSets.set(fieldName, linkFieldNode);
          }
        } else if (selectionNode.kind === 'Directive') {
          if (['skip', 'include'].includes(selectionNode?.name?.value)) {
            inlineFragmentConditional = true;
          }
        } else {
          throw new TypeError('Unexpected type.');
        }
        continue;
      }

      if (this._config.inlineFragmentTypes === 'combine') {
        fragmentsSpreadUsages.push(selectionNode.typeName);
        continue;
      }

      // Handle Fragment Spreads by generating inline types.

      const fragmentType = this._schema.getType(selectionNode.onType);

      if (fragmentType == null) {
        throw new TypeError(`Unexpected error: Type ${selectionNode.onType} does not exist within schema.`);
      }

      if (
        parentSchemaType.name === selectionNode.onType ||
        parentSchemaType.getInterfaces().find(iinterface => iinterface.name === selectionNode.onType) != null ||
        (isUnionType(fragmentType) &&
          fragmentType.getTypes().find(objectType => objectType.name === parentSchemaType.name))
      ) {
        // also process fields from fragment that apply for this parentType
        const flatten = this.flattenSelectionSet(selectionNode.selectionNodes);
        const typeNodes = flatten.get(parentSchemaType.name) ?? [];
        selectionNodes.push(...typeNodes);
        for (const iinterface of parentSchemaType.getInterfaces()) {
          const typeNodes = flatten.get(iinterface.name) ?? [];
          selectionNodes.push(...typeNodes);
        }
      }
    }

    const linkFields: LinkField[] = [];
    for (const { field, selectedFieldType } of linkFieldSelectionSets.values()) {
      const realSelectedFieldType = getBaseType(selectedFieldType as any);
      const selectionSet = this.createNext(realSelectedFieldType, field.selectionSet!);
      const isConditional = hasConditionalDirectives(field) || inlineFragmentConditional;
      linkFields.push({
        alias: field.alias ? this._processor.config.formatNamedField(field.alias.value, selectedFieldType) : undefined,
        name: this._processor.config.formatNamedField(field.name.value, selectedFieldType, isConditional),
        type: realSelectedFieldType.name,
        selectionSet: this._processor.config.wrapTypeWithModifiers(
          selectionSet.transformSelectionSet().split(`\n`).join(`\n  `),
          selectedFieldType
        ),
      });
    }

    const typeInfoField = this.buildTypeNameField(
      parentSchemaType,
      this._config.nonOptionalTypename,
      this._config.addTypename,
      requireTypename,
      this._config.skipTypeNameForRoot
    );

    const transformed: ProcessResult = [
      // @ts-ignore
      ...(typeInfoField ? this._processor.transformTypenameField(typeInfoField.type, typeInfoField.name) : []),
      ...this._processor.transformPrimitiveFields(
        parentSchemaType,
        Array.from(primitiveFields.values()).map(field => ({
          isConditional: hasConditionalDirectives(field),
          fieldName: field.name.value,
        }))
      ),
      ...this._processor.transformAliasesPrimitiveFields(
        parentSchemaType,
        Array.from(primitiveAliasFields.values()).map(field => ({
          alias: field.alias!.value,
          fieldName: field.name.value,
        }))
      ),
      ...this._processor.transformLinkFields(linkFields),
    ].filter(Boolean);

    const allStrings: string[] = transformed.filter(t => typeof t === 'string') as string[];
    const allObjectsMerged: string[] = transformed
      .filter(t => typeof t !== 'string')
      // @ts-ignore
      .map((t: NameAndType) => `${t.name}: ${t.type}`);
    // @ts-ignore
    let mergedObjectsAsString: string = null;

    if (allObjectsMerged.length > 0) {
      mergedObjectsAsString = this._processor.buildFieldsIntoObject(allObjectsMerged);
    }

    const fields = [...allStrings, mergedObjectsAsString, ...fragmentsSpreadUsages].filter(Boolean);

    return { typeString: this._processor.buildSelectionSetFromStrings(fields), transformed };
  }

  public transformGroupedSelections() {
    return this._buildGroupedSelections();
  }
}
