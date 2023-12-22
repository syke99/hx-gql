import { makeGreaphQLRequest } from './plugin'
import { getErrHandler, registerErrHandler, registerHandlerSetup, registerGraphQLEndpoint } from './setup'

htmx.defineExtension('hx-gql', {
    onEvent : function (name, event) {
        if (name === "htmx:beforeRequest") {
            let element = event.detail.etl;

            htmx.trigger(element, "htmx:afterRequest", event.detail);
        }

        if (name === "htmx:afterRequest") {
            const verb = event.detail.requestConfig.verb;

            const path = event.detail.requestConfig.path;

            const element = event.detail.etl;

            makeGreaphQLRequest(verb, path, element).
                then((result) => {
                    let xhr = event.detail.xhr;

                    xhr.resultType = "text";
            
                    xhr.result = result.text();
                    
                    event.detail.xhr = xhr;
                    return;
                }).
                catch((error) => {
                    handleError(element, error);
                    return;
                })
        }

        if (name === "handleError") {
            // call custom error handler or log error
            let errHandler = getErrHandler();
            return errHandler ? errHandler(event.detail.error) 
                : console.error(event.detail.error);
        }
    }
})

function handleError(element, error) {
    htmx.trigger(element, "handleError", { error: error });
}

export function registerGqlEndpoint(endpoint) {
    registerGraphQLEndpoint(endpoint)
}

export function registerHandler(key, handler) {
    registerHandlerSetup(key, handler)
}

export function registerErrorHandler(errHandler) {
    registerErrHandler(errHandler)
}
