import {exec, ExecOptions} from 'child_process';
import c3prLOG3 from "node-c3pr-logger/c3prLOG3";

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

async function c3prSH3(shCommand: string,
                       shOptions: { encoding: "buffer" | null } & ExecOptions | {} = {},
                       {ids = [], stdout: shouldStdOut = false, replacements}: {ids?: (string|number)[], stdout?: boolean, replacements?: {regex:RegExp, replaceWith:string}[]} = {}
                       ) {
    const hideTokens = s => replaceTokens(s, replacements || []);

    c3prLOG3(`\$ ${hideTokens(shCommand)}`, {ids});

    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (shouldStdOut) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        c3prLOG3(hideTokens(stdout), {ids});
    }
    if (error) {
        c3prLOG3(`
            [ERROR] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            COMMAND: ${hideTokens(shCommand)}
            OPTIONS: ${hideTokens(JSON.stringify(shOptions))}
            There as an error: ${hideTokens(error)}
            ------------------------------
            STDOUT:
            ${hideTokens(stdout)}
            ------------------------------
            STDERR:
            ${hideTokens(stderr)}
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`,
            {ids}
        );
        throw new Error(hideTokens(error));
    }
    return (hideTokens(stdout) || '').trim();
}

// noinspection JSUnusedGlobalSymbols
export default c3prSH3;