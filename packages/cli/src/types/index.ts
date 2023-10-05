import type { PackageJson } from 'type-fest';
import { CodegenConfig } from '@graphql-codegen/cli';
import { Types } from '@graphql-codegen/plugin-helpers';

export type PkgManager = 'yarn' | 'npm' | 'pnpm';

export type Options = {
  pkgManager: PkgManager;
  pkgJson: PackageJson;
  useTS: boolean;
};

export type PluginMeta = {
  dep?: string;
  version?: string;
  outputPath: string;
  plugins?: string[];
  config: Types.ConfiguredOutput;
};

export type PluginGenerationOptions = {
  clientPreset?: PluginMeta;
  introspection?: PluginMeta;
  legacy?: PluginMeta;
};

export type PluginFileMeta = {
  fullpath: string;
  path: string;
  name: string;
  ext: string;
};

type CodegenConfigOptions = {
  packages: Record<string, string>[];
  config: CodegenConfig;
  file: PluginFileMeta;
  generation: PluginGenerationOptions;
  scriptName: string;
};

export type ListrContext = Options & {
  input?: boolean | string | Record<string, any>;
  codegen?: CodegenConfigOptions;
};
