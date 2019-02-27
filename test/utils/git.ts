import simpleGit = require("simple-git/promise");
import { sleep } from ".";

export async function commit(projectPath: string, msg: string) {
    const git = simpleGit(projectPath);
    await git.add(".");
    await git.commit(msg);
    await sleep(200);
}
