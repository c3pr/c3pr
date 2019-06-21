

export async function prioritizeToolsForCommit(changesCommittedRootEuuid, tools) {
    return tools.sort((t1, t2) => t1.weight||0 - t2.weight||0)
}