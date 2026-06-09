FROM mcr.microsoft.com/devcontainers/javascript-node:22

# Install pnpm
RUN npm install -g pnpm

# Install additional system dependencies for Sharp and Prisma
RUN apt-get update && apt-get install -y \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the default shell to bash
ENV SHELL=/bin/bash
