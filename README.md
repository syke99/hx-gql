# hx-gql
an extension to use gql endpoints + custom result handlers with HTMX

### What is hx-gql?
====

hx-gql is an extension for the highly acclaimed [htmx](https://github.com/bigskysoftware/htmx) that allows you to make queries (queries and mutations both) to a GraphQL server and use the response along with custom handlers to render the components for HTMX to swap. These handlers can be JavaScript functions, functions exposed from a WebAssembly module, or any other form of function that takes in a string representation of the GraphQL response and uses it to render an HTML element that it then returns.

### Why was hx-gql made?
====

Like many, you may have a strong distaste for state of Front End development and the major frameworks dominating the ecosystem. So you start looking around and come across `htmx`: super simple, lightweight, and very easy to get started with and scale. But wait, htmx expects your server to respond with HTML? What if you wanted to make some queries to a backing GraphQL server? Or even worse, what if you're already working on a project that's backed by a GraphQL and looking to migrate your Front End without having to rewrite your entire Back End in a RESTful manner, so you _need_ to have GraphQL support? Well, you can certainly do so with htmx (and a little fanagling behind the scenes, managing the request cycle, and modifying the overall request before it's fired), but what if you didn't have to reinvent the wheel with each application and you had an easy way to configure it without any added overhead? Well, enter `hx-gql`!!

### How to use hx-gql
====

# Installation

With NPM:

```
npm install hx-gql
```

# Caveats

* `hx-gql` only works with the `hx-post` attribute, as all requests made to a GraphQL server are done via the `POST`

* Whenever using `hx-gql`, the path you set as the value of the `hx-post` attribute *MUST* match the same path of the endpoint provided to `registerGqlEndpoint`

# Usage

0. After including/importing the `hx-gql` extension, register your endpoint, as well as any queries and handlers, using the provided exported functions. An example of this can be found [here](https://github.com/syke99/hx-gql/blob/main/example/client/src/app.js)

1. Add an `hx-ext` attribute with the value of `hx-gql` to register the extension on the HTML element(s) you with to execute this call. Since HTML elements with parent HTML elements with `htmx` attributes inherit these attributes, you can use the [ignore directive](https://htmx.org/extensions/#ignoring) for an children elements you don't want to inherit this extension.

2. To specify which query you would like to be made to the configured GraphQL server, simply provide the key to the query you registered to the `query` attribute of the element making this call. (see step 0 for more info)

3. To specify which handler you would like to use to render the resulting HTML fragment using the result from the GraphQL call, set the `handler` attribute equal to the key of the desired handler you registered during set-up. (see step 0 for more info)

4. To provide variables to be used with the GraphQL query, provide them as `key:value` pairs, seperated by a `:`. To provide multiple variables, separate these k/v pairs using a `|`. ex: `vars="key1:value1|key2:value2"`

From here, you use the other provided `htmx` attributs as you normally would to build powerful, yet simple and lightweight applications with the power of `htmx` backed by GraphQL servers

### Example
====

A full working example can be found in the [example](directory). To run the example, first make sure you have both `npm` and `go` installed. Then, after cloning the repo, at the top level directory run the following command:

```
cd example/client && npm install && npm run build && cd .. && go run server.go
```

After running the above command, open your browser and navigate to `localhost:8080/playground`. Then run the mutation below.

```
mutation CreateResponse{
  createResponse(input:{language: "English", response: "Hello world!"}) {
    language
    res
  }
}
```

Once that has been completed, navigate to `localhost:8080`, click the words that say `Click me!!`, and watch the magic happen before your very eyes!!

### Who?
====

This library was developed by Quinn Millican ([@syke99](https://github.com/syke99))


### License

This repo is under the MIT license, see [LICENSE](../LICENSE) for details.
