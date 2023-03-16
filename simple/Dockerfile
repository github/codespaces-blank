FROM hayd/deno:latest

EXPOSE 3000

WORKDIR /app

ADD . /app

RUN deno cache --unstable server.ts

CMD ["run", "--allow-net", "--unstable", "server.ts"]
