import {exec, ExecOptions} from 'child_process';
import c3prLOG5 from "node-c3pr-logger/c3prLOG5";

function sh(command, options: { encoding: "buffer" | null } & ExecOptions | {}): Promise<{error, stdout, stderr}> {
    return new Promise((resolve => {
        exec(command, options, function (error, stdout, stderr) {
            resolve({error, stdout, stderr});
        });
    }))
}

function replaceTokens(input, replacements: {regex:RegExp, replaceWith:string}[]) {
    let inputAfterReplacements = input;
    replacements.forEach(({regex, replaceWith}) => {
        inputAfterReplacements = inputAfterReplacements.replace(regex, replaceWith)
    });
    return inputAfterReplacements;
}

export default async function c3prSH3(
        shCommand: string,
        shOptions: { encoding: "buffer" | null } & ExecOptions | {} = {},
        {lcid, sha, euuid, level: outerLevel, stdout: shouldStdOut = false, replacements}: {lcid?, sha?, euuid?, level?: number, stdout?: boolean, replacements?: {regex:RegExp, replaceWith:string}[]},
        _c3prLOG5?
    ) {
    const level = (outerLevel || 0) + 1;
    const __c3prLOG5 = _c3prLOG5 || c3prLOG5({lcid, sha, euuid});
    const ___c3prLOG5 = __c3prLOG5({level});

    const hideTokens = s => replaceTokens(s, replacements || []);

    ___c3prLOG5(`\$ ${hideTokens(shCommand)}`);

    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (shouldStdOut) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        ___c3prLOG5(hideTokens(stdout));
    }
    if (error) {
        ___c3prLOG5(`
            [ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                        
            -- SHELL COMMAND FAILED --
            
            COMMAND: ${hideTokens(shCommand)}
            OPTIONS: ${hideTokens(JSON.stringify(shOptions))}
            There as an error: ${hideTokens(error)}
            ------------------------------
            STDOUT:
            ${hideTokens(stdout)}
            ------------------------------
            STDERR:
            ${hideTokens(stderr)}
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`
        );
        throw new Error(hideTokens(error));
    }
    return (hideTokens(stdout) || '').trim();
}