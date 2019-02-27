import * as fs from "fs";
import ftconfig = require("ftconfig");
import { handler as h } from "../../lib/";
import * as fileUtil from "./file";
import * as gitUtil from "./git";

export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function handler(argv: string[]) {
    return h(["node", "upup", ...argv]).then(() => sleep(1000));
}

export function getFileVersion(filepath: fs.PathLike) {
    return ftconfig.readFile(filepath.toString()).toObject().version;
}

export const git = gitUtil;
export const file = fileUtil;
