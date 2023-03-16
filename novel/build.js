import * as esbuild from 'https://deno.land/x/esbuild@v0.17.11/mod.js'

let result = await esbuild.build({
    entryPoints: ['src/app.js'],
    outDir: './build',
    format: 'esm',
    loader: '.js=jsx'
});
esbuild.stop();

/*
import * as esbuild from 'https://deno.land/x/esbuild@v0.17.11/mod.js'
let ts = 'let test: boolean = true'
let result = await esbuild.transform(ts, { loader: 'ts' })
console.log('result:', result)
esbuild.stop()
*/
