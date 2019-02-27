import test from "ava";
import * as path from "path";
import simpleGit = require("simple-git/promise");
import { handler } from "./utils";
import * as utils from "./utils";
import { EC, newProjectBeforeMacro } from "./utils/macroes";

test.serial.beforeEach("New Project", newProjectBeforeMacro);

test("Git Commit #0", async (t: EC) => {
    const projectPath = t.context.projectPath;
    await handler(["--commit", "--cwd", projectPath, "lib"]);
    const git = simpleGit();
    await git.cwd(projectPath);
    const status = await git.status();
    t.deepEqual(status.not_added, ["version-lock.json"]);
    t.deepEqual(status.modified, []);
    t.is((await git.log()).total, 1);
});

test("Git Commit #1", async (t: EC) => {
    const projectPath = t.context.projectPath;
    await handler(["--commit", "--cwd", projectPath, "lib"]);

    utils.file.modify(path.resolve(projectPath, "lib/index.ts"));

    await handler(["--commit", "--cwd", projectPath, "lib"]);

    const git = simpleGit();
    await git.cwd(projectPath);
    const status = await git.status();
    t.deepEqual(status.not_added, ["version-lock.json"]);
    t.deepEqual(status.modified, ["lib/index.ts"]);
    t.is((await git.log()).total, 2);
});

test("Git Commit #2", async (t: EC) => {
    const projectPath = t.context.projectPath;
    await handler(["--commit", "--cwd", projectPath, "lib"]);

    utils.file.modify(path.resolve(projectPath, "lib/index.ts"));

    const git = simpleGit();
    await git.cwd(projectPath);
    await git.add("lib/index.ts");
    await git.commit("test: add modify file");

    await handler(["--commit", "--cwd", projectPath, "lib"]);
    const status = await git.status();
    t.deepEqual(status.not_added, ["version-lock.json"]);
    t.deepEqual(status.modified, []);
    t.is((await git.log()).total, 3);
});
