import fs = require("fs");
import ftconfig = require("ftconfig");
import path = require("path");
import config = require("../config");
import { ILockFile } from "../types/lock";
import * as utils from "../utils";

export let version = "0.0.0";

export const handler = () => {
    const filepathMap = {
        lock: path.resolve(config.getCwd(), config.getLockFilename()),
        pkg: path.resolve(config.getCwd(), config.getPackageFilename())
    };

    // region Build Lock Object
    let { version: ver } = ftconfig.readFile(filepathMap.pkg).toObject();
    version = ver;
    const md5sum = utils.md5.str(
        config
            .getTargets()
            .sort()
            .join("/")
    );
    let lockObj: ILockFile;
    if (fs.existsSync(filepathMap.lock)) {
        lockObj = ftconfig.readFile(filepathMap.lock).toObject();
        if (lockObj.hash === md5sum) {
            return false;
        }
    } else {
        lockObj = {
            date: Date.now(),
            hash: md5sum,
            version: "0.0.0"
        };
    }
    // endregion Build Lock Object

    // region Step Version
    const verMap = {
        lock: utils.version.parse(lockObj.version),
        pkg: utils.version.parse(ver)
    };
    if (
        verMap.pkg.major === verMap.lock.major &&
        verMap.pkg.minor === verMap.lock.minor &&
        verMap.lock.patch <= verMap.pkg.patch
    ) {
        verMap.pkg.patch++;
        ver = utils.version.stringify(verMap.pkg);
    }
    // endregion Step Version

    ftconfig
        .read<ILockFile>(JSON.stringify(lockObj), "json")
        .modify((obj) => {
            obj.version = ver;
            obj.date = Date.now();
            return obj;
        })
        .save(filepathMap.lock);

    ftconfig
        .readFile(filepathMap.pkg)
        .modify((obj) => {
            obj.version = ver;
            return obj;
        })
        .save();

    return true;
};
