import {UpdatePrefsCommand, WEIGHT_MODIFICATION_PER_CLOSED_PR} from "../preferences/ProjectPreferences";
import {
    disableToolForAllFiles,
    disableToolForProject,
    modifyWeightOfToolForAllFiles
} from "../preferences/updatePrefsCommandMappers";

interface Comment {
    matches(text: string): boolean;
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[];
    createResponse(mention_handle: string): string;
}
const BUG: Comment = {
    matches(text: string): boolean {
        return text.includes("bug") && !text.includes("keep");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        return disableToolForAllFiles(files, tool_id, timestamp);
    },
    createResponse(mention_handle: string): string {
        return `:robot: A bug, ${mention_handle}? I'm sorry. I have disabled that type of transformation for all these files!`;
    }
};
const DISABLE_FOR_FILE: Comment = {
    matches(text: string): boolean {
        return text.includes("disable for file");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        return disableToolForAllFiles(files, tool_id, timestamp);
    },
    createResponse(mention_handle: string): string {
        return `:robot: Ok, ${mention_handle}. I have disabled this kind of transformation for this file!`;
    }
};
const DISABLE_FOR_PROJECT: Comment = {
    matches(text: string): boolean {
        return text.includes("disable for project");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        return disableToolForProject(tool_id, timestamp);
    },
    createResponse(mention_handle: string): string {
        return `:robot: Ok, ${mention_handle}. I have disabled this kind of transformation for all files of this project!`;
    }
};
const DISAGREE: Comment = {
    matches(text: string): boolean {
        return text.includes("disagree");
    },
    createCommand(): UpdatePrefsCommand[] {
        return [];
    },
    createResponse(mention_handle: string): string {
        return `:robot: Ok, ${mention_handle}, good to know! This transformation's priority has been reduced for this file.`;
    }
};
const MANUAL: Comment = {
    matches(text: string): boolean {
        return text.includes("manual");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        // does not count this PR as bad
        return modifyWeightOfToolForAllFiles(files, tool_id, timestamp, WEIGHT_MODIFICATION_PER_CLOSED_PR * -1);
    },
    createResponse(mention_handle: string): string {
        return `:robot: You will handle the issue manually. Got it, ${mention_handle}!`;
    }
};
const CONFLICT: Comment = {
    matches(text: string): boolean {
        return text.includes("conflict");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        // does not count this PR as bad
        return modifyWeightOfToolForAllFiles(files, tool_id, timestamp, WEIGHT_MODIFICATION_PER_CLOSED_PR * -1);
    },
    createResponse(mention_handle: string): string {
        return `:robot: Yeah, conflict is probably not worth it to fix. Got it, ${mention_handle}! I will not reduce the priority for this kind of suggestion for now.`;
    }
};
const HELP: Comment = {
    matches(text: string): boolean {
        return text.includes("help");
    },
    createCommand(files: string[], tool_id: string, timestamp: string): UpdatePrefsCommand[] {
        return [];
    },
    createResponse(mention_handle: string): string {
        return `:robot: Hey, ${mention_handle}! You can send commands by mentioning me in comments. The ones available are:
        
- \`@c3pr\\-bot manual\`: lets me know you will perform yourself, manually, the change this PR suggested. This means I should not reduce the priority for
this kind of transformation when you close this PR.
- \`@c3pr\\-bot conflict\`: tells me you closed this PR due to a conflict that you don't feel like fixing. I will also not reduce the priority for
this kind of transformation when you close this PR.
- \`@c3pr\\-bot disagree\`: indicates that you didn't agree with the proposed changes. The priority for this kind of suggestion will be reduced.
- \`@c3pr\\-bot disable for file\`: disables this transformation for this file.
- \`@c3pr\\-bot disable for project\`: disables this transformation for all files of this project.
- \`@c3pr\\-bot bug\`: points out that this transformation generated a bug. I will disable the transformation for the file, and if it happens more times, for the whole project.
- \`@c3pr\\-bot help\`: I will reply with this message.

Anyway, whenever you mention me, I will let you know if I understood the command or not. :v:
        `;
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
        return `:robot: I'm sorry, ${mention_handle}. I didn't understand your last comment.
         If you wish to know the available commands, write a comment with \`@c3pr\-bot help\` and I will let you know!`;
    }
};

// the order here is important -- eg "disagree: disable for file" should be processed as "disabled for file" rather than "disagree"
const COMMENT_TYPES = [DISABLE_FOR_PROJECT, DISABLE_FOR_FILE, DISAGREE, CONFLICT, MANUAL, BUG, HELP, UNRECOGNIZED_COMMENT];

export function generateCommandsFromComment(files: string[], tool_id: string, timestamp: string, text: string): UpdatePrefsCommand[] {
    return COMMENT_TYPES.find(ct => ct.matches(text)).createCommand(files, tool_id, timestamp);
}

export function generateResponseForComment(text: string, mention_handle: string): string | null {
    return COMMENT_TYPES.find(ct => ct.matches(text)).createResponse(mention_handle);
}