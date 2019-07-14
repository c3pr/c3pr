const Sentry = require('@sentry/node');

export function getStatus(state: "opened" | "closed" | "merged") {
    switch (state) {
        case 'opened': return 'open';
        case 'closed': return state;
        case 'merged': return state;

        default:
            const message = 'Unknown state: ' + state;
            console.log(message);
            Sentry.captureMessage(message);
            return state;
    }
}