import { useEffect, useRef } from "react";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";

import { requireUserId } from "~/session.server";
import {
  createTask,
  deleteTask,
  getTasks,
  setCompleted,
} from "~/models/task.server";
import type { Task } from "~/models/task.server";

import tasksStyleSheetHref from "./tasks.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tasksStyleSheetHref },
];

type ActionData = {
  createErrors?: {
    text?: string;
  };
  deleteError?: string;
  setCompletedError?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = new URLSearchParams(await request.text());
  const intent = formData.get("intent");

  switch (intent) {
    case "create": {
      const text = formData.get("text")?.trim();
      if (!text) {
        return json<ActionData>({
          createErrors: { text: "Text is required" },
        });
      }

      await createTask({ userId, text });
      break;
    }
    case "set-completed": {
      const completed = formData.get("completed") === "on";
      const taskId = formData.get("taskId");
      if (!taskId) {
        return json<ActionData>({
          setCompletedError: "Task ID is required",
        });
      }

      const success = await setCompleted({ userId, taskId, completed });
      if (!success) {
        return json<ActionData>({
          setCompletedError: "Could not set completed",
        });
      }
      break;
    }
    case "delete": {
      const taskId = formData.get("taskId");
      if (!taskId) {
        return json<ActionData>({
          deleteError: "Task ID is required",
        });
      }

      const success = await deleteTask({ userId, taskId });
      if (!success) {
        return json<ActionData>({
          deleteError: "Could not delete task",
        });
      }
      break;
    }
  }

  return json<ActionData>({});
};

type LoaderData = {
  tasks: Task[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const tasks = await getTasks({ userId });

  return json<LoaderData>({ tasks });
};

export default function Tasks() {
  const { tasks } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData | undefined;
  const createErrors = actionData?.createErrors || {};

  const transition = useTransition();
  const submitting = transition.state === "submitting";

  // optimistic task value
  const textInputValue = transition.submission?.formData?.get("text");
  const submittingText =
    typeof textInputValue === "string" ? textInputValue : undefined;

  const newTaskFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (submitting) {
      // optimistically clear the form on submit
      newTaskFormRef.current?.reset();
    } else if (actionData?.createErrors && submittingText) {
      // restore the text input on error
      let textInput = newTaskFormRef.current?.elements.namedItem("text") as
        | HTMLInputElement
        | undefined;
      if (textInput) {
        textInput.value = submittingText;
      }
    }
  }, [actionData, submitting, submittingText]);

  return (
    <main>
      <article>
        <section>
          <Form method="post" ref={newTaskFormRef}>
            <input type="hidden" name="intent" value="create" />
            <fieldset>
              <legend>New Task</legend>
              <input
                required
                aria-label="Text"
                type="text"
                id="text"
                name="text"
              />
              {createErrors.text && (
                <label htmlFor="text" className="error">
                  {createErrors.text}
                </label>
              )}
              <br />
              <input
                type="submit"
                value="Create"
                id="create"
                disabled={submitting}
              />
            </fieldset>
          </Form>
        </section>

        <section>
          {submittingText && (
            // optimistic rendering of new task
            <TaskItem
              optimistic
              task={{ id: "creating", completed: false, text: submittingText }}
            />
          )}
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </section>
      </article>
    </main>
  );
}

function TaskItem({ optimistic, task }: { optimistic?: boolean; task: Task }) {
  const fetcher = useFetcher();
  const actionData = fetcher.data as ActionData | undefined;

  const formData = fetcher.submission?.formData;
  const intent = formData?.get("intent");
  // optimistically delete the task
  if (intent === "delete" && formData?.get("taskId") === task.id) {
    return null;
  }

  // optimistically set completed
  let completed = task.completed;
  if (intent === "set-completed" && formData?.get("taskId") === task.id) {
    completed = formData.get("completed") === "on";
  }

  return (
    <fetcher.Form method="post">
      <fieldset className="task-item">
        <input type="hidden" name="taskId" value={task.id} />
        <input type="hidden" name="completed" value={completed ? "" : "on"} />
        <button
          type="submit"
          name="intent"
          value="set-completed"
          title={completed ? "set task incomplete" : "set task complete"}
          disabled={optimistic}
        >
          {completed ? "😍" : "😑"}
        </button>{" "}
        <span>
          {task.text}
          {actionData?.setCompletedError && (
            <>
              <br />
              <span className="error">{actionData.setCompletedError}</span>
            </>
          )}
        </span>
        <button
          type="submit"
          name="intent"
          value="delete"
          title="delete task"
          disabled={optimistic}
        >
          🗑
        </button>
      </fieldset>
    </fetcher.Form>
  );
}
