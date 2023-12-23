import { makeGreaphQLRequest } from './plugin'
import {
    getErrHandler,
    registerErrHandler,
    registerHandlerSetup,
    registerQuerySetup,
    registerGraphQLEndpointSetup
} from './setup'

htmx.defineExtension('hx-gql', {
    onEvent : function (name, event) {
        if (name === "htmx:beforeRequest") {
            let element = event.detail.elt;

            htmx.trigger(element, "htmx:afterRequest", event.detail);
            return true;
        }

        if (name === "htmx:afterRequest") {
            const path = event.detail.requestConfig.path;

            const element = event.detail.elt;

            let result = makeGreaphQLRequest(path, element);

            if (result instanceof Error) {
                handleError(element, result)
                return true;
            }

            let xhr = event.detail.xhr;

            xhr.resultType = "text";
    
            xhr.result = result;
            
            event.detail.xhr = xhr;
            return true;
        }

        if (name === "handleError") {
            // call custom error handler or log error
            let errHandler = getErrHandler();
            
            errHandler ? errHandler(event.detail.error) 
                : console.error(event.detail.error);
            
            return true;
        }
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
