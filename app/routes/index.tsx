import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getUserId } from "~/session.server";

type LoaderData = {
  loggedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  return json<LoaderData>({ loggedIn: Boolean(userId) });
};

export default function Index() {
  const { loggedIn } = useLoaderData() as LoaderData;

  return (
    <main>
      <article>
        <h1>Welcome!</h1>
        <p>This is a simple TODO app demoing Remix + EdgeDB.</p>
        {loggedIn ? (
          <p>
            <Link to="/tasks/">View Tasks</Link>
          </p>
        ) : (
          <p>
            <Link to="/login/">Login</Link> or <Link to="/signup/">Signup</Link>{" "}
            to get started.
          </p>
        )}
      </article>
    </main>
  );
}
