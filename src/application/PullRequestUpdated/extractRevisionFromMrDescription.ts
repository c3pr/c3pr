export default function extractRevisionFromMrDescription(description: string) {
    // Expected message format: "dfasdfasdffd This fix was generated in response to the commit 5aeb86edb4a17cb985c13a4db14a4b66064ef94b.".match(/(\w+)\.$/)[1]
    return description.match(/(\w+)\.$/)[1];
}