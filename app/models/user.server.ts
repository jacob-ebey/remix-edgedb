import { compare, hash } from "bcrypt";

import client from "~/db";
import query from "~/db/lib";

export interface User {
  id: string;
  username: string;
}

export async function validateUserLogin({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<User | null> {
  const user = await query
    .select(query.User, (user) => ({
      id: true,
      password: true,
      filter: query.op(user.username, "=", username),
    }))
    .run(client);

  if (!user || !(await compare(password, user.password))) {
    return null;
  }

  return {
    id: user.id,
    username,
  };
}

export async function createUser({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<User> {
  const hashedPassword = await hash(password, 10);

  const { id } = await query
    .insert(query.User, {
      username,
      password: hashedPassword,
    })
    .run(client);

  return {
    id,
    username,
  };
}
