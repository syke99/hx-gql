import { registerGqlEndpoint, registerQuery, registerHandler } from "../../../hx-gql";

registerGqlEndpoint("http//127.0.0.1:8080/gql");

const helloQuery = `    query Response($language: String!)  {
    responses(language: $language){
        res
    }
}`

registerQuery("hello", helloQuery)

registerHandler("helloWorld", (response) => {
    let resJSON = JSON.parse(response);

    return `<div>${resJSON.data.responses[0].res}</div>`;
})