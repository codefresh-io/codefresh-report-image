FROM node:16.14.2-alpine as base
WORKDIR /code
COPY lerna.json .
COPY tsconfig.json .
COPY xxx/package.json .
COPY yarn.lock .

FROM base as libs
COPY --from=base /code /code

COPY libs libs
# TODO: Remove libs not used by the app
# RUN yarn workspaces info | tail -n +2 | tail -r | tail -n +2 | tail -r | jq ".\"$APP\".workspaceDependencies | .[]" | sed 's@\@codefresh-io/@@' | xargs rm -rf

FROM base as libs-packages-only
COPY --from=libs /code/libs /code/libs

# Leave only package.json files
RUN find libs -not -name "package.json" -mindepth 2 -maxdepth 2 | xargs rm -rf

FROM base as build
COPY --from=base /code /code

# Install dependencies
ARG APP
COPY --from=libs-packages-only /code/libs /code/libs
COPY apps/${APP}/package.json apps/${APP}/package.json
RUN yarn --cwd apps/${APP} install --frozen-lockfile

# Build typescript
COPY --from=libs /code/libs /code/libs
COPY apps/${APP} apps/${APP}
RUN yarn build

# Clean up dev dependencies
RUN yarn install --production

FROM base
ARG APP

COPY --from=build /code/libs /code/libs
COPY --from=build /code/node_modules /code/node_modules
COPY --from=build /code/apps/${APP} /code/apps/${APP}

WORKDIR /code/apps/${APP}
CMD [ "yarn", "start" ]
