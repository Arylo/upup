import test from "ava";
import ftconfig = require("ftconfig");
import * as path from "path";
import { parse, stringify } from "../lib/utils/version";
import * as utils from "./utils";
import { EC, newProjectBeforeMacro } from "./utils/macroes";

test.serial.beforeEach("New Project", newProjectBeforeMacro);

test.serial.beforeEach(async (t: EC) => {
    await utils.handler(["--cwd", t.context.projectPath, "lib"]);
    await utils.file.modify(
        path.resolve(t.context.projectPath, "lib/index.ts")
    );
});

test("Step Version", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    await utils.handler(["--cwd", t.context.projectPath, "lib"]);

    const versionObjMap = {
        lock: parse(utils.getFileVersion(filepathMap.lock)),
        old: parse(version),
        pkg: parse(utils.getFileVersion(filepathMap.pkg))
    };
    versionObjMap.old.patch++;
    t.deepEqual(versionObjMap.lock, versionObjMap.old);
    t.deepEqual(versionObjMap.pkg, versionObjMap.old);
});

test("Skip Step Version because difference major", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    ftconfig
        .readFile(filepathMap.pkg)
        .modify((obj) => {
            const ver = parse(obj.version);
            ver.major++;
            obj.version = stringify(ver);
            return obj;
        })
        .save();
    await utils.handler(["--cwd", t.context.projectPath, "lib"]);

    const versionObjMap = {
        lock: parse(utils.getFileVersion(filepathMap.lock)),
        old: parse(version),
        pkg: parse(utils.getFileVersion(filepathMap.pkg))
    };
    t.notDeepEqual(versionObjMap.lock, versionObjMap.old);
    t.notDeepEqual(versionObjMap.pkg, versionObjMap.old);
    t.deepEqual(versionObjMap.pkg, versionObjMap.lock);
});

test("Skip Step Version because difference minor", async (t: EC) => {
    const filepathMap = {
        lock: path.resolve(t.context.projectPath, "version-lock.json"),
        pkg: path.resolve(t.context.projectPath, "package.json")
    };
    const version = utils.getFileVersion(filepathMap.pkg);

    ftconfig
        .readFile(filepathMap.pkg)
        .modify((obj) => {
            const ver = parse(obj.version);
            ver.minor++;
            obj.version = stringify(ver);
            return obj;
        })
        .save();
    await utils.handler(["--cwd", t.context.projectPath, "lib"]);

    const versionObjMap = {
        lock: parse(utils.getFileVersion(filepathMap.lock)),
        old: parse(version),
        pkg: parse(utils.getFileVersion(filepathMap.pkg))
    };
    t.notDeepEqual(versionObjMap.lock, versionObjMap.old);
    t.notDeepEqual(versionObjMap.pkg, versionObjMap.old);
    t.deepEqual(versionObjMap.pkg, versionObjMap.lock);
});
