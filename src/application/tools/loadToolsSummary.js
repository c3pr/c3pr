const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const config = require('../../config');

function getYamlFiles(dir) {
    const yamlFiles = [];
    fs.readdirSync(dir).forEach(function (fileName) {
        const fullFile = path.join(dir, fileName);
        if (fs.statSync(fullFile).isDirectory()) {
            yamlFiles.push(...getYamlFiles(fullFile));
        } else {
            const extension = (path.extname(fullFile) || '').toLowerCase();
            if (extension === '.yml' || extension === '.yaml') {
                yamlFiles.push(fullFile);
            }
        }
    });
    return yamlFiles;
}


/*
TODO: add testing for yaml properties
ignore file if not good enough properties. give good error message.
halt agent loading (or not?) if no tool yaml file is found
 */

function loadToolsSummary() {
    if (!config.c3pr.agent.agentToolsPath) {
        throw new Error(`You have to define a 'C3PR_AGENT_TOOLS_PATH' pointing to a folder with YAML files.`);
    }

    if (!fs.existsSync(config.c3pr.agent.agentToolsPath)) {
        throw new Error(`Path pointed by 'C3PR_AGENT_TOOLS_PATH' does not exist: ${config.c3pr.agent.agentToolsPath}`);
    }

    return getYamlFiles(config.c3pr.agent.agentToolsPath).map(filePath => {
        const {tool_id, extensions, tags} = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));

        if (!tool_id   ) { console.log(   `tool_id does not exist in YAML file ${filePath}! Ignoring file!`); return null; }
        if (!extensions) { console.log(`extensions does not exist in YAML file ${filePath}! Ignoring file!`); return null; }
        if (!tags      ) { console.log(      `tags does not exist in YAML file ${filePath}! Ignoring file!`); return null; }

        return {tool_id, extensions, tags};
    }).filter(f => f);
}

module.exports = loadToolsSummary;