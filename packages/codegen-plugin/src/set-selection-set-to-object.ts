import {
  DirectiveNode,
  FieldNode,
  GraphQLField,
  GraphQLNamedType,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLSchema,
  isObjectType,
  isUnionType,
  SchemaMetaFieldDef,
  SelectionNode,
  SelectionSetNode,
  TypeMetaFieldDef,
} from 'graphql';
import { getBaseType } from '@graphql-codegen/plugin-helpers';
import {
  BaseSelectionSetProcessor,
  BaseVisitorConvertOptions,
  ConvertNameFn,
  DeclarationBlock,
  getFieldNodeNameValue,
  GetFragmentSuffixFn,
  getPossibleTypes,
  hasConditionalDirectives,
  indentMultiline,
  LinkField,
  LoadedFragment,
  mergeSelectionSets,
  NameAndType,
  NormalizedScalarsMap,
  ParsedDocumentsConfig,
  ProcessResult,
  SelectionSetToObject as CodegenSelectionSetToObject,
} from '@graphql-codegen/visitor-plugin-common';

interface FragmentSpreadUsage {
  fragmentName: string;
  typeName: string;
  onType: string;
  selectionNodes: SelectionNode[];
}

function isMetadataFieldName(name: string): boolean {
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

  createNext(
    parentSchemaType: GraphQLNamedType,
    selectionSet: SelectionSetNode
  ): SelectionSetToObject {
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  transformGroupedSelections() {
    return this._buildGroupedSelections();
  }

  protected _buildGroupedSelections(): {
    grouped: Record<string, string[]>;
    mustAddEmptyObject: boolean;
    transformedSelectionSets: ProcessResult;
  } {
    if (
      !this._selectionSet ||
      !this._selectionSet.selections ||
      this._selectionSet.selections.length === 0
    ) {
      return { grouped: {}, mustAddEmptyObject: true, transformedSelectionSets: [] };
    }

    const selectionNodesByTypeName = this.flattenSelectionSet(this._selectionSet.selections);

    // in case there is not a selection for each type, we need to add a empty type.
    let mustAddEmptyObject = false;
    let transformedSelectionSets: ProcessResult = [];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const grouped = getPossibleTypes(this._schema, this._parentSchemaType!).reduce<
      Record<string, string[]>
    >((prev, type) => {
      const typeName = type.name;
      const schemaType = this._schema.getType(typeName);

      if (!isObjectType(schemaType)) {
        throw new TypeError(
          `Invalid state! Schema type ${typeName} is not a valid GraphQL object!`
        );
      }

      const selectionNodes = selectionNodesByTypeName.get(typeName) ?? [];

      if (!prev[typeName]) {
        // eslint-disable-next-line no-param-reassign
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
    }, {});

    return { grouped, mustAddEmptyObject, transformedSelectionSets };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  protected _buildSelectionSetObject(
    parentSchemaType: GraphQLObjectType,
    selectionNodes: (DirectiveNode | FragmentSpreadUsage | SelectionNode)[]
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
    // eslint-disable-next-line no-param-reassign
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
            // @ts-expect-error
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
            linkFieldNode = !linkFieldNode
              ? {
                  field: selectionNode,
                  selectedFieldType: selectedField.type,
                }
              : {
                  ...linkFieldNode,
                  field: {
                    ...linkFieldNode.field,
                    selectionSet: mergeSelectionSets(
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      linkFieldNode.field.selectionSet!,
                      selectionNode.selectionSet
                    ),
                  },
                };
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
        throw new TypeError(
          `Unexpected error: Type ${selectionNode.onType} does not exist within schema.`
        );
      }

      if (
        parentSchemaType.name === selectionNode.onType ||
        parentSchemaType
          .getInterfaces()
          .find((iinterface) => iinterface.name === selectionNode.onType) != null ||
        (isUnionType(fragmentType) &&
          fragmentType.getTypes().find((objectType) => objectType.name === parentSchemaType.name))
      ) {
        // also process fields from fragment that apply for this parentType
        const flatten = this.flattenSelectionSet(selectionNode.selectionNodes);
        const typeNodes = flatten.get(parentSchemaType.name) ?? [];
        selectionNodes.push(...typeNodes);
        for (const iinterface of parentSchemaType.getInterfaces()) {
          const tNodes = flatten.get(iinterface.name) ?? [];
          selectionNodes.push(...tNodes);
        }
      }
    }

    const linkFields: LinkField[] = [];
    for (const { field, selectedFieldType } of linkFieldSelectionSets.values()) {
      const realSelectedFieldType = getBaseType(selectedFieldType);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const selectionSet = this.createNext(realSelectedFieldType, field.selectionSet!);
      const isConditional = hasConditionalDirectives(field) || inlineFragmentConditional;
      linkFields.push({
        alias: field.alias
          ? this._processor.config.formatNamedField(field.alias.value, selectedFieldType)
          : undefined,
        name: this._processor.config.formatNamedField(
          field.name.value,
          selectedFieldType,
          isConditional
        ),
        selectionSet: this._processor.config.wrapTypeWithModifiers(
          selectionSet.transformSelectionSet().split(`\n`).join(`\n  `),
          selectedFieldType
        ),
        type: realSelectedFieldType.name,
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
      // @ts-expect-error
      ...(typeInfoField
        ? this._processor.transformTypenameField(typeInfoField.type, typeInfoField.name)
        : []),
      ...this._processor.transformPrimitiveFields(
        parentSchemaType,
        [...primitiveFields.values()].map((field) => ({
          fieldName: field.name.value,
          isConditional: hasConditionalDirectives(field),
        }))
      ),
      ...this._processor.transformAliasesPrimitiveFields(
        parentSchemaType,
        [...primitiveAliasFields.values()].map((field) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          alias: field.alias!.value,
          fieldName: field.name.value,
        }))
      ),
      ...this._processor.transformLinkFields(linkFields),
    ].filter(Boolean);

    const allStrings: string[] = transformed.filter((t) => typeof t === 'string') as string[];
    const allObjectsMerged: string[] = transformed
      .filter((t) => typeof t !== 'string')
      // @ts-expect-error
      .map((t: NameAndType) => `${t.name}: ${t.type}`);
    // @ts-expect-error
    let mergedObjectsAsString: string = null;

    if (allObjectsMerged.length > 0) {
      mergedObjectsAsString = this._processor.buildFieldsIntoObject(allObjectsMerged);
    }

    const fields = [...allStrings, mergedObjectsAsString, ...fragmentsSpreadUsages].filter(Boolean);

    return { transformed, typeString: this._processor.buildSelectionSetFromStrings(fields) };
  }

  public transformModelSelectionSetToType(
    fragmentName: string,
    fragmentSuffix: string,
    declarationBlockConfig: any
  ) {
    const { grouped } = this._buildGroupedSelections();

    // @ts-ignore
    const subTypes: { name: string; content: string }[] = Object.keys(grouped)
      .map((typeName) => {
        const possibleFields = grouped[typeName].filter(Boolean);
        const declarationName = this.buildFragmentTypeName(fragmentName, fragmentSuffix, typeName);

        if (possibleFields.length === 0) {
          if (!this._config.addTypename) {
            return { name: declarationName, content: this.getEmptyObjectType() };
          }

          return null;
        }

        const content = possibleFields
          .map((selectionObject) => {
            if (typeof selectionObject === 'string') return selectionObject;

            // @ts-ignore
            return '(' + selectionObject.union.join(' | ') + ')';
          })
          .join(' & ');

        return { name: declarationName, content };
      })
      .filter(Boolean);

    const modelName = this.buildFragmentTypeName(fragmentName, fragmentSuffix);
    const operationModelResult = indentMultiline(`${fragmentName}: ${subTypes[0].content}`);

    return {
      modelName,
      modelTypeDef: new DeclarationBlock(declarationBlockConfig)
        .export()
        .asKind('type')
        .withName(modelName)
        .withBlock(operationModelResult).string,
    };

    // TODO: do we ever need to process more than one subtype?
    // return [
    //   ...subTypes.map(
    //     (t) =>
    //       new DeclarationBlock(declarationBlockConfig)
    //         .export()
    //         .asKind('type')
    //         .withName(t.name)
    //         .withBlock(indentMultiline(`${fragmentName}: ${subTypes[0].content}`)).string
    //     ),
    //   new DeclarationBlock(declarationBlockConfig)
    //     .export()
    //     .asKind('type')
    //     .withName(fragmentTypeName)
    //     .withContent(subTypes.map(t => t.name).join(' | ')).string,
    // ].join('\n');
  }
}
