const fs = require('fs');

for (let i = 1; i <= 100; i++) {
    const template = template(i);

    fs.mkdirSync(`${__dirname}/tools`, {recursive: true});
    fs.writeFileSync(`${__dirname}/tools/txt-${i}.yml`, template)
}

function template(i) {

    return `tool_id: "agent_e2e:txt_${i}"
extensions: ["txt"]
tags: ["Plaintext"]
default_weight: 100

command: 'node -e "if (Math.floor(Math.random() * 95) === 0) fs.writeFileSync(\`#{filename}\`, \`txt_${i}\`)"'

pr_title: TXT Rule ${i}
pr_body: |
  This has been TXT Rule ${i}!`.replace(/\r?\n/g, '\r\n');

}