import uuidv4 from "uuid/v4";

function timestamp() {
    return new Date().toISOString();
}

function uuid() {
    return uuidv4();
}

export default {
    timestamp,
    uuid
}