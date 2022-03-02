import axios from "axios";
import {Event, hubClientConfig} from "../";

async function fetchEvent<T>({event_type, uuid}): Promise<Event<T>> {
    let {data: event} = await axios.get(hubClientConfig.c3pr.hub.eventsUrl({event_type, uuid}), {headers: hubClientConfig.headers()});
    return event;
}

export { fetchEvent }