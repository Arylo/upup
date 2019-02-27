import * as fs from "fs";
import ftconfig = require("ftconfig");
import { sleep } from ".";

export async function modify(filepath: fs.PathLike) {
    ftconfig
        .readFile(filepath.toString())
        .modify(
            (str) =>
                `${
                    /^\s*$/.test(str) ? "" : "\n"
                }// (() => { console.log('');})()`
        )
        .save();
    await sleep(200);
}
