**Deprecation Warning:** We're in the process of moving the documentation markdown sources back to the main Booster repository. Consider this before contributing to this documentation.

# Booster Docs

Welcome to the source code of the Booster documentation. If you want to improve the Booster docs, you're in the right place! If you just want
to read the docs, you should probably [visit the documentation website](https://booster.cloud/docs).

The documentation is written using the Markdown format, and the files for
it live under [`source/includes`](source/includes). If you want to create
a new file, make sure that you add it under the `includes` section of the
`source/index.html.md` file.

The Booster documentation is rendered using [Slate](https://github.com/slatedocs/slate), you can find more information on that link, although here you have some steps to get you started:

## Getting Started with Slate

### Prerequisites

You're going to need:

 - **Linux or macOS** — Windows may work, but is unsupported.
 - **Ruby, version 2.3.1 or newer**
 - **Bundler** — If Ruby is already installed, but the `bundle` command doesn't work, just run `gem install bundler` in a terminal.

### Getting Set Up

1. Fork this repository on GitHub.
2. Clone *your forked repository* (not our original one) to your hard drive with `git clone https://github.com/YOURUSERNAME/slate.git`
3. `cd slate`
4. Initialize and start Slate. You can either do this locally, or with Vagrant:

```shell
# either run this to run locally
bundle install
bundle exec middleman server

# OR run this to run with vagrant
vagrant up
```

You can now see the docs at http://localhost:4567. Whoa! That was fast!

Now that Slate is all set up on your machine, you'll probably want to learn more about [editing Slate markdown](https://github.com/slatedocs/slate/wiki/Markdown-Syntax), or [how to publish your docs](https://github.com/slatedocs/slate/wiki/Deploying-Slate).

If you'd prefer to use Docker, instructions are available [in the wiki](https://github.com/slatedocs/slate/wiki/Docker).

### Note on JavaScript Runtime

For those who don't have JavaScript runtime or are experiencing JavaScript runtime issues with ExecJS, it is recommended to add the [rubyracer gem](https://github.com/cowboyd/therubyracer) to your gemfile and run `bundle` again.
