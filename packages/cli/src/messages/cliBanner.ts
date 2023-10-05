import chalk from 'chalk';
import figlet from 'figlet';

export const cliBanner = () => {
  console.log(
    chalk.blueBright(
      figlet.textSync('apollo mocks', {
        font: 'Small', // Graceful, JS Bracket Letters, Ogre, Retangles
      })
    )
  );
  console.log('\nWelcome to the apollo-mock-operations project scaffolding CLI.');
  console.log(`Let's get started by answering a few questions about your project.\n`);
};
