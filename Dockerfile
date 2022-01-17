FROM node:12-alpine as builder

ENV NODE_ENV development
ENV NODE_OPTIONS=--max_old_space_size=2048

USER node
WORKDIR /home/node

COPY . /home/node

RUN npm install
ENV NODE_ENV production
RUN npm run build
RUN npm prune --production

# ---

FROM node:12-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

CMD ["node", "dist/main"]