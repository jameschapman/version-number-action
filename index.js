const core = require("@actions/core");
const github = require("@actions/github");
try {
  const context = github.context;
  // Get the JSON webhook payload for the event that triggered the workflow
  const ctx = JSON.stringify(github.context, undefined, 2);
  console.log(`The event payload: ${ctx}`);
  console.log(`Run number ${context.runNumber}`);
  console.log(`sha - ${context.sha}`);
  const labelFromBranch = (branch) => {
    let label = branch.substring(branch.lastIndexOf("/") + 1);
    return label.replace(/[^a-zA-Z0-9]/g, "."); // replace any special characters with . and set as the label, e.g. abc-123 becomes abc.123
  };
  const tagFromBranch = (branch) => {
    let label = branch.substring(branch.lastIndexOf("/") + 1);
    return label.replace(/[^a-zA-Z0-9]/g, "-"); // replace any special characters with . and set as the label, e.g. abc.123 becomes abc-123
  };
  const mainBranchName = core.getInput("main-branch-name-prefix");
  const mainChannel = core.getInput("main-channel-name");
  const releaseBranchName =
    core.getInput("release-branch-name-prefix");
  const releaseChannel = core.getInput("release-channel-name");
 
  let isDevelopPush = context.ref.startsWith(`refs/heads/${mainBranchName}/`);
  let isReleasePush = context.ref.startsWith(
    `refs/heads/${releaseBranchName}/`
  );
  let label = ""; // the label forms the final part of the version number, e.g. 1.0.0.0-{label}
  let tag = "";
  let channel = "";
  if (isDevelopPush) {
    label = labelFromBranch(context.ref);
    tag = tagFromBranch(context.ref);
    channel = mainChannel;
  } else if (isReleasePush) {
    label = labelFromBranch(context.ref);
    tag = tagFromBranch(context.ref);
    channel = releaseChannel;
  } else {
    label = labelFromBranch(context.ref);
    tag = tagFromBranch(context.ref);
    channel = core.getInput("feature-channel-name");
  }
  let versionNumber = `1.0.1.${context.runNumber}`;
  let versionNumberFull = `1.0.1.${
    context.runNumber
  }-${label}.${context.sha.substring(0, 5)}`;
  core.setOutput("versionNumber", versionNumber);
  core.setOutput("versionNumberFull", versionNumberFull);
  core.setOutput("releaseChannel", channel);
  core.setOutput("label", label);
  core.setOutput("tag", tag);
  console.log(
    `Set versionNumber as ${versionNumber}, versionDescription as ${versionNumberFull}, label as ${label}, tag as ${tag} and release channel as ${channel}`
  );
} catch (error) {
  core.setFailed(error.message);
}
