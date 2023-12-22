import { makeGreaphQLRequest } from './plugin'

htmx.defineExtension('hx-gql', {
    onEvent : function (name, event) {
        if (name === "htmx:beforeRequest") {
            let element = event.detail.etl;

            htmx.trigger(element, "htmx:afterRequest", event.detail);
        }

        if (name === "htmx:afterRequest") {
            const path = event.detail.requestConfig.path;

            const element = event.detail.etl;

            makeGreaphQLRequest(path, element).
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
            return errHandlerCallback ? errHandlerCallback() 
                : console.log(event.detail.error);
        }
    }
})

let errHandlerCallback = null;

export function errorHandler(callback) {
    errHandlerCallback = callback;
}

function handleError(element, error) {
    htmx.trigger(element, "handleError", { error: error });
}
