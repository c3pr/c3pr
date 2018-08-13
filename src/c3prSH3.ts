import {exec, ExecOptions} from 'child_process';
import c3prLOG4 from "node-c3pr-logger/c3prLOG4";

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

export default async function c3prSH3(shCommand: string,
                       shOptions: { encoding: "buffer" | null } & ExecOptions | {} = {},
                       {lcid, sha, euuid, level: outerLevel, stdout: shouldStdOut = false, replacements}:
                           {lcid: string, sha: string, euuid: string, level?: number, stdout?: boolean, replacements?: {regex:RegExp, replaceWith:string}[]}) {
    const level = (outerLevel || 0) + 1;
    const hideTokens = s => replaceTokens(s, replacements || []);

    c3prLOG4(`\$ ${hideTokens(shCommand)}`, {lcid, sha, euuid, level});

    let {error, stdout, stderr} = await sh(shCommand, shOptions);
    if (shouldStdOut) {
        if (stdout.trim() === "")
            stdout = '<empty output>';
        c3prLOG4(hideTokens(stdout), {lcid, sha, euuid, level});
    }
    if (error) {
        c3prLOG4(`
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
            [/ERROR] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`,
            {lcid, sha, euuid, level}
        );
        throw new Error(hideTokens(error));
    }
    return (hideTokens(stdout) || '').trim();
}