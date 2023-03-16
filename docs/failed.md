# Problems

Setiap kali kita memakai yang ini, selalu timbul masalah dengan
`document not defined`, meskipun image berhasil dibuat. Ini termasuk
ketika subernya sudah diganti menjadi "denoland/deno", yang official.

```jsx
import React from "https://esm.sh/stable/react@18.2.0/es2022/react.js";
import * as runtime from "https://esm.sh/stable/react@18.2.0/es2022/jsx-runtime.js";
import {renderToString} from "https://esm.sh/v111/react-dom@18.2.0/es2022/server.js";
import {compile, run} from "https://esm.sh/v111/@mdx-js/mdx@2.3.0/es2022/mdx.js";

async function serve(conn) {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);
    // Each request sent over the HTTP connection will be yielded as an async
    // iterator from the HTTP connection.
    for await (const requestEvent of httpConn) {
        // The native HTTP server uses the web standard `Request` and `Response`
        // objects.
        const result = handler(requestEvent.request);
        // The requestEvent's `.respondWith()` method is how we send the response
        // back to the client.
        requestEvent.respondWith(result);
    }
}

const handler = async (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    let strContents = "# Error\n**No contents...**";

    if (pathname.endsWith(".mdx")) {
        isHome = false;
        strContents = await Deno.readTextFile("./mdx" + pathname);
        return new Response(page, {
            status: 200,
            headers: {
                "content-type": "text/mdx"
            }
        });    
    }
    else if (pathname.endsWith("favicon.ico")) {
        let img = await Deno.readFile("./favicon.ico");
        return new Response(img, {
            status: 200,
            headers: {
                "content-type": "image/ico"
            }
        });
    }
    else if (pathname.endsWith("index") || (pathname === "/")) {
        console.log("Asking for index...");
        const mdx = await Deno.readTextFile("./mdx/home.mdx");
        const code = await compile(mdx, {
            outputFormat: 'program'
        });
        const {default: Contents} = await run(String(code), runtime);
        const page = renderToString(<Contents/>);
        return new Response(page, {
            status: 200,
            headers: {
                "content-type": "text/html"
            }
        });
    }

    console.log("Asked for " + pathname);
    return new Response(strContents, {
        status: 200,
        headers: {
            "content-type": "text/plain"
        }
    });
};

console.log("Will run on port 3000");
const server = Deno.listen({port: 3000});

for await (const conn of server) {
    serve(conn);
}
```
