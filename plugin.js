import { getGqlEndpoint, retrieveHandler, retrieveQuery } from './setup'

function extractRequestDetails(element) {
    let details = [];
    
    let queryKey = element.getAttribute("query") || null;

    if (queryKey !== null) {
        details.push(retrieveQuery(queryKey));
    }

    let vals = element.getAttribute("vals") || null;

    if (vals !== null) {
        details.push(eval(`{${vals}}`))
    }

    return details;
}

export function makeGreaphQLRequest(path, element) {
    let handler = retrieveHandler(path.replace("/", ""))

    if (handler === null) {
        return new Error("no handler found for specified key")
    }

    let { query, vals } = extractRequestDetails(element)

    if (query === null) {
        return new Error("requested query not registered");
    }

    let queryBody = JSON.stringify({
        query: query,
        variables: vals
    })

    let endpoint = getGqlEndpoint();

    fetch(endpoint, {
        method: "POST",
        mode: "cors",
        headers: {
            "content-type": "application/json",
        },
        body: queryBody,
    }).then((result) => {
        handler(result);
    }).catch((err) => {
        return err
    })
}
