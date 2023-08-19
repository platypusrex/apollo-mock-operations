import { GraphQLInterfaceType, GraphQLObjectType } from 'graphql';
import {
  BaseSelectionSetProcessor,
  LinkField,
  PrimitiveAliasedFields,
  PrimitiveField,
  ProcessResult,
  SelectionSetProcessorConfig,
} from '@graphql-codegen/visitor-plugin-common';

export class TypeScriptSelectionSetProcessor extends BaseSelectionSetProcessor<SelectionSetProcessorConfig> {
  transformPrimitiveFields(
    schemaType: GraphQLInterfaceType | GraphQLObjectType,
    fields: PrimitiveField[]
  ): ProcessResult {
    if (fields.length === 0) {
      return [];
    }

    const parentName =
      (this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '') +
      this.config.convertName(schemaType.name, {
        useTypesPrefix: true,
      });

    let hasConditionals = false;
    const conditionalsList: string[] = [];
    let resString = `Pick<${parentName}, ${fields
      .map((field) => {
        if (field.isConditional) {
          hasConditionals = true;
          conditionalsList.push(field.fieldName);
        }
        return `'${field.fieldName}'`;
      })
      .join(' | ')}>`;

    if (hasConditionals) {
      const avoidOptional =
        // TODO: check type and exec only if relevant
        (this.config.avoidOptionals as any) === true ||
        (this.config.avoidOptionals as any)?.field ||
        (this.config.avoidOptionals as any)?.inputValue ||
        (this.config.avoidOptionals as any)?.object;
      /* eslint-enable @typescript-eslint/prefer-nullish-coalescing */
      const transform = avoidOptional ? 'MakeMaybe' : 'MakeOptional';
      resString = `${
        this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : ''
      }${transform}<${resString}, ${conditionalsList.map((field) => `'${field}'`).join(' | ')}>`;
    }
    return [resString];
  }

  transformTypenameField(type: string, name: string): ProcessResult {
    return [`{ ${name}: ${type} }`];
  }

  transformAliasesPrimitiveFields(
    schemaType: GraphQLInterfaceType | GraphQLObjectType,
    fields: PrimitiveAliasedFields[]
  ): ProcessResult {
    if (fields.length === 0) {
      return [];
    }

    const parentName =
      (this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '') +
      this.config.convertName(schemaType.name, {
        useTypesPrefix: true,
      });

    return [
      `{ ${fields
        .map((aliasedField) => {
          const value =
            aliasedField.fieldName === '__typename'
              ? `'${schemaType.name}'`
              : `${parentName}['${aliasedField.fieldName}']`;
          return `${aliasedField.alias}: ${value}`;
        })
        .join(', ')} }`,
    ];
  }

  transformLinkFields(fields: LinkField[]): ProcessResult {
    if (fields.length === 0) {
      return [];
    }

    return [
      `{ ${fields
        .map((field) => `${field.alias || field.name}: ${field.selectionSet}`)
        .join(', ')} }`,
    ];
  }
}
