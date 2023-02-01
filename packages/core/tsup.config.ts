import { defineConfig } from 'tsup';
import path from 'path';

console.log(path.resolve(__dirname, './tsconfig.type.json'))

const config = defineConfig({
  clean: true,
  bundle: true,
  sourcemap: true,
  dts: true,
  entry: ["./src/index.ts"],
  format: ["cjs", "esm"],
  external: ["react", "@emotion/styled", "@emotion/react"],
  tsconfig: path.resolve(__dirname, './tsconfig.type.json'),
});

export default config;
