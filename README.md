# Version Number calculating action

This action generates a version number based on the context of the action being run

## Inputs

### `main-branch-name-prefix`

The name of the primary branch used in Git, e.g. master/main/develop

### `release-branch-name-prefix`

The branch used for release, e.g. release

### `release-channel-name`

The Octopus channel name for release branch commits

### `feature-channel-name`

The Octopus channel name for feature branch commits, i.e. those not in main or release branches

### `version-prefix`

The version prefix, in the form of <mayor>.<minor>.<patch> . Example: 1.0.0

## Outputs

### `versionNumber`

The calculated version number. Pattern: <version-prefix>.<runNumber>. Example: 1.0.0.144

### `versionNumberFull`

The calculated version number, including branch and sha. Pattern: <version-prefix>.<runNumber>.<label>.<sha-first-6-chars> Example: 1.0.0.144-BRANCHNAME.a342f1

### `releaseChannel`

The release channel based on the commit

## Example usage

uses: jameschapman/version-number-action@v1