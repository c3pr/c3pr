const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const config = require('../../config');
const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").default;

const _c3prLOG5 = c3prLOG5({sha: '!load-tools', caller_name: 'loadTools'});

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

function loadTools() {
    if (!config.c3pr.agent.agentToolsPath) {
        throw new Error(`You have to define a 'C3PR_AGENT_TOOLS_PATH' pointing to a folder with YAML files.`);
    }

    if (!fs.existsSync(config.c3pr.agent.agentToolsPath)) {
        throw new Error(`Path pointed by 'C3PR_AGENT_TOOLS_PATH' does not exist: ${config.c3pr.agent.agentToolsPath}`);
    }

    const DEFAULT_WEIGHT = 100;
    const yamlFileToAgent = filePath => {
        try {
            const loadedYaml = yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
            const {disabled, tool_id, extensions, tags, default_weight, command, pr_title, pr_body, multiple} = loadedYaml;

            const defaults = {disabled, tool_id, extensions, tags, command, pr_title, pr_body};

            return (multiple || [{default_weight}]).map(eachDeclaredAgent => {
                const agent = {...defaults, ...eachDeclaredAgent, weight: eachDeclaredAgent.default_weight || DEFAULT_WEIGHT};

                if (!agent.tool_id) { _c3prLOG5(`tool_id does not exist in a tool at YAML file ${filePath}! Ignoring tool!`); return null; }

                if (agent.disabled) { _c3prLOG5(`Tool ${agent.tool_id} in YAML file ${filePath} is disabled! Ignoring tool!`); return null; }

                if (!agent.extensions     ) { _c3prLOG5(     `extensions does not exist in tool ${agent.tool_id} at YAML file ${filePath}! Ignoring tool!`); return null; }
                if (!agent.tags           ) { _c3prLOG5(           `tags does not exist in tool ${agent.tool_id} at YAML file ${filePath}! Ignoring tool!`); return null; }
                if (!agent.default_weight ) { _c3prLOG5( `default_weight does not exist in tool ${agent.tool_id} at YAML file ${filePath}! Using ${DEFAULT_WEIGHT} as value.`); }
                if (!agent.command        ) { _c3prLOG5(        `command does not exist in tool ${agent.tool_id} at YAML file ${filePath}! Ignoring tool!`); return null; }
                if (!agent.pr_title       ) { _c3prLOG5(       `pr_title does not exist in tool ${agent.tool_id} at YAML file ${filePath}! Ignoring tool!`); return null; }
                if (!agent.pr_body        ) { _c3prLOG5(        `pr_body does not exist in tool ${agent.tool_id} at YAML file ${filePath}! Ignoring tool!`); return null; }

                return agent;
            }).filter(a => a);
        } catch (e) {
            _c3prLOG5(`ERROR Reading YAML file ${filePath}: ${e}`);
            return [];
        }
    };

    _c3prLOG5(`Loading tools YAML files...`);
    const yamlFiles = getYamlFiles(config.c3pr.agent.agentToolsPath);
    const agents = [];
    for (let yamlFile of yamlFiles) {
        const as = yamlFileToAgent(yamlFile);
        agents.push(...as);
    }
    return agents;
}

const tools = loadTools();
_c3prLOG5(`Tools YAML files loaded. Total of ${tools.length} enabled tools found.`);
const toolsSummary = tools.map(({tool_id, extensions, tags, weight}) => ({tool_id, extensions, tags, weight}));
const toolsHash = tools.reduce((_toolsHash, tool) => {
    return { ..._toolsHash, [tool.tool_id]: {extensions: tool.extensions, tags: tool.tags, command: tool.command, pr_title: tool.pr_title, pr_body: tool.pr_body} };
}, {});

module.exports = {
    toolsSummary,
    toolsHash
};