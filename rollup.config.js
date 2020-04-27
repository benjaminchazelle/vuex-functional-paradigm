import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import {terser} from 'rollup-plugin-terser'

export default {
    input: 'src/index.js',
    output: {
        format: 'umd',
        file: 'dist/vuex-functional-paradigm.js',
        name: 'vuex-functional-paradigm'
    },
    plugins: [
        commonjs(),
        resolve(),
        babel(),
        terser()
    ]
}
