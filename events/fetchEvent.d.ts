import { Event } from "../";
declare function fetchEvent<T>({ event_type, uuid }: {
    event_type: any;
    uuid: any;
}): Promise<Event<T>>;
export { fetchEvent };
