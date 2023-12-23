import { handleResponse, setupOverride } from './plugin';
import {
    registerErrHandler,
    registerHandlerSetup,
    registerQuerySetup,
    registerGraphQLEndpointSetup,
} from './setup'

htmx.defineExtension('hx-gql', {
    onEvent : function (name, event) {
        if (name === "htmx:configRequest") {
            setupOverride(event);
        }

        if (name === "htmx:afterRequest") {
            handleResponse(event);
        }
    },

    encodeParameters : function(xhr, parameters, element) {
        xhr.overrideMimeType('text/json');
        return (parameters)
    }
})

// function handleError(element, error) {
//     htmx.trigger(element, "handleError", { error: error });
// }

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
