import {serve} from 'https://deno.land/std@0.179.0/http/server.ts';
import React from 'react';
import * as runtime from 'react/jsx-runtime';
import {compile, run} from 'mdx-js/mdx';
import {renderToString} from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const handler = async (request) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const w3css = '<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">';
    const fontawesome = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">';
    const hljs = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css">';
    let isHome = true;
    let strContents = "# Error\n**No contents...**";

    if (pathname.endsWith(".mdx")) {
        isHome = false;
        strContents = await Deno.readTextFile("./mdx" + pathname);
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
    
    if (isHome) {
        strContents = await Deno.readTextFile("./mdx/home.mdx");
    }

    let code = await compile(strContents, {
        outputFormat: 'function-body',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight]
    });

    const {default: Contents} = await run(String(code), runtime);

    let strBody = renderToString(Contents());
    
    const page = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Memanah Rajawali</title>
${w3css}
${fontawesome}
${hljs}
<style>
a {
    color: blue;
    text-decoration: none;
}
</style>
</head>
<body>
<main class="w3-main w3-padding">
<div class="w3-content" id="root">
${strBody}
</div>
</main>
</body>
</html>
`;
    return new Response(page, {
        status: 200,
        headers: {
            "content-type": "text/html"
        }
    });
};

console.log("Will run on port 3000");
const server = serve(handler, {port: 3000});

for await (const req of server) {
    req.respond({
        body: 'Hello, World!'
    });
}
