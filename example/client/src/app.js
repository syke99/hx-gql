import { registerGqlEndpoint, registerQuery, registerHandler } from "../../../hx-gql";

registerGqlEndpoint("http//127.0.0.1:8080/gql");

const helloQuery = `    query Response($language: String!)  {
    responses(language: $language){
        language
        response
    }
}`

registerQuery("hello", helloQuery)

registerHandler("helloWorld", (response) => {
    // hx-gql passes the resulting body of the gql call
    // to handlers as a raw Uint8Array, so for this simple
    // example, we just decode the response into a string
    // and then parse that string into a JSON object
    // so we can easily access the desired field
    let resText = new TextDecoder().decode(response);

    let resJSON = JSON.parse(resText)

    let res = `<div>${resJSON.data.responses.res}</div>`;

    return res
})