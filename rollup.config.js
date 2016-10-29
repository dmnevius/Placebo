/* eslint import/no-extraneous-dependencies: ['off'] */
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/main.js',
  dest: 'dist/placebo.js',
  plugins: [
    commonjs(),
    babel({
      exclude: 'node_modules',
    }),
    cleanup(),
  ],
  globals: {
    'es6-symbol': 'Symbol',
  },
  format: 'umd',
  moduleName: 'placebo',
};
