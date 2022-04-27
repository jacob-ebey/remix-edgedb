const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const { spawnSync } = require("node:child_process");

module.exports = main;

/**
 * @param {import("@remix-run/dev/config").RemixConfig} config
 */
async function main({ rootDirectory }) {
  const reader = readline.createInterface({ input, output });
  let failed = false;
  try {
    const setupDatabaseAnswer = await reader.question(
      "Do you want to setup the database? (y/n) "
    );
    console.log(setupDatabaseAnswer);
    const setupDatabase =
      !!setupDatabaseAnswer && setupDatabaseAnswer.trim().toLowerCase() === "y";

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
        console.error("Failed to setup the database");
        failed = true;
      }
    }
  } finally {
    reader.close();
  }
  if (failed) {
    process.exit(1);
  }
}
