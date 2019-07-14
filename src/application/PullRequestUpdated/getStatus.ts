export function getStatus(state: "opened" | "closed" | "merged") {
    switch (state) {
        case 'opened': return 'open';
        default: return state;
    }
}