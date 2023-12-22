let gqlEndpoint = "";

export function registerGraphQLEndpointSetup(endpoint) {
    gqlEndpoint = endpoint;
}

export function getGqlEndpoint() {
    return gqlEndpoint;
}

let handlers = new Map();

export function registerHandlerSetup(key, handler) {
    handlers.set(key, handler)
}

export function retrieveHandler(key) {
    return handlers.has(key) ? handlers.get(key) : null;
}

let queries = new Map();

export function registerQuerySetup(key, query) {
    queries.set(key, query)
}

export function retrieveQuery(key) {
    return queries.has(key) ? queries.get(key) : null;
}

let errHandler = null;

export function registerErrHandler(errorHandler) {
    errHandler = errorHandler ? errorHandler : null;
}

export function getErrHandler() {
    return errHandler ? errHandler : null;
}

