const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const { spawnSync } = require("node:child_process");

module.exports = main;

/**
 * @param {import("@remix-run/dev/config").RemixConfig} config
 */
async function main({ rootDirectory }) {
  const reader = readline.createInterface({ input, output });
  try {
    const setupDatabaseAnswer = reader.question(
      "Do you want to setup the database? (y/n) "
    );
    const setupDatabase = setupDatabaseAnswer?.trim().toLowerCase() === "y";

    if (setupDatabase) {
      const dataSetupResult = spawnSync(
        "edgedb",
        ["project", "init", "--non-interactive"],
        {
          cwd: rootDirectory,
          stdio: "inherit",
        }
      );
      if (dataSetupResult.status !== 0) {
        throw new Error("Failed to setup the database");
      }
    }
  } finally {
    reader.close();
  }
}
