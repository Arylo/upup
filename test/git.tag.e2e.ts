import test from "ava";
import * as path from "path";
import simpleGit = require("simple-git/promise");
import { handler } from "./utils";
import * as utils from "./utils";
import { EC, newProjectBeforeMacro } from "./utils/macroes";

test.serial.beforeEach("New Project", newProjectBeforeMacro);

test.serial("Git Tag #0", async (t: EC) => {
    const projectPath = t.context.projectPath;
    await handler(["--tag", "--cwd", projectPath, "lib"]);
    const git = simpleGit();
    await git.cwd(projectPath);
    // Auto Commit
    t.is((await git.log()).total, 1);
    // Tag
    t.is((await git.tags()).latest, "v1.0.0");
});

test.serial("Git Tag #1", async (t: EC) => {
    const projectPath = t.context.projectPath;
    await handler(["--tag", "--cwd", projectPath, "lib"]);

    await utils.file.modify(path.resolve(projectPath, "lib/index.ts"));
    await utils.git.commit(projectPath, "Modify");
    await handler(["--tag", "--cwd", projectPath, "lib"]);

    const git = simpleGit();
    await git.cwd(projectPath);
    t.is((await git.tags()).latest, "v1.0.1");
});
