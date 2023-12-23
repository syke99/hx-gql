import {getGqlEndpoint, retrieveHandler, retrieveQuery} from './setup'

export function setupOverride(event) {
    event.detail.headers["Content-Type"] = "application/json";

    let element = event.detail.elt;

    let vars = element.hasAttribute("vars") ? element.getAttribute("vars") : null;

    let varsObject = {}

    if (vars !== null) {
        vars.split("|").forEach((pair) => {
            let split = pair.split(":");

            if (split[1].endsWith("*")) {
                let fn = split[1].slice(0, -1);

                varsObject[split[0]] = eval(fn);
            } else {
                varsObject[split[0]] = split[1];
            }
        })
    }

    let query = element.hasAttribute("query") ? element.getAttribute("query") : null;

    if (query === null) {
        // TODO: handle error
        return
    }

    let body = JSON.stringify({
        query: retrieveQuery(query),
        variables: varsObject
    })

    event.detail.parameters = body;

    event.detail.target = getGqlEndpoint();
}

export function handleResponse(event) {
    const handler = event.detail.elt.hasAttribute("handler") ? retrieveHandler(event.detail.elt.getAttribute("handler").replace("/", "")) : null;

    if (handler === null) {
        // TODO: handle error
        return;
    }

    // TODO: figure out how to override the htmx xhr call's response and responseText fields
}