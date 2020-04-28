# Installing Booster

> Go to your new project folder (`cd <name of your project>`) to see the project structure. You'll see something like this:

```text
$ tree
.
|____package.json
|____tsconfig.json
|____src
| |____migrations
| |____config
| | |____config.ts
| |____read-models
| |____commands
| |____events
| |____entities
```

Let's install the Booster CLI and bootstrap your first project:

1. Install the Booster CLI tool if you haven’t yet:

`npm install -g @boostercloud/cli`

2. Create a new Booster project

`boost new:project <name of your project>`

Project structure or code generators are not enforced, but they're recommended to build a community-shared set of conventions.