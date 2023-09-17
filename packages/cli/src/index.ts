import { Command } from 'commander';
import packageJSON from '../package.json';
import { cliBanner } from './messages';
import { tasks } from './tasks';
import { checkForTS, getPkgManager, getPkgJson } from './utils';
import path from 'path';

const program = new Command();

const path1 = path.join(process.cwd(), 'src/mocking/');
const path2 = path.join(process.cwd(), 'src/mocking/');

console.log({ cwd: process.cwd(), __dirname, path1, path2 });
console.log('relative', path.relative(path2, path1));

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
