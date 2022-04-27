# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Prerecs

- Node 14+ and NPM
- [EdgeDB CLI](https://www.edgedb.com/install/)

## Creating a new project from this repo

Use your terminal to run create-remix and point it to this repo:
```sh
npx create-remix@latest --template jacob-ebey/remix-edgedb
```

This will ask you if you want to setup the DB. If you haven't already installed the [EdgeDB CLI](https://www.edgedb.com/install/) this will fail, so answer no. You can manually setup the DB later by following the steps below.

## Setup the DB

Make sure you've installed the [EdgeDB CLI](https://www.edgedb.com/install/), then from your terminal:

```sh
edgedb project init
```

This creates all the nesesary resources for local development and run an initial migration for you.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Modifying the DB Schema

Modify the schema at `dbschema/default.esdl` then from your terminal:

```sh
edgedb migration create
```

This will create a new migration that can then be applied with:

```sh
edgedb migration apply
```

Then generate the new TS types with:

```sh
npx edgeql-js --output-dir ./app/db/lib
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
