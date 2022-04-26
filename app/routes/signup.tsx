import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";

import { getUserId, sessionStorage, setUserId } from "~/session.server";
import { createUser } from "~/models/user.server";

type ActionData = {
  errors?: {
    username?: string;
    password?: string;
    verifyPassword?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = new URLSearchParams(await request.text());
  let username = formData.get("username")?.trim();
  let password = formData.get("password");
  let verifyPassword = formData.get("verifyPassword");

  const result: ActionData = {};
  if (!username) {
    result.errors = { username: "Username is required" };
  }

  if (!password) {
    result.errors = { ...result.errors, password: "Password is required" };
  } else if (password.length < 8) {
    result.errors = {
      ...result.errors,
      password: "Password must be at least 8 characters",
    };
  } else if (verifyPassword !== password) {
    result.errors = {
      ...result.errors,
      verifyPassword: "Passwords do not match",
    };
  }

  if (result.errors) {
    return json<ActionData>(result);
  }

  username = username!;
  password = password!;

  const user = await createUser({ username, password });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  setUserId(session, user.id);

  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect("/");
  }

  return null;
};

export default function Signup() {
  const actionData = useActionData() as ActionData | undefined;
  const errors = actionData?.errors || {};

  const transition = useTransition();
  const submitting = transition.state !== "idle";

  return (
    <main>
      <article>
        <section>
          <Form method="post">
            <fieldset>
              <legend>Signup</legend>

              <label htmlFor="username">Username</label>
              <input
                required
                type="text"
                id="username"
                name="username"
                autoComplete="username"
              />
              {errors.username && (
                <label htmlFor="username" className="error">
                  {errors.username}
                </label>
              )}

              <label htmlFor="password">Password</label>
              <input
                required
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
              />
              {errors.password && (
                <label htmlFor="password" className="error">
                  {errors.password}
                </label>
              )}

              <label htmlFor="verifyPassword">Verify Password</label>
              <input
                required
                type="password"
                id="verifyPassword"
                name="verifyPassword"
                autoComplete="new-password"
              />
              {errors.verifyPassword && (
                <label htmlFor="verifyPassword" className="error">
                  {errors.verifyPassword}
                </label>
              )}

              <br />

              <input type="submit" value="Signup" disabled={submitting} />
            </fieldset>
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </Form>
        </section>
      </article>
    </main>
  );
}
