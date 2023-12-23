package main

import (
	"log"
	"net/http"
	"os"

	"github.com/syke99/example-gql/gql/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	path := "..\\client\\dist"

	_, err := os.Stat(path)
	if err != nil {
		panic(err)
	}

	http.Handle("/index", http.StripPrefix("/index", http.FileServer(http.Dir(path))))

	http.Handle("/playground", playground.Handler("GraphQL playground", "/gql"))
	http.Handle("/gql", srv)

	log.Printf("connect to http://localhost:%s/playground for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
