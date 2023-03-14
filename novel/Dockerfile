FROM hayd/deno:latest

EXPOSE 3000

WORKDIR /app

ADD . /app

RUN deno cache main.js

CMD ["run", "--allow-net", "main.js"]
