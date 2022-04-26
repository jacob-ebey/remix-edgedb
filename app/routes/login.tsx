import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";

import { getUserId, sessionStorage, setUserId } from "~/session.server";
import { validateUserLogin } from "~/models/user.server";

type ActionData = {
  errors?: {
    username?: string;
    password?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const formData = new URLSearchParams(await request.text());
  let username = formData.get("username")?.trim();
  let password = formData.get("password");

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
  }

  if (result.errors) {
    return json<ActionData>(result);
  }

  username = username!;
  password = password!;

  const user = await validateUserLogin({ username, password });
  if (!user) {
    result.errors = {
      username: "Username or password is incorrect",
    };
    return json<ActionData>(result);
  }

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  setUserId(session, user.id);

  return redirect("/tasks/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);

  if (userId) {
    return redirect("/tasks/");
  }

  return null;
};

export default function Login() {
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
              <legend>Login</legend>

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
                autoComplete="current-password"
              />
              {errors.password && (
                <label htmlFor="password" className="error">
                  {errors.password}
                </label>
              )}

              <br />

              <input type="submit" value="Login" disabled={submitting} />
            </fieldset>
            <p>
              Don't have an account? <Link to="/signup">Signup</Link>
            </p>
          </Form>
        </section>
      </article>
    </main>
  );
}
