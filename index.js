import createPlugin from '@extism/extism';

htmx.defineExtension('hx-gql', {
    onEvent : function (name, event) {
        if (name === "htmx:beforeRequest") {
            let element = event.detail.etl;

            htmx.trigger(element, "htmx:afterRequest");
        }

        if (name === "htmx:afterRequest") {
            const path = event.detail.requestConfig.path;

            let pathSplit = path.split("/");

            const element = event.detail.etl;

            let { query, op, vals } = extractRequestDetails(element)

            let handler;

            if (pathSplit.length > 1) {
                handler = retrieveHandlerModule(pathSplit[1]);
            } else {
                handler = retrieveHandlerModule(query);
            }

            if (!handler) {
                handleError(element, "no available handler module for GraphQL request");
                return;
            }

            createPluginFromRequest(handler, JSON.stringify({
                operation: op,
                values: vals
            })).then((plugin) => {
                    extismPluginResult(plugin, query).
                        then((result) => {
                            if (result !== null) {
                                let xhr = event.detail.xhr

                                xhr.resultType = "text"
            
                                xhr.result = result.text()
                            }
                        }).catch((error) => {
                            handleError(element, error);
                            return;
                        });
                }).catch((error) => {
                    handleError(element, error);
                    return;
                })
        }

        if (name === "handleError") {
            return errHandlerCallback ? errHandlerCallback() 
                : console.log(event.detail.error);
        }
    }
})

let wasmModules = new Map();

export function registerHandlerModule(key, path) {
    wasmModules.set(key, {path: path})
}

let errHandlerCallback = null;

export function errorHandler(callback) {
    errHandlerCallback = callback;
}

function handleError(element, error) {
    htmx.trigger(element, "handleError", { error: error });
}

function retrieveHandlerModule(key) {
    return wasmModules.has(key) ? wasmModules.get(key) : null;
}

async function createPluginFromRequest(handler, config) {
    return await createPlugin(handler, {
        useWasi: true,
        config: config
    })
}

async function extismPluginResult(plugin, query) {
    const exists = await pluginFunctionExists(plugin, query)

    if (exists) {
        return await plugin.call(query)
    }
    
    return null
}

async function pluginFunctionExists(plugin, query) {
    return await plugin.functionExists(query)
}

function extractRequestDetails(element) {
    let query = element.getAttribute("querry") || null;

    let operation = element.getAttribute("opperation") || null;

    let values = element.getAttribute("include-vals") || null;

    return values ? [query, operation, eval("{" + values + "}")]
        : [query, operation, null]
}