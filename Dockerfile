FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN yarn install

COPY . .

ENV TINI_VERSION v0.19.0

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini

RUN chmod +x /tini

ENTRYPOINT ["/tini", "--"]

RUN yarn predevbuild && yarn build

CMD [ "yarn", "start" ]

USER node

ENV DATABASE_HOST db
