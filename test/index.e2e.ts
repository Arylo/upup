import test from "ava";
import * as fs from "fs";
import ftconfig = require("ftconfig");
import * as path from "path";
import * as utils from "./utils";
import { EC, newProjectBeforeMacro } from "./utils/macroes";

test.serial.beforeEach(newProjectBeforeMacro);

test("Generate Lock File", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    await utils.handler(["--cwd", t.context.projectPath, "test"]);
    t.true(fs.existsSync(filepathMap.lock));

    t.is(utils.getFileVersion(filepathMap.lock), version);
    t.is(utils.getFileVersion(filepathMap.pkg), version);
});

test("Generate Lock File and Repeat Run", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    await utils.handler(["--cwd", t.context.projectPath, "lib"]);
    await utils.handler(["--cwd", t.context.projectPath, "lib"]);

    t.is(utils.getFileVersion(filepathMap.lock), version);
    t.is(utils.getFileVersion(filepathMap.pkg), version);
});

test("Generate Lock File and Repeat Run with Multi Files", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    await utils.handler(["--cwd", t.context.projectPath, "lib", "test"]);
    await utils.handler(["--cwd", t.context.projectPath, "lib", "test"]);

    t.is(utils.getFileVersion(filepathMap.lock), version);
    t.is(utils.getFileVersion(filepathMap.pkg), version);
});

test("Generate Lock File and Repeat Run with `package.json`", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    await utils.handler([
        "--cwd",
        t.context.projectPath,
        "lib",
        "package.json"
    ]);
    await utils.handler([
        "--cwd",
        t.context.projectPath,
        "lib",
        "package.json"
    ]);

    t.is(utils.getFileVersion(filepathMap.lock), version);
    t.is(utils.getFileVersion(filepathMap.pkg), version);
});

test("Run after update file", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    await utils.handler(["--cwd", t.context.projectPath, "lib"]);
    await utils.file.modify(
        path.resolve(t.context.projectPath, "lib/index.ts")
    );
    await utils.handler(["--cwd", t.context.projectPath, "lib"]);

    t.not(ftconfig.readFile(filepathMap.lock).toObject().version, version);
    t.not(ftconfig.readFile(filepathMap.pkg).toObject().version, version);
});

test("Run after update file with `package.json`", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    await utils.handler([
        "--cwd",
        t.context.projectPath,
        "lib",
        "package.json"
    ]);
    await utils.file.modify(
        path.resolve(t.context.projectPath, "lib/index.ts")
    );
    await utils.handler([
        "--cwd",
        t.context.projectPath,
        "lib",
        "package.json"
    ]);

    t.not(ftconfig.readFile(filepathMap.lock).toObject().version, version);
    t.not(ftconfig.readFile(filepathMap.pkg).toObject().version, version);
});
