export function sha(event) {
  const gitSha = event && event.payload && event.payload.repository && event.payload.repository.revision;
  return (gitSha || "").substring(0, 7);
}
export function status(event) {
  switch (event.meta.status) {
    case "PROCESSED":
      return "PRCD (" + event.meta.processor_uuid + ")";
    default:
      return event.meta.status;
  }
}
export function webhook(event) {
  return event && event.payload && (event.payload['source-webhook'] || event.payload.source_webhook);
}

export function parent(event) {
  return event && event.payload && event.payload.parent && event.payload.parent.uuid;
}
