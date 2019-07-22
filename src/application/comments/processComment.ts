import {UpdatePrefsCommand, WEIGHT_MODIFICATION_PER_CLOSED_PR} from "../preferences/ProjectPreferences";
import {disableToolForAllChangedFiles, modifyWeightOfToolForAllFiles} from "../preferences/mappers";

interface Comment {
    matches(text: string): boolean;
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[];
    createResponseComment(): string;
}

const BUG: Comment = {
    matches(text: string): boolean {
        return mentionsC3prBotNickname(text) && text.includes("bug");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        return disableToolForAllChangedFiles(files, tool_id, timestamp);
    },
    createResponseComment(): string {
        return "A bug? Got it!";
    }
};
const MANUAL: Comment = {
    matches(text: string): boolean {
        return mentionsC3prBotNickname(text) && text.includes("manual");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        return modifyWeightOfToolForAllFiles(files, tool_id, timestamp, WEIGHT_MODIFICATION_PER_CLOSED_PR * -1);
    },
    createResponseComment(): string {
        return "You will handle the issue manually. Got it!";
    }
};

const allCommentTypes = [BUG, MANUAL];

function mentionsC3prBotNickname(text: string) {
    return text.includes('@c3pr-bot') || text.includes('@c3pr\\-bot') || text.includes('@c3pr\\\\-bot');
}

export async function generateCommandsFromComment(files: string[], tool_id: string, timestamp: string, text: string): Promise<UpdatePrefsCommand[]> {
    const commentType = allCommentTypes.find(ct => ct.matches(text));
    if (commentType) {
        return commentType.createCommand(files, tool_id, timestamp);
    }
    return [];
}