// @ts-check

import * as core from "@actions/core";
import { execFileSync } from "node:child_process";

const token = core.getInput("token", { required: true });
const repository = core.getInput("repository", { required: true });

if (!/^[^/]+\/[^/]+$/.test(repository)) {
    throw new Error(
        `Invalid repository "${repository}". Expected the format "owner/name".`,
    );
}

const sshUrl = `ssh://git@github.com/${repository}.git`;
const httpsUrl = `https://x-access-token:${token}@github.com/${repository}.git`;

core.saveState("httpsUrl", httpsUrl);

execFileSync(
    "git",
    [
        "config",
        "--global",
        `url.${httpsUrl}.insteadOf`,
        sshUrl,
    ],
    { stdio: "inherit" },
);

core.info(`GitHub Git URL authentication configured for ${repository}`);
