import * as fs from "fs";
import ftconfig = require("ftconfig");
import { handler as h } from "../../lib/";

export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function handler(argv: string[]) {
    return h(argv).then(() => sleep(1000));
}

export function getFileVersion(filepath: fs.PathLike) {
    return ftconfig.readFile(filepath.toString()).toObject().version;
}
