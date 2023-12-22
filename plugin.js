import { getGqlEndpoint, retrieveHandler, retrieveQuery } from './setup'

function extractRequestDetails(element) {
    let details = [];
    
    let queryKey = element.getAttribute("query") || null;

    details.push(retrieveQuery(queryKey));

    details.push(eval("{" + element.getAttribute("include-vals") + "}") || null);

    return details;
}

function makeHandlerPromise(path) {
    let handlerKey = path.replace("/", "")

    let handler = retrieveHandler(handlerKey);

    return new Promise((res, rej) => {
        if (handler === null) {
            rej(new Error("no available handler module for GraphQL request"))
        } else {
            res(handler)
        }
    })
}

export async function makeGreaphQLRequest(verb, path, element) {
    let handlerPromise = makeHandlerPromise(path)

    handlerPromise.then((handler) => {
        let { query, vals } = extractRequestDetails(element)

        if (query === null) {
            throw new Error("requested query not registered");
        }

        let queryBody = JSON.stringify({
            query: query,
            variables: vals
        })

        let endpoint = getGqlEndpoint();

        fetch(endpoint, {
            method: verb,
            headers: {
                "content-type": "application/json",
            },
            body: queryBody,
        }).then((result) => {
            handler(result);
        }).catch((err) => {
            throw err
        })
    }, (err) => {
        return err
    })
}
