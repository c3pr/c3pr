import {UpdatePrefsCommand, WEIGHT_MODIFICATION_PER_CLOSED_PR} from "../preferences/ProjectPreferences";
import {disableToolForAllChangedFiles, modifyWeightOfToolForAllFiles} from "../preferences/mappers";

interface Comment {
    matches(text: string): boolean;
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[];
    createResponse(mention_handle: string): string;
}
const BUG: Comment = {
    matches(text: string): boolean {
        return text.includes("bug");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        return disableToolForAllChangedFiles(files, tool_id, timestamp);
    },
    createResponse(mention_handle: string): string {
        return `A bug, ${mention_handle}? I'm sorry. I have disabled that type of transformation for this project!`;
    }
};
const MANUAL: Comment = {
    matches(text: string): boolean {
        return text.includes("manual");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        return modifyWeightOfToolForAllFiles(files, tool_id, timestamp, WEIGHT_MODIFICATION_PER_CLOSED_PR * -1);
    },
    createResponse(mention_handle: string): string {
        return `You will handle the issue manually. Got it, ${mention_handle}!`;
    }
};
const UNRECOGNIZED_COMMENT: Comment = {
    matches(): boolean {
        return true;
    },
    createCommand(): UpdatePrefsCommand[] {
        return [];
    },
    createResponse(mention_handle: string): string {
        return `I'm sorry, ${mention_handle}. I didn't understand your last comment.`;
    }
};

const COMMENT_TYPES = [BUG, MANUAL, UNRECOGNIZED_COMMENT];

export function generateCommandsFromComment(files: string[], tool_id: string, timestamp: string, text: string): UpdatePrefsCommand[] {
    return COMMENT_TYPES.find(ct => ct.matches(text)).createCommand(files, tool_id, timestamp);
}

export function generateResponseForComment(text: string, mention_handle: string): string | null {
    return COMMENT_TYPES.find(ct => ct.matches(text)).createResponse(mention_handle);
}