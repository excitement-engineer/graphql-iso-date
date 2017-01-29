## Release on NPM

*Only core contributors may release to NPM.*

To release a new version on NPM, first ensure all tests pass with `npm test`,
then use `npm version patch|minor|major` in order to increment the version in
package.json and tag and commit a release. Then `git push && git push --tags`
this change so Travis CI can deploy to NPM. *Do not run `npm publish` directly.*
Once published, add [release notes](https://github.com/excitement-engineer/graphql-iso-date/tags).
Use [semver](http://semver.org/) to determine which version part to increment.

Example for a patch release:

```sh
npm test
npm version patch
git push --follow-tags
```
