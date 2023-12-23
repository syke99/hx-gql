package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"

	"github.com/syke99/example-gql/gql/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "8080"

//go:embed client/dist/index.html
//go:embed client/dist/main.js
var f embed.FS

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{}}))

	static, _ := fs.Sub(f, "client/dist")

	http.Handle("/", http.StripPrefix("/i", http.FileServer(http.FS(static))))
	http.Handle("/script", func() http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			fb, er := f.ReadFile("client/dist/main.js")
			if er != nil {
				http.Error(w, "script not found", 404)
				return
			}

			w.Header().Set("content-type", "application/json")

			_, _ = w.Write(fb)
		}
	}())

	http.Handle("/playground", playground.Handler("GraphQL playground", "/gql"))
	http.Handle("/gql", srv)

	log.Printf("connect to http://localhost:%s/playground for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
