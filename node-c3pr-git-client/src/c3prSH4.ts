import {exec, ExecOptions} from 'child_process';

function sh(command, options: { encoding: "buffer" | null } & ExecOptions | {}): Promise<{error, stdout, stderr}> {
    return new Promise((resolve => {
        exec(command, options, function (error, stdout, stderr) {
            resolve({error, stdout, stderr});
        });
    }))
}

export default async function c3prSH4(
        shCommand: string,
        shOptions: { encoding: "buffer" | null } & ExecOptions | {} = {},
        _c3prLOG5,
        shouldStdOut?
    ) {
    const __c3prLOG5 = _c3prLOG5({level: (_c3prLOG5.level || 0) + 1});

    __c3prLOG5(`\$ ${shCommand}`);

    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (shouldStdOut) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        __c3prLOG5(stdout);
    }
    if (error) {
        __c3prLOG5(`
            [ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                        
            -- SHELL COMMAND FAILED --
            
            COMMAND: ${shCommand}
            OPTIONS: ${JSON.stringify(shOptions)}
            There as an error: ${error}
            ------------------------------
            STDOUT:
            ${stdout}
            ------------------------------
            STDERR:
            ${stderr}
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`
        );
        // todo expose hide function from c3prLOG5 and use it in the error below
        throw new Error(error);
    }
    return (stdout || '').trim();
}