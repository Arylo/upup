import test from "ava";
import ftconfig = require("ftconfig");
import * as path from "path";
import simpleGit = require("simple-git/promise");
import { parse, stringify } from "../lib/utils/version";
import { getFileVersion, handler } from "./utils";
import { EC, newProjectBeforeMacro } from "./utils/macroes";

test.serial.beforeEach("New Project", newProjectBeforeMacro);

test("Git Commit #1", async (t: EC) => {
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

test("Git Commit #2", async (t: EC) => {
    await handler([
        "node",
        "upup",
        "--commit",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);

    ftconfig
        .readFile(path.resolve(t.context.projectPath, "lib/index.ts"))
        .modify((str) => "(() => { console.log('');})()")
        .save();

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

test("Git Commit #3", async (t: EC) => {
    await handler([
        "node",
        "upup",
        "--commit",
        "--cwd",
        t.context.projectPath,
        "lib"
    ]);

    ftconfig
        .readFile(path.resolve(t.context.projectPath, "lib/index.ts"))
        .modify((str) => "(() => { console.log('');})()")
        .save();
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
