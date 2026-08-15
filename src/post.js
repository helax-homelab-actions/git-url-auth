// @ts-check

import * as core from "@actions/core";
import { execFileSync } from "node:child_process";

const httpsUrl = core.getState("httpsUrl");

if (!httpsUrl) {
    core.warning("httpsUrl is not set, skipping cleanup");
} else {
    removeGitUrlRewrite(httpsUrl);
}

/**
 * @param {string} httpsUrl
 */
function removeGitUrlRewrite(httpsUrl) {
    try {
        execFileSync(
            "git",
            [
                "config",
                "--global",
                "--unset-all",
                `url.${httpsUrl}.insteadOf`,
            ],
            { stdio: "inherit" },
        );

        core.info("GitHub Git URL authentication removed");
    } catch {
        core.info("GitHub Git URL authentication was already absent");
    }
}