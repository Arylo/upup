// tslint:disable:object-literal-sort-keys
import * as fs from "fs";
import { ILockFile } from "./types/lock";

class Config {
    private cwd = process.cwd();
    private packageFilename = "package.json";
    private lockFilename = "version-lock.json";
    private cache: string | ILockFile = null;
    private tag = false;
    private commit = false;
    private push = false;
    private targets: string[] = [];
    private gitUsername: string = null;
    private gitPassword: string = null;

    public getCwd() {
        return this.cwd;
    }
    public setCwd(val: fs.PathLike) {
        this.cwd = val.toString();
    }

    public getPackageFilename() {
        return this.packageFilename;
    }
    public setPackageFilename(val: string) {
        this.packageFilename = val;
    }

    public getLockFilename() {
        return this.lockFilename;
    }
    public setLockFilename(val: string) {
        this.lockFilename = val;
    }

    public getCache() {
        return this.cache;
    }
    public setCache(val: string | ILockFile) {
        this.cache = val;
    }

    public isTag() {
        return this.tag;
    }
    public setTag(val: boolean) {
        this.tag = val;
        if (val) {
            this.commit = val;
        }
    }

    public isCommit() {
        return this.commit;
    }
    public setCommit(val: boolean) {
        this.commit = val;
    }

    public isPush() {
        return this.push;
    }
    public setPush(val: boolean) {
        this.push = val;
    }

    public getTargets() {
        return this.targets;
    }
    public setTargets(arr: string[]) {
        this.targets = arr;
    }
    public addTargets(arr: string[] | string) {
        if (!Array.isArray(arr)) {
            arr = [arr];
        }
        this.targets.push(...arr);
    }

    public getGitUsername() {
        return this.gitUsername;
    }
    public setGitUsername(val: string) {
        this.gitUsername = val;
    }
    public getGitPassword() {
        return this.gitPassword;
    }
    public setGitPassword(val: string) {
        this.gitPassword = val;
    }
}

export = new Config();
