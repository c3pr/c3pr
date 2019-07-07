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
        'os', 'process', 'dns', 'punycode', 'https', 'dgram', 'assert', 'child_process', 'domain'],

    plugins: [
        resolve(),
        commonjs({
            namedExports: {
                // left-hand side can be an absolute path, a path
                // relative to the current directory, or the name
                // of a module in node_modules
                'node_modules/lru_map/lru.js': [ 'LRUMap' ]
            }
        }),
        json(),
        minify(),
        replace({
            __C3PR_AGENT_BUNDLE_VERSION__: require('./package.json').version,
            __C3PR_AGENT_BUNDLE_DATE__: new Date().toISOString().replace("T", " ")
        })
    ],
};