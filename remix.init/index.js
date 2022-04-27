const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const { spawnSync } = require("node:child_process");

module.exports = main;

/**
 * @param {import("@remix-run/dev/config").RemixConfig} config
 */
async function main({ rootDirectory }) {
  fs.copyFileSync(
    path.join(rootDirectory, ".env.example"),
    path.join(rootDirectory, ".env")
  );

  const reader = readline.createInterface({ input, output });
  let failed = false;
  try {
    const setupDatabaseAnswer = await reader.question(
      "Do you want to setup the database? (y/n) "
    );
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
      if (dataSetupResult.status === 0) {
        console.log("Database setup successful");
      } else {
        console.error("Failed to setup the database");
        failed = true;
      }
    }
  } finally {
    reader.close();
  }

  console.log(
    "if everything went well, you should be able to run the project now. Run `npm run dev` to get going."
  );
  if (failed) {
    process.exit(1);
  }
}
