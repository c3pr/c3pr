const replace = require('replace-in-file');
/**
 * Despite its name, this file has nothing to do with rollup.
 * It replaces a string in the rollup-generated bundle that, due to the way sshpk is implemented, bugs.
 */
const options = {
    files: 'dist/c3pr-agent.js',
    from: /^util\.inherits\(PrivateKey, key\);$/m,
    to: 'setTimeout(() => { util.inherits(PrivateKey, key); });',
};

const changes = replace.sync(options);
console.log('Patched file:', changes.join(', '));