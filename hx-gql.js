import {
    getErrHandler,
    registerErrHandler,
    registerHandlerSetup,
    registerQuerySetup,
    registerGraphQLEndpointSetup,
    getGqlEndpoint,
    retrieveHandler
} from './setup'

htmx.defineExtension('hx-gql', {
    onEvent : function (name, event) {
        if (name === "htmx:configRequest") {
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

        if (name === "htmx:afterRequest") {
            const path = event.detail.requestConfig.path;

            let handler = retrieveHandler(path.replace("/", ""));

            if (handler === null) {
                // TODO: handle error
            }

            event.detail.xhr.response = handler(event.detail.xhr.response);
        }

        if (name === "handleError") {
            // call custom error handler or log error
            let errHandler = getErrHandler();
            
            errHandler ? errHandler(event.detail.error) 
                : console.error(event.detail.error);
            
            return true;
        }
    },

    encodeParameters : function(xhr, parameters, element) {
        xhr.overrideMimeType('text/json');
        return (JSON.stringify(parameters))
    }
})

function handleError(element, error) {
    htmx.trigger(element, "handleError", { error: error });
}

export function registerGqlEndpoint(endpoint) {
    registerGraphQLEndpointSetup(endpoint);
}

export function registerHandler(key, handler) {
    registerHandlerSetup(key, handler);
}

export function registerQuery(key, query) {
    registerQuerySetup(key, query);
}

export function registerErrorHandler(errHandler) {
    registerErrHandler(errHandler);
}
