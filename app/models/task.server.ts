import client from "~/db";
import query from "~/db/lib";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export async function createTask({
  userId,
  text,
}: {
  userId: string;
  text: string;
}): Promise<Task> {
  const user = query.select(query.User, (user) => ({
    filter: query.op(user.id, "=", query.uuid(userId)),
  }));
  const created = await query
    .insert(query.Task, {
      text,
      owner: user,
    })
    .run(client);

  return {
    id: created.id,
    text,
    completed: false,
  };
}

export async function deleteTask({
  userId,
  taskId,
}: {
  userId: string;
  taskId: string;
}) {
  const user = query.select(query.User, (user) => ({
    filter: query.op(user.id, "=", query.uuid(userId)),
  }));
  const deleted = await query
    .delete(query.Task, (task) => ({
      filter: query.op(
        query.op(task.id, "=", query.uuid(taskId)),
        "and",
        query.op(task.owner, "=", user)
      ),
    }))
    .run(client);

  return Boolean(deleted);
}

export async function setCompleted({
  userId,
  taskId,
  completed,
}: {
  userId: string;
  taskId: string;
  completed: boolean;
}) {
  const user = query.select(query.User, (user) => ({
    filter: query.op(user.id, "=", query.uuid(userId)),
  }));
  const updated = await query
    .update(query.Task, (task) => ({
      filter: query.op(
        query.op(task.id, "=", query.uuid(taskId)),
        "and",
        query.op(task.owner, "=", user)
      ),
      set: {
        completed,
      },
    }))
    .run(client);

  return updated.length > 0;
}

export async function getTasks({
  userId,
}: {
  userId: string;
}): Promise<Task[]> {
  const user = query.select(query.User, (user) => ({
    filter: query.op(user.id, "=", query.uuid(userId)),
  }));
  const tasks = await query
    .select(query.Task, (task) => ({
      id: true,
      text: true,
      completed: true,
      filter: query.op(task.owner, "=", user),
      order_by: {
        expression: task.createdAt,
        direction: query.DESC,
      },
    }))
    .run(client);

  return tasks;
}
