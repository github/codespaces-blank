FROM denoland/deno:latest

EXPOSE 3000

WORKDIR /app

ADD . /app

RUN deno cache --unstable main.jsx

CMD ["run", "--allow-net", "--allow-read", "--allow-write", "--unstable", "main.jsx"]
