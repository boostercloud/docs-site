# Your first Booster app in 10 minutes 

In this section, we will go through all the necessary steps to have the backend for a blog application up and running in a few minutes.

The steps to follow will be:
- [Create project](#1-create-the-project)
- [First command](#2-first-command)
- [First event](#3-first-event)
- [First entity](#4-first-entity)
- [First read model](#5-first-read-model)
- [Deployment](#6-deployment)
- [Testing](#7-testing)
    - [Creating posts](#71-creating-posts)
    - [Retrieving all posts](#72-retrieving-all-posts)
    - [Retrieving specific post](#73-retrieving-specific-post)
- [Removing stack](#8-removing-stack)
- [Further improvements](#9-further-improvements)
- [Conclusion](#10-conclusion)

## 1. Create project
First of all, we need to create a base Booster project

`boost new:project <project-name>`

You will need to answer a few questions in order to configure the project. One of these steps will require that a provider is selected, we recommend selecting AWS. 

Once the project has been successfully created, you will need to move to the new directory. Ideally, you would also open the project in your most preferred IDE, e.g. Visual Studio Code.

## 2. First command
We will now define our first command, which will allow us to create Posts.

`boost new:command CreatePost --fields postId:UUID title:string content:string author:string`

These commands creates most of the code for us, which can be seen in `<project-root>/src/commands/CreatePost.ts`

However, we still need to define a couple of things in this file:
- Who can trigger our command
- What events should be triggered

For now, we will set the `authorize` configuration to `all`, so anyone can trigger it.

Additionally, the current `CreatePost` command will not trigger any event, so we will have to come back later to set the event that this command will fire up.

## 3. First event
In this type of backend architectures, events can be triggered by commands or by other events. We will create an event that defines a `Post` creation. 

`boost new:event PostCreated --fields postId:UUID title:string content:string author:string`

You will realize that a new file has been created, `<project-root>/src/events/PostCreated.ts`

There is one small thing that we have to define in the above file, which is the returned value for `EntityID()`. We will set the post `UUID`. It should look like this:
```typescript
public entityID(): UUID {
    return this.postId
  }
```

Now we can go back to the command we created before and add our new event `PostCreated` to the register of events. Your `handle` should look like this:
```typescript
public handle(register: Register): void {
    register.events(new PostCreated(this.postId, this.title, this.content, this.author))
  }
```

## 4. First entity
We have now created a command and an event, however, we do not have any data representation of a `Post`. As a result, we will create an `entity`.

`boost new:entity Post --fields title:string content:string author:string --reduces PostCreated`

Another file has been created in your project, `<project-root>/src/entities/Post.ts`

The `Post` entity has been created but no projection has been defined, so we will do so:

```typescript
@Reduces(PostCreated)
public static projectPostCreated(event: PostCreated, currentPost?: Post): Post {
return new Post(event.postId, event.title, event.content, event.author)
}
```

In the future, we may want to project events for this `Post` entity that require retrieving current `Post` values. In that case we would need to make use of `currentPost`. 

## 5. First read model
Almost everything is set-up. We just need to provide a way to view the `Posts` of our blog. For that, we will create a `read model`.

`boost new:read-model PostReadModel --fields title:string content:string author:string --projects Post`

Once the read-model code has been generated, it will be placed in `<project-root>/src/read-models/PostReadModel.ts`

Similar to the `CreatePost` command we defined at the beginning, we will also need to define a few things:
- Who can read the `Posts`
- How the data is manipulated before returning it

To make it easy, we will allow anyone to read it:
```typescript
@ReadModel({
  authorize: 'all'// Specify authorized roles here. Use 'all' to authorize anyone
})
```

and we will project the whole entity

```typescript
@Projects(Post, "id")
  public static projectPost(entity: Post, currentPostReadModel?: PostReadModel): PostReadModel {
    return new PostReadModel(entity.id, entity.title, entity.content, entity.author)
  }
```

## 6. Deployment
Everything we need for a basic project is set. It is time to deploy it:

`boost deploy -e production`

It will take a couple of minutes to deploy all the resources.

When the the serverless backend is successfully deployed you will see information about your stack endpoints. For this basic project we will only need to pick the REST API endpoint, reflected in the output as `backend-application-stack.baseRESTURL`, e.g.:

`https://<api-gateway-id>.execute-api.us-east-1.amazonaws.com/production/`

We will use this endpoint to test our backend.

## 7. Testing
Let's get started testing the project. We will perform two actions:
- Add a couple of posts
- Retrieve all posts
- Retrieve a specific post

To perform the HTTP requests, you might want to use something like `Postman`, although `curl` would also work.

### 7.1 Creating posts
We will perform a two `POST` request to the following commands URL:

`https://<api-gateway-id>.execute-api.us-east-1.amazonaws.com/production/commands`

The first request:

```json
{
	"typeName": "CreatePost",
	"version": 1,
	"value": {
    	"postId": "95ddb544-4a60-439f-a0e4-c57e806f2f6e",
    	"title": "This is my first post",
    	"content": "I am so excited to write my first post",
		"author": "Some developer"
  }
}
```

The second request:

```json
{
	"typeName": "CreatePost",
	"version": 1,
	"value": {
    	"postId": "05670e55-fd31-490e-b585-3a0096db0412",
    	"title": "This is my second post",
    	"content": "I am so excited to write my second post",
		"author": "Some developer"
  }
}
```

We should now have two `Posts` in our backend, no authorization header is required since we have allowed `all` access to our commands and read models.

### 7.2 Retrieving all posts
In order to retrieve the information we just sent, lets perform a `GET` request that will be hitting our read model `PostReadModel`:

`https://<api-gateway-id>.execute-api.us-east-1.amazonaws.com/production/readmodels/PostReadModel`

### 7.3 Retrieving specific post
It is also possible to retrieve specific a `Post` by adding the `postId` to the URL, e.g.:

`https://<api-gateway-id>.execute-api.us-east-1.amazonaws.com/production/readmodels/PostReadModel/95ddb544-4a60-439f-a0e4-c57e806f2f6e`

## 8. Removing stack
If you want to un-deploy your backend, just execute the following command:

`boost nuke -e production`

It will ask you to verify the project name, it will be the same one that it was written when we created the project. If you don't remember the name, go to `<project-root>/package.json` and copy the `name`. 

## 9. Further improvements
The are many other options for your serverless backend built with Booster Framework:
- GraphQL API available with subscriptions
- Securing requests depending on user roles
- Events that trigger more events
- Reading entity snapshots in handlers to apply domain-driven decisions
- and much more...

## 10. Conclusion
If you reached this point following all the steps you have created a serverless backend in less than 10 minutes. This framework intends to simplify the tedious process of building a backend from scratch. Furthermore, it reduces the infrastructure management work by automatically provisioning anything your project needs. It is not just magic, it is Booster Framework.

We hope you have enjoyed it and we would like to remind you that Booster Framework is an open-source project and your contributions to make it better will be much appreciated.

Thank you very :D


