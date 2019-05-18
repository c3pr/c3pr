const expect = require('chai').expect;
const cloneRepositoryLocally = require('./cloneRepositoryLocally');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const path = require('path');

const logger = x => console.log(x);
logger.lcid = () => 'fake';
const c3prLOG5 = require("node-c3pr-logger/c3prLOG5").__c3prLOG5(logger);



describe('cloneRepositoryLocally', () => {

    it('should have existing folder with specific files', async () => {

        const cloneFolder = await cloneRepositoryLocally({
            localUniqueCorrelationId: uuidv4(),
            cloneBaseDir: '/tmp/c3pr/test/clones',
            url: 'https://github.com/c3pr/sample-project-java-maven.git',
            branch: 'branch-for-clone-tests',
            revision: '30b03c1d8aa6ee670534b80edd0dc39c12644259',
            cloneDepth: 5
        }, c3prLOG5);

        expect(fs.existsSync(cloneFolder)).to.be.true;
        expect(fs.existsSync(path.join(cloneFolder, '.git'))).to.be.true;
        expect(fs.existsSync(path.join(cloneFolder, 'src', 'main', 'resources', 'some-branch-file.txt'))).to.be.true;
        expect(fs.existsSync(path.join(cloneFolder, 'src', 'main', 'resources', 'file-that-is-in-master-only.txt'))).to.be.false;

        rimraf(cloneFolder);

    }).timeout(10 * 1000);

});

function rimraf(dir_path) {
    if (fs.existsSync(dir_path)) {
        fs.readdirSync(dir_path).forEach(function(entry) {
            var entry_path = path.join(dir_path, entry);
            if (fs.lstatSync(entry_path).isDirectory()) {
                rimraf(entry_path);
            } else {
                fs.unlinkSync(entry_path);
            }
        });
        fs.rmdirSync(dir_path);
    }
}