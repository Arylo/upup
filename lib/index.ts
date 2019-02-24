import * as fs from "fs";
import ftconfig = require("ftconfig");
import * as glob from "glob";
import * as path from "path";
import config = require("./config");
import * as handlers from "./handlers";
import * as utils from "./utils";

// tslint:disable:object-literal-sort-keys

export const handler = async (argv: string[] = process.argv) => {
    // region Parse Config

    const argvObj = utils.argv.parse(argv, {
        commit: {
            key: "--commit",
            msg: "是否自动commit",
            type: "boolean"
        },
        push: {
            key: "--push",
            msg: "是否自动push",
            type: "boolean"
        },
        tag: {
            key: "--tag",
            msg: "是否自动打tag",
            type: "boolean"
        },
        cwd: {
            key: "--cwd",
            msg: "设置运行位置",
            type: "string"
        },
        lockName: {
            key: "--lock-name",
            msg: "设置锁文件名",
            type: "string"
        },
        username: {
            key: "--username",
            msg: "设置git remote url用户名",
            type: "string"
        },
        password: {
            key: "--password",
            msg: "设置git remote url密码",
            type: "string"
        },
        cache: {
            key: "--cache",
            msg: "设置额外的缓存文件位置",
            type: "string"
        }
    });

    if (argvObj.commit) {
        config.setCommit(argvObj.commit);
    }
    if (argvObj.tag) {
        config.setTag(argvObj.tag);
    }
    if ((config.isCommit() || config.isTag()) && argvObj.push) {
        config.setPush(argvObj.push);
    }
    if (config.isPush() && argvObj.username) {
        config.setGitUsername(argvObj.username);
        if (argvObj.password) {
            config.setGitPassword(argvObj.password);
        }
    }

    if (argvObj.cwd) {
        config.setCwd(argvObj.cwd);
    }
    if (argvObj.lockName) {
        config.setLockFilename(argvObj.lockName);
    }
    if (argvObj.cache) {
        config.setCache(argvObj.cache);
    }
    config.setTargets(argvObj["--"]);

    // endregion Parse Config

    const filepathMap = {
        lock: path.resolve(config.getCwd(), config.getLockFilename()),
        pkg: path.resolve(config.getCwd(), config.getPackageFilename())
    };

    const map = new Map<string, string>();
    for (const item of config.getTargets()) {
        const filenames = glob.sync(item, { cwd: config.getCwd(), dot: true });
        for (const filename of filenames) {
            const filepath = path.resolve(config.getCwd(), filename);
            const stat = fs.statSync(filepath);
            if (stat.isFile()) {
                let val: string;
                if (filepath === filepathMap.lock) {
                    continue;
                }
                if (filepath === filepathMap.pkg) {
                    const pkgStr = ftconfig
                        .readFile(filepath)
                        .modify((obj) => {
                            delete obj.version;
                            return obj;
                        })
                        .toString();
                    val = utils.md5.str(pkgStr);
                } else {
                    val = utils.md5.file(filepath);
                }
                map.set(filepath, val);
            } else if (stat.isDirectory()) {
                const filepaths = glob.sync(
                    path.resolve(config.getCwd(), item, "./**")
                );
                for (const fp of filepaths) {
                    if (fs.statSync(fp).isDirectory()) {
                        continue;
                    }
                    map.set(fp, utils.md5.file(fp));
                }
            }
        }
    }

    config.setTargets([]);
    for (const key of map.keys()) {
        config.addTargets(
            utils.md5.str(path.relative(config.getCwd(), key) + map.get(key))
        );
    }

    if (!handlers.version.handler()) {
        return;
    }
    await handlers.git.handler();
};
