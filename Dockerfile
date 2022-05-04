FROM node:16.14.2-alpine as base
WORKDIR /code
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY package.json .
COPY yarn.lock .
# Install dependencies
RUN yarn --cwd /code install --frozen-lockfile

FROM base as build
# add SRC
COPY src /code/src
RUN ls -ltr /code/src
# Build typescript
RUN yarn --cwd /code build

# Clean up dev dependencies
RUN yarn install --production

FROM base
COPY --from=build /code/node_modules /code/node_modules
COPY --from=build /code/src /code/src
WORKDIR /code
CMD [ "yarn", "start" ]
