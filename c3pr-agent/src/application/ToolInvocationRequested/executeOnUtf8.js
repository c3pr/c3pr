const chardet = require('chardet');
const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');

const ISO_8859_1 = 'ISO-8859-1';
const UTF_8 = 'utf8';

function convertEncoding(file, from, to) {
    return new Promise((resolve, reject) => {
        const convertedFileName = file + '.conv';
        const writeStream = fs.createWriteStream(convertedFileName);
        fs.createReadStream(file).pipe(iconv.decodeStream(from)).pipe(iconv.encodeStream(to)).pipe(writeStream);
        writeStream.on('close', function (err) {
            if (err) {
                reject(err);
            } else {
                fs.renameSync(convertedFileName, file);
                resolve();
            }
        });
    });
}
async function executeOnUtf8(baseFolder, file, callback) {
    const fullFilePath = path.join(baseFolder, file);
    if (chardet.detectFileSync(fullFilePath) === ISO_8859_1) {
        await convertEncoding(fullFilePath, ISO_8859_1, UTF_8);
        try {
            await callback();
        } finally {
            await convertEncoding(fullFilePath, UTF_8, ISO_8859_1);
        }
    } else {
        await callback();
    }
}

module.exports = executeOnUtf8;

// noinspection BadExpressionStatementJS
(async () => {



}); // add () to run it