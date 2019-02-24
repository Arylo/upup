import { ExecutionContext } from "ava";
import child_process = require("child_process");
import * as path from "path";
import { md5 } from "../../lib/utils";
import { commit } from "./git";

const ROOT_PATH = path.resolve(__dirname, "../../TEST_PATH");

export type EC = ExecutionContext<{ projectPath: string }>;

export async function newProjectBeforeMacro(t: EC) {
    const projectName = md5.str(Math.random() + "");
    const projectPath = path.resolve(ROOT_PATH, projectName);

    child_process.execSync(`npx arylo-init new ${projectPath}`);
    await commit(projectPath, "Init");

    t.context = t.context || { projectPath: "" };
    t.context.projectPath = projectPath;
}
