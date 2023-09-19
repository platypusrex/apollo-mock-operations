import { Command } from 'commander';
import packageJSON from '../package.json';
import { cliBanner } from './messages';
import { tasks } from './tasks';
import { checkForTS, getPkgManager, getPkgJson } from './utils';

const program = new Command();

program
  .name('create-apollo-mocks')
  .description('CLI for initializing apollo-mock-operations in your project')
  .version(packageJSON.version);

program.command('init').action(async () => {
  cliBanner();

  try {
    const pkgManager = await getPkgManager();
    const pkgJson = getPkgJson();
    const useTS = checkForTS(pkgJson);
    await tasks.run({
      pkgJson,
      pkgManager,
      useTS,
      codegen: {} as any,
    });
  } catch (e) {
    console.error(e);
  }
});

program.parse();
