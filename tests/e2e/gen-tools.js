const fs = require('fs');

function template(i) {

    return `tool_id: "agent_e2e:txt_${i}"
extensions: ["txt"]
tags: ["Plaintext"]
default_weight: 100

command: 'node -e "if (Math.floor(Math.random()*100)< ${CHANCE_OF_TRANSFORMATION} ) fs.writeFileSync(\`#{filename}\`, \`txt_${i}\`)"'

pr_title: TXT Rule ${i}
pr_body: |
  This has been TXT Rule ${i}!`.replace(/\r?\n/g, '\r\n');

}

const CHANCE_OF_TRANSFORMATION = 50; // e.g. 40 means 40% chance

// noinspection all
fs.mkdirSync(`${__dirname}/tools`, {recursive: true});
for (let i = 1; i <= 100; i++) {
    // noinspection all
    fs.writeFileSync(`${__dirname}/tools/txt-${i}.yml`, template(i))
}
