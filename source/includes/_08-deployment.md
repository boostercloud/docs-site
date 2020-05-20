# Deploying

One of the goals of Booster is to become provider agnostic so you can deploy your application to any serverless provider like AWS, Google Cloud, Azure, etc...

So far, in the current version, only AWS is supported, but given the high level of abstraction, it will eventually support
all cloud providers. (**Contributions are welcome!** 😜)

## Configure your provider credentials

> Creating a plain text file manually named `~/.aws/credentials` with the following content will be enough:

```text
[default]
aws_access_key_id = <YOUR KEY ID>
aws_secret_access_key = <YOUR ACCESS KEY>
region = eu-west-1
```

In the case of AWS, it is required that your `~/.aws/credentials` are properly setup, and a `region` attribute is specified. If you have the [AWS CLI installed](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html), you can create the config file by running the command `aws configure`, but that is completely optional, **AWS CLI is not required to run booster**. 

<aside class="notice">
It's recomended to use IAM user keys and avoiding your root access keys. If you need help obtaining a `KEY ID` and `ACCESS KEY`, <a href=https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html#Using_CreateAccessKey">check out the oficial AWS guides</a>
</aside>

## Deploy your project

To deploy your Booster project, run the following command:

`boost deploy`

It will take a while, but you should have your project deployed to your cloud provider.

If you make changes to your code, you can run `boost deploy` again to update your project in the cloud.

### Introducing booster full-stack applications

Booster now uploads your frontend application to the cloud too! Just follow these steps:

- Create a `public` directory in the root of your booster project
- Put your frontend application inside

And that's it! If you run `boost deploy`, both backend and frontend will be deployed and
you should see a CloudFront URL in your console's output

## Deleting your cloud stack

If you want to delete the Booster application that has been deployed to the cloud, you can run:

`boost nuke`

<aside class="warning">
<b>Note</b>: This will delete everything in your stack, including databases. This action is <b>not</b> reversible!
</aside>