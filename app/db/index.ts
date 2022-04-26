import * as edgedb from "edgedb";

declare global {
  var client: edgedb.Client;
}

const client = global.client || (global.client = edgedb.createClient());

export default client;
