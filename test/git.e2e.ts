import test from "ava";
import * as path from "path";
import simpleGit = require("simple-git/promise");
import { handler } from "./utils";
import * as utils from "./utils";
import { EC, newProjectBeforeMacro } from "./utils/macroes";

test.serial.beforeEach("New Project", newProjectBeforeMacro);

test.serial("Git Commit #1", async (t: EC) => {
    await handler([
        "node",
        "upup",
        "--commit",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);
    const git = simpleGit();
    await git.cwd(t.context.projectPath);
    const status = await git.status();
    t.deepEqual(status.not_added, ["version-lock.json"]);
    t.deepEqual(status.modified, []);
    t.is((await git.log()).total, 1);
});

test.serial("Git Commit #2", async (t: EC) => {
    await handler([
        "node",
        "upup",
        "--commit",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);

    utils.file.modify(path.resolve(t.context.projectPath, "lib/index.ts"));

    await handler([
        "node",
        "upup",
        "--commit",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);

    const git = simpleGit();
    await git.cwd(t.context.projectPath);
    const status = await git.status();
    t.deepEqual(status.not_added, ["version-lock.json"]);
    t.deepEqual(status.modified, ["lib/index.ts"]);
    t.is((await git.log()).total, 2);
});

test.serial("Git Commit #3", async (t: EC) => {
    await handler([
        "node",
        "upup",
        "--commit",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);

    utils.file.modify(path.resolve(t.context.projectPath, "lib/index.ts"));

    const git = simpleGit();
    await git.cwd(t.context.projectPath);
    await git.add("lib/index.ts");
    await git.commit("test: add modify file");

    await handler([
        "node",
        "upup",
        "--commit",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);
    const status = await git.status();
    t.deepEqual(status.not_added, ["version-lock.json"]);
    t.deepEqual(status.modified, []);
    t.is((await git.log()).total, 3);
});

test.serial("Git Tag #0", async (t: EC) => {
    await handler([
        "node",
        "upup",
        "--tag",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);
    const git = simpleGit();
    await git.cwd(t.context.projectPath);
    // Auto Commit
    t.is((await git.log()).total, 1);
    // Tag
    t.is((await git.tags()).latest, "v1.0.0");
});

test.serial("Git Tag #1", async (t: EC) => {
    await handler([
        "node",
        "upup",
        "--tag",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);

    await utils.file.modify(
        path.resolve(t.context.projectPath, "lib/index.ts")
    );
    await utils.git.commit(t.context.projectPath, "Modify");
    await handler([
        "node",
        "upup",
        "--tag",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);

    const git = simpleGit();
    await git.cwd(t.context.projectPath);
    t.is((await git.tags()).latest, "v1.0.1");
});
