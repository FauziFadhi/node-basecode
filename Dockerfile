FROM node:18-buster-slim
LABEL author="Rolling Glory <hello@rollingglory.com>" \
    name="RnD" \
    version="1.0"

ENV TZ Asia/Jakarta
WORKDIR /app

RUN ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime && echo ${TZ} > /etc/timezone

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install --no-install-recommends -y \
        tini \
        libssl1.1 \
        libssl-dev \
        ca-certificates \
        bzip2 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node . .

USER node
EXPOSE 3000

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD [ "node", "dist/src/main" ]

