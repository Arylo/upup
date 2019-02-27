import simpleGit = require("simple-git/promise");
import { URL } from "url";
import config = require("../config");

export const handler = async () => {
    const ver = config.getVersion();

    if (config.isCommit()) {
        const msg = `ci(release): step version to v${ver}`;
        const git = simpleGit();
        await git.cwd(config.getCwd());
        await git.add(config.getPackageFilename());
        await git.commit(msg);
    }

    if (config.isTag()) {
        const msg = `ci(release): step version to v${ver}`;
        const git = simpleGit();
        await git.cwd(config.getCwd());
        await git.addAnnotatedTag(`v${ver}`, msg);
    }

    if (config.getGitUsername()) {
        const git = simpleGit();
        await git.cwd(config.getCwd());
        const remote = (await git.getRemotes(true))[0];
        const url = new URL(remote.refs.push);
        url.username = config.getGitUsername();
        if (config.getGitPassword()) {
            url.password = config.getGitPassword();
        }
        await git.removeRemote(remote.name);
        await git.addRemote(remote.name, url.href);
    }

    if (config.isPush()) {
        if (config.isCommit()) {
            // TODO
        }
        if (config.isTag()) {
            // TODO
        }
    }

    return true;
};
