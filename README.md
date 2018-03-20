# TMDb Search Demo

This is a simple web-app that enables searching for movies and TV shows via the TMDb API.

It uses minimal runtime dependencies, thus the server simply uses the core `http` module from Node.js and the front-end just uses React with `styled-components` (noteably, no state management framework or library - just `setState`).

## Launching

1.  Clone the repo
1.  `npm install`
1.  `npm run build`
1.  `PORT=3000 npm start`
1.  Open your browser to http://localhost:3000

## TODO

*   Add tests
*   gzip the responses (but this would ideally be handled outside of node, e.g. by a reverse proxy layer such as nginx)
