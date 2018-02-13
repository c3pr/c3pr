
function createPrsFromPatches(patches) {
    return {
        meta: {
            correlationId: patches.meta.correlationId,
            compatibleSchemas: ["c3pr/c3pr::patches"],
            dates: patches.meta.dates.concat([{creatorNode: "c3pr", date: new Date().toISOString(), schema: "prs"}])
        },
        repository: patches.repository,
        patch: patches.patch
    };
}

module.exports = createPrsFromPatches;