const exec = require('child_process').exec;

module.exports = function sh(command, options) {
    return new Promise((resolve => {
        exec(command, options, function (error, stdout, stderr) {
            resolve({error, stdout, stderr});
        });
    }))
};

/*
 Example usage:

 let {error, stdout, stderr} = await sh('ls -la', {cwd: cloneFOLDER});
 ({error, stdout, stderr} = await sh('walkmod apply sonar:StringCheckOnLeft', {cwd: cloneFOLDER}));
*/