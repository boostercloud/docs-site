# Installing Booster

## Supported operating systems

You can develop with Booster using any of the following operating systems:

* Linux
* MacOS
* Windows (Native and WSL)

Booster hasn't been tested under other platforms like BSD, if you want to
develop under those, proceed at your own risk!

## Install Node.js

```shell
# Ubuntu
$ curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
$ sudo apt install nodejs

# MacOS
$ brew install node

# Windows
> choco install nodejs
```

Booster is a TypeScript framework that benefits from the Node.js ecosystem, it
has been tested under versions newer than `v12`, so make sure that you install one
accordingly.

If you don't have Node.js installed, you can download an installer [from it's website](https://nodejs.org/en/), or you can install it using your system's
package manager.

* **Ubuntu** - using [`apt`](https://wiki.debian.org/Apt)
* **MacOS** - using [`brew`](https://brew.sh/)
* **Windows** - using [`chocolatey`](https://chocolatey.org/)

If for some reason you are working with other projects that require a different
Node.js version, we recommend that you use a version manager like:

* [`nvm`](https://github.com/nvm-sh/nvm) - Works with MacOS, Linux and WSL
* [`nvm-windows`](https://github.com/coreybutler/nvm-windows) - Works with native Windows

> Verify your Node.js and `npm` versions

```shell
$ node -v
v13.12.0

$ npm -v
6.14.4
```

After you've installed Node.js, you can verify that it was installed properly by
checking so from your terminal.

Make sure that Node.js is newer than `v12` and `npm` (comes installed with Node.js) is newer than `6`.

## Set up your AWS account

Booster is a cloud-native framework, meaning that your application will be deployed
to the cloud, using different cloud services. Right now, it only supports AWS, but
given Booster's abstractions, a provider package can be easily created to support
other cloud providers.

To follow the documentation locally and get a grip of Booster, you don't need a
cloud provider, but to deploy, and test your application, you will need it.

<aside class="warning">
<b>Note:</b> Booster is and always will be free, but the resources you use in AWS
are not.
Most of them are pay-per-use, which means that your system is absolutely free as
long as no one is using it, <b>but some aren't</b>.
</br>
</br>
Right now the cost of an idle Booster application is approximately <b>$12 per month</b>
or the equivalent to the fraction of time you have it running
(e.g. <b>$3 per week</b>). This is mainly due to
<a href="https://aws.amazon.com/kinesis/">AWS Kinesis</a>.
The Booster contributors are working hard to remove this resource in the best way
possible, so you can enjoy developing production-ready, cloud-native apps without
paying for idling.
</aside>

Now it is a good time to create that AWS account, you can do so from
[the AWS console registration](https://portal.aws.amazon.com/billing/signup).


Once you've registered yourself, you will need to configure your system to use your
account. To do so, login into the [AWS Console](https://console.aws.amazon.com), and
click on your account name on the top-right corner.

![aws account menu location](../images/aws-account-menu.png)

A menu will open, click on **My security credentials** and it will take you to the
Identity and Access Management panel. Once there, create an access key:

![create access key button location](../images/aws-create-access-key.png)

A pop-up will appear, **don't close it!**.

```ini
[default]
aws_access_key_id = <YOUR ACCESS KEY ID>
aws_secret_access_key = <YOUR SECRET ACCESS KEY>
```

Now create a folder called `.aws` under your home folder, and a file called
`credentials` inside of it.

Paste the template you see on the right, and fill with the keys that appeared
in the popup of the website. Save the file. You are ready to go!

## Installing the Booster CLI

Booster comes with a command line tool that generates boilerplate code, and also,
deploys, and deletes your application resources in the cloud.

### Installing using `npm`

```shell
npm install --global @boostercloud/cli
```

All stable versions are published to [`npm`](https://npmjs.com), to install the
Booster CLI, use the command on the right.

These versions are the recommended ones, as they are well documented, and the
changes are stated in the release notes.

### Installing the development version

If you like to live on the bleeding edge, you might want to install the development
version, but beware, **here might be bugs and unstable features!**

```shell
# Inside a terminal
$ npm install -g verdaccio

# Open a new terminal, and run this command
$ verdaccio

# Go back to the first terminal
$ npm adduser --registry http://localhost:4873
$ git clone git@github.com:boostercloud/booster.git
$ cd booster
$ lerna publish --registry http://localhost:4873 --no-git-tag-version --canary
# Specify some version that you will remember here, i.e. 0.3.0-my-alpha
$ git stash -u
$ npm install --registry http://localhost:4873 @boostercloud/cli
```

Make sure that you have [Git](https://git-scm.com/) installed. You can verify this
by running `git help`.

Follow the steps on the right, they will:

* Install [`verdaccio`](https://verdaccio.org/), an `npm` local proxy
* Run `verdaccio`, and register yourself locally
* Get the Booster source code
* Install `lerna`, the tool that manages all the Booster packages
* Publish the Booster version locally
* Install the Booster development version

If everything went correctly, you should have the Booster CLI installed.

<aside class="notice">
Remember to change the dependency versions in your project's <code>package.json</code> to the version you've specified by following the steps.
</br>
</br>
Also, when installing the dependencies, you have to specify the registry like so:
</br>
<code>
$ npm install --registry http://localhost:4873
</code>
</aside>

### Verify that you have Booster installed

To verify that the Booster installation was successful, enter the following
command into your terminal: `boost version`

If everything went well, you should get something like `@boostercloud/cli/0.3.0`

You are now ready to [write your first Booster app](#your-first-booster-app)!
