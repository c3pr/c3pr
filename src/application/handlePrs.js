
function handlePrs(prs) {
    console.log(`[${prs.meta.correlationId}] [handlePrs] Handling pr request ${JSON.stringify(prs)}...`);
}

module.exports = handlePrs;