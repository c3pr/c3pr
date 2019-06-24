import shuffleArray from "../../adapters/shuffleArray";


export async function prioritizeToolsForCommit(changesCommittedRootEuuid, tools) {
    return shuffleArray(tools).sort((t1, t2) => t1.weight - t2.weight)
}