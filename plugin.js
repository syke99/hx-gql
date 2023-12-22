import createPlugin from '@extism/extism';

let wasmModules = new Map();

function registerHandlerModule(key, path) {
    wasmModules.set(key, {path: path})
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

function getHandler(path) {
    let handler;

    let pathSplit = path.split("/");

    if (pathSplit.length > 1) {
        handler = retrieveHandlerModule(pathSplit[1]);
    } else {
        handler = retrieveHandlerModule(query);
    }

    if (handler === null) {
        return null
    }
}
function makeHandlerPromise(path) {
    let handler = getHandler(path)

    return new Promise((res, rej) => {
        if (handler === null) {
            rej(new Error("no available handler module for GraphQL request"))
        } else {
            res(handler)
        }
    })
}

export async function makeGreaphQLRequest(path, element) {
    let handlerPromise = makeHandlerPromise(path)

    handlerPromise.then((handler) => {
        let { query, op, vals } = extractRequestDetails(element)

        let configJSON = JSON.stringify({
            operation: op,
            values: vals
        })

        let pluginPromise = createPluginFromRequest(handler, configJSON)

        pluginPromise.then((plugin) => {
            let resultPromise = extismPluginResult(plugin, query)

            resultPromise.then((res) => {
                return res.text()
            }).catch((err) => {
                throw err
            })
        }).catch((error) => {
            return error
        })
    }, (err) => {
        return err
    })
}
