import {
  AvoidOptionalsConfig,
  ConvertNameFn,
  getBaseTypeNode,
  indent,
  InterfaceOrVariable,
  normalizeAvoidOptionals,
  NormalizedScalarsMap,
  OperationVariablesToObject, ParsedDirectiveArgumentAndInputFieldMappings, ParsedEnumValuesMap
} from '@graphql-codegen/visitor-plugin-common';
import { DirectiveNode, Kind, TypeNode } from 'graphql';

export class TypeScriptOperationVariablesToObject extends OperationVariablesToObject {
  constructor(
    _scalars: NormalizedScalarsMap,
    _convertName: ConvertNameFn,
    private _avoidOptionals: boolean | AvoidOptionalsConfig,
    private _immutableTypes: boolean,
    _namespacedImportName: string | null = null,
    _enumNames: string[] = [],
    _enumPrefix = true,
    _enumValues: ParsedEnumValuesMap = {},
    _applyCoercion: Boolean = false,
    _directiveArgumentAndInputFieldMappings: ParsedDirectiveArgumentAndInputFieldMappings = {},
    private _maybeType = 'Maybe'
  ) {
    super(
      _scalars,
      _convertName,
      _namespacedImportName,
      _enumNames,
      _enumPrefix,
      _enumValues,
      _applyCoercion,
      _directiveArgumentAndInputFieldMappings
    );
  }

  private clearOptional(str: string): string {
    const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';
    const rgx = new RegExp(`^${this.wrapMaybe(`(.*?)`)}$`, 'i');

    if (str.startsWith(`${prefix}${this._maybeType}`)) {
      return str.replace(rgx, '$1');
    }

    return str;
  }

  public wrapAstTypeWithModifiers(baseType: string, typeNode: TypeNode, applyCoercion = false): string {
    if (typeNode.kind === Kind.NON_NULL_TYPE) {
      const type = this.wrapAstTypeWithModifiers(baseType, typeNode.type, applyCoercion);

      return this.clearOptional(type);
    } else if (typeNode.kind === Kind.LIST_TYPE) {
      const innerType = this.wrapAstTypeWithModifiers(baseType, typeNode.type, applyCoercion);
      const listInputCoercionExtension = applyCoercion ? ` | ${innerType}` : '';

      return this.wrapMaybe(
        `${this._immutableTypes ? 'ReadonlyArray' : 'Array'}<${innerType}>${listInputCoercionExtension}`
      );
    } else {
      return this.wrapMaybe(baseType);
    }
  }

  protected formatFieldString(fieldName: string, isNonNullType: boolean, hasDefaultValue: boolean): string {
    return `${fieldName}${this.getAvoidOption(isNonNullType, hasDefaultValue) ? '?' : ''}`;
  }

  // protected formatTypeString(fieldType: string, isNonNullType: boolean, hasDefaultValue: boolean): string {
  //   if (!hasDefaultValue && isNonNullType) {
  //     return this.clearOptional(fieldType);
  //   }
  //
  //   return fieldType;
  // }

  protected wrapMaybe(type?: string) {
    const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';
    return `${prefix}${this._maybeType}${type ? `<${type}>` : ''}`;
  }

  protected getAvoidOption(isNonNullType: boolean, hasDefaultValue: boolean) {
    const options = normalizeAvoidOptionals(this._avoidOptionals);
    return ((options.object || !options.defaultValue) && hasDefaultValue) || (!options.object && !isNonNullType);
  }

  protected getPunctuation(): string {
    return ';';
  }

  protected formatTypeString(fieldType: string): string {
    return fieldType;
  }

  getName<TDefinitionType extends InterfaceOrVariable>(node: TDefinitionType): string {
    if (node.name) {
      if (typeof node.name === 'string') {
        return node.name;
      }

      return node.name.value;
    } else if (node.variable) {
      return node.variable.name.value;
    }

    // @ts-ignore
    return null;
  }

  transform<TDefinitionType extends InterfaceOrVariable>(variablesNode: ReadonlyArray<TDefinitionType>): string {
    if (!variablesNode || variablesNode.length === 0) {
      // @ts-ignore
      return null;
    }

    // console.log(
    //   'variable transform',
    //   variablesNode.map(variable => indent(this.transformVariable(variable)))
    // )

    return (
      variablesNode.map(variable => indent(this.transformVariable(variable))).join(`${this.getPunctuation()}\n`) +
      this.getPunctuation()
    );
  }

  protected getScalar(name: string): string {
    const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';

    return `${prefix}Scalars['${name}']`;
  }

  protected getDirectiveMapping(name: string): string {
    return `DirectiveArgumentAndInputFieldMappings['${name}']`;
  }

  protected getDirectiveOverrideType(directives: ReadonlyArray<DirectiveNode>): string | null {
    if (!this._directiveArgumentAndInputFieldMappings) return null;

    const type = directives
      .map(directive => {
        const directiveName = directive.name.value;
        if (this._directiveArgumentAndInputFieldMappings[directiveName]) {
          return this.getDirectiveMapping(directiveName);
        }
        return null;
      })
      .reverse()
      .find(a => !!a);

    return type || null;
  }

  protected transformVariable<TDefinitionType extends InterfaceOrVariable>(variable: TDefinitionType): string {
    let typeValue = null;
    const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';

    if (typeof variable.type === 'string') {
      typeValue = variable.type;
    } else {
      const baseType = getBaseTypeNode(variable.type);
      const overrideType = variable.directives ? this.getDirectiveOverrideType(variable.directives) : null;
      const typeName = baseType.name.value;

      if (overrideType) {
        typeValue = overrideType;
      } else if (this._scalars[typeName]) {
        typeValue = this.getScalar(typeName);
      } else if (this._enumValues[typeName] && this._enumValues[typeName].sourceFile) {
        typeValue = this._enumValues[typeName].typeIdentifier || this._enumValues[typeName].sourceIdentifier;
      } else {
        typeValue = `${prefix}${this._convertName(baseType, {
          useTypesPrefix: this._enumNames.includes(typeName) ? this._enumPrefix : true,
        })}`;
      }
    }

    const fieldName = this.getName(variable);
    const fieldType = this.wrapAstTypeWithModifiers(typeValue!, variable.type, !!this._applyCoercion);

    const hasDefaultValue = variable.defaultValue != null && typeof variable.defaultValue !== 'undefined';
    const isNonNullType = variable.type.kind === Kind.NON_NULL_TYPE;

    const formattedFieldString = this.formatFieldString(fieldName, isNonNullType, hasDefaultValue);
    const formattedTypeString = this.formatTypeString(fieldType /*, isNonNullType, hasDefaultValue*/);

    return `${formattedFieldString}: ${formattedTypeString}`;
  }

  // public wrapAstTypeWithModifiers(_baseType: string, _typeNode: TypeNode, _applyCoercion?: Boolean): string {
  //   throw new Error(`You must override "wrapAstTypeWithModifiers" of OperationVariablesToObject!`);
  // }

  // protected formatFieldString(fieldName: string, isNonNullType: boolean, _hasDefaultValue: boolean): string {
  //   return fieldName;
  // }

  // protected formatTypeString(fieldType: string, isNonNullType: boolean, hasDefaultValue: boolean): string {
  //   const prefix = this._namespacedImportName ? `${this._namespacedImportName}.` : '';
  //
  //   if (hasDefaultValue) {
  //     return `${prefix}Maybe<${fieldType}>`;
  //   }
  //
  //   return fieldType;
  // }

  // protected getPunctuation(): string {
  //   return ',';
  // }
}
