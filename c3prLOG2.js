const c3prLOG_original = require('./src/c3prLOG');
function c3prLOG2({ msg, logMetas, meta }) {
    c3prLOG_original(msg, meta || {}, ...logMetas);
}
module.exports = c3prLOG2;
//# sourceMappingURL=c3prLOG2.js.map