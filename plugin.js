export function setupOverride(event) {
    event.detail.headers["Content-Type"] = "application/json";

    let element = event.detail.elt;

    let vals = element.getAttribute("vals") || null;

    if (vals !== null) {
        vals = eval(`{${vals}}`);
    }

    let query = element.getAttribute("query") || null;

    if (query === null) {
        // TODO: handle error
    }

    event.detail.parameters = JSON.stringify({
        query: query,
        variables: vals
    });

    event.detail.target = getGqlEndpoint();
}

export function handleResponse(event) {
    const handler = event.detail.elt.hasAttribute("handler") ? retrieveHandler(event.detail.elt.getAttribute("handler").replace("/", "")) : null;

    // let handler = retrieveHandler(path.replace("/", ""));

    if (handler === null) {
        // TODO: handle error
    }

    event.detail.xhr.response = handler(event.detail.xhr.response);
}