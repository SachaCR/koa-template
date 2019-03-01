FROM node:10

# Copy source
ARG NPM_TOKEN
ARG BUILD_ENV
COPY .npmrc /tmp/.npmrc
ADD package.json /tmp/package.json
RUN cd /tmp; npm install $([ "$BUILD_ENV" != "test" ] && echo "--production")
RUN rm -f /tmp/.npmrc

RUN mkdir -p /src && cp -a /tmp/node_modules /src/

# Bootstrap data
WORKDIR /src
ADD . /src
RUN rm -f /src/.npmrc
EXPOSE 80
CMD ["node", "index.js"]
