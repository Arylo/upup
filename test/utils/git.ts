import simpleGit = require("simple-git/promise");

export async function commit(projectPath: string, msg: string) {
    const git = simpleGit(projectPath);
    await git.add(".");
    await git.commit(msg);
}
