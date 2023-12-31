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
    },

    encodeParameters : function(xhr, parameters, element) {
        xhr.overrideMimeType('text/json');
        return (parameters)
    },

    transformResponse : function(text, xhr, element) {
        return handleResponse(element, text);
    }
})

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
