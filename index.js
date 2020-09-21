const core = require('@actions/core');
const github = require('@actions/github');

try {
    const context = github.context;

    // Get the JSON webhook payload for the event that triggered the workflow
    const ctx = JSON.stringify(github.context, undefined, 2)
    console.log(`The event payload: ${ctx}`);
    console.log(`Run number ${context.runNumber}`);
    console.log(`sha - ${context.sha}`)

    const labelFromBranch = (branch) => {
        let label = branch.substring(branch.lastIndexOf("/") + 1)
        return label.replace(/[^a-zA-Z0-9]/g, '.'); // replace any special characters with . and set as the label, e.g. abc.123 becomes abc.123
    }

    let isDevelopPush = context.ref.startsWith('refs/heads/develop/')
    let isReleasePush = context.ref.startsWith('refs/heads/release/')

    let label = ''; // the label forms the final part of the version number, e.g. 1.0.0.0-{label}
    let channel = '';
    if (isDevelopPush) {
        label = labelFromBranch(context.ref);
        channel = 'Develop'
    }
    else if (isReleasePush) {
        label = labelFromBranch(context.ref);
        channel = 'Release'
    }
    else {
        label = labelFromBranch(context.ref);
        channel = 'Feature Branches'
    }

    let versionNumber = `1.0.1.${context.runNumber}`;
    let versionNumberFull = `1.0.1.${context.runNumber}-${label}.${context.sha.substring(0, 5)}`;
    core.setOutput("versionNumber", versionNumber);
    core.setOutput("versionNumberFull", versionNumberFull)
    core.setOutput("releaseChannel", channel);
    console.log(`Set versionNumber as ${versionNumber}, versionDescription as ${versionDescription} and release channel as ${channel}`);

} catch (error) {
    core.setFailed(error.message);
}