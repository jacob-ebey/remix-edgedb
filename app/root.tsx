import { json } from "@remix-run/node";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { ShouldReloadFunction } from "@remix-run/react";

import { getUserId } from "./session.server";

import rootStyleSheetHref from "./root.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://unpkg.com/awsm.css@3.0.7/dist/awsm.min.css",
  },
  { rel: "stylesheet", href: rootStyleSheetHref },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix EdgeDB Tasks",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  loggedIn: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  console.log({ userId });

  return json<LoaderData>({ loggedIn: Boolean(userId) });
};

export const unstable_shouldReload: ShouldReloadFunction = ({ submission }) => {
  console.log(submission);
  if (
    submission?.action.startsWith("/login") ||
    submission?.action.startsWith("/logout") ||
    submission?.action.startsWith("/signup")
  ) {
    return true;
  }

  return false;
};

export default function App() {
  const { loggedIn } = useLoaderData() as LoaderData;

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <h1>Remix Tasks</h1>
          <p>
            <a href="https://remix.run/" target="_blank" rel="noreferrer">
              Remix
            </a>{" "}
            +{" "}
            <a href="https://www.edgedb.com/" target="_blank" rel="noreferrer">
              EdgeDB
            </a>{" "}
            = ❤️
          </p>
          <nav>
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              {loggedIn && (
                <li>
                  <NavLink to="/tasks/">Tasks</NavLink>
                </li>
              )}
              <li>
                {loggedIn ? (
                  <Form action="/logout/" method="post">
                    <button>Logout</button>
                  </Form>
                ) : (
                  <NavLink to="/login/">Login</NavLink>
                )}
              </li>
            </ul>
          </nav>
        </header>
        <Outlet />
        <footer>
          <p>Created with ❤️ by Jacob Ebey</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
