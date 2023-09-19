import { PromptOptions } from 'listr2';

type CommonPrompts =
  | 'schema'
  | 'generationPath'
  | 'introspectionPath'
  | 'configFileName'
  | 'configFileNameJS'
  | 'scriptName';

export const commonPrompts: Record<CommonPrompts, PromptOptions> = {
  schema: {
    type: 'Input',
    message: 'Where is your graphQL schema?',
    initial: 'http://localhost:4000/graphql',
    required: true,
  },
  generationPath: {
    type: 'Input',
    message: 'Where to write the output?',
    initial: 'src/gql/',
    required: true,
  },
  introspectionPath: {
    type: 'Input',
    message: 'Where to output the introspection file (we recommend using the default)?',
    initial: 'src/mocking/introspection.json',
    required: true,
  },
  configFileName: {
    type: 'Input',
    message: 'How to name the config file?',
    initial: 'codegen.ts',
    required: true,
  },
  configFileNameJS: {
    type: 'Input',
    message: 'How to name the config file?',
    initial: 'codegen.js',
    required: true,
  },
  scriptName: {
    type: 'Input',
    message: 'What script in package.json should run the codegen?',
    initial: 'codegen',
    required: true,
  },
};
