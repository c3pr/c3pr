import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import minify from 'rollup-plugin-minify-es';
import replace from 'rollup-plugin-replace';

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/c3pr-agent.js',
        format: 'cjs'
    },
    external: ['events', 'path', 'tty', 'util', 'fs', 'net', 'buffer', 'string_decoder', 'stream', 'zlib', 'querystring', 'url', 'http', 'crypto', 'module', 'tls',
        'os', 'process', 'dns', 'punycode', 'https', 'dgram', 'assert', 'child_process'],

    plugins: [
        resolve(),
        commonjs(),
        json(),
        minify(),
        replace({
            __C3PR_AGENT_EXECUTABLE_VERSION__: require('./package.json').version
        })
    ],
};