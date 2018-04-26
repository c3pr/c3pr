const https = require("https");
const vm = require('vm');

let c3prAgentSource = "";
let count = 0;

// var ff = require('fs').readFileSync('G:\\MSc-Tools\\c3pr\\c3pr-agent\\dist\\c3pr-agent.js');
// console.log(ff.toString().length);

console.log(`Agent executable version __C3PR_AGENT_EXECUTABLE_VERSION__.`);

const c3prAgentDistUrl = 'https://raw.githubusercontent.com/c3pr/c3pr-agent/master/dist/c3pr-agent.js';
console.log(`Fetching latest agent from ${c3prAgentDistUrl}...`);

https.request(c3prAgentDistUrl, function(res) {
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        c3prAgentSource += chunk;

        process.stdout.write("|");
        count++;
        if (count % 100 === 0) console.log("");
    });
    res.on("end", function () {
        console.log(`\nDownload complete - ${count} parts. Source length: ${c3prAgentSource.length}`);

        vm.runInNewContext(c3prAgentSource, {require, console, Buffer, process, module, setTimeout, clearTimeout});
    });
}).end();