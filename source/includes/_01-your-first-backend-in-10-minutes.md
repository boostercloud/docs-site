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

## 1. Create project
> Create project

```bash
boost new:project <project-name>
```
First of all, we need to create a base Booster project. To do so, we will use the Booster CLI, which
can be invoked by typing `boost` inside of a terminal.

```text
|- <your-project-name>
  |- src
    |- commands
    |- common
    |- entities
    |- events
    |- read-models
    ...
```
It will generate a folder
with your selected project name.

You will need to answer a few questions in order to configure the project. The last step asks you about a _provider package_, for this tutorial, select *AWS*.

Once the project has been successfully created, you will need to move to the new directory, you can do so by typing `cd <your project name>` in a terminal. 

Now open the project in your most preferred IDE, e.g. [Visual Studio Code](https://code.visualstudio.com/).

## 2. First command
We will now define our first command, which will allow us to create posts in our blog.

> New command

```bash
boost new:command CreatePost --fields postId:UUID title:string content:string author:string
```
In a terminal, from the root of your project, type:

```text
|- <your-project-name>
  |- src
    |- commands/CreatePost.ts
```
These commands creates most of the code for us, which can be seen in

However, we still need to define a couple of things in this file:

- Who can trigger our command
- What events should be triggered

For the first part, we will let anyone to trigger it. To do so, configure the `authorize` command option to `"all"` (yes, between quotes, it is a string). If you cannot find it, it is right after the `@Command` decorator.

Additionally, the current `CreatePost` command will not trigger any event, so we will have to come back later to set the event that this command will fire up. This is done in the `handle` method of the command class. Leave it as it is for now.

```typescript
@Command({
  authorize: 'all'// Specify authorized roles here. Use 'all' to authorize anyone
})
export class CreatePost {
  public constructor(
    readonly postId: UUID,
    readonly title: string,
    readonly content: string,
    readonly author: string,
  ) {}

  public handle(register: Register): void {
    register.events( /* YOUR EVENT HERE */)
  }
}

```
If everything went well, you should have now the code you can see on the right.

## 3. First event
> New event

```bash
boost new:event PostCreated --fields postId:UUID title:string content:string author:string
```
In this type of backend architectures, events can be triggered by commands or by other events. We will create an event that defines a `Post` creation. 

```text
|- <your-project-name>
  |- src
    |- events/PostCreated.ts
```
You will realize that a new file has been created:

> Define entity id

```typescript
public entityID(): UUID {
  return this.postId
}
```
There is one small thing that we have to define in the above file, which is the returned value for `EntityID()`. We will set the post `UUID`. It should look like this:

> Add event to `CreatePost` Command

```typescript
public handle(register: Register): void {
    register.events(new PostCreated(this.postId, this.title, this.content, this.author))
  }
```
Now we can go back to the command we created before and add our new event `PostCreated` to the register of events. Your `handle` should look like this:

## 4. First entity
> New entity

```bash
boost new:entity Post --fields title:string content:string author:string --reduces PostCreated
```

We have now created a command and an event, however, we do not have any data representation of a `Post`. As a result, we will create an `entity`.

```text
|- <your-project-name>
  |- src
    |- entities/Post.ts
```
Another file has been created in your project, you will need to add the implementation of its projection:

> Projection

```typescript
@Reduces(PostCreated)
public static projectPostCreated(event: PostCreated, currentPost?: Post): Post {
return new Post(event.postId, event.title, event.content, event.author)
}
```

In the future, we may want to *project* events for this `Post` entity that require retrieving current `Post` values. In that case we would need to make use of `currentPost` argument. 

```typescript
@Entity
export class Post {
  public constructor(
    public id: UUID,
    readonly title: string,
    readonly content: string,
    readonly author: string,
  ) {}

  @Reduces(PostCreated)
  public static projectPostCreated(event: PostCreated, currentPost?: Post): Post {
    return new Post(event.postId, event.title, event.content, event.author)
  }
}
```
The full code for the entity can be seen on the right.

## 5. First read model
> New read model

```bash
boost new:read-model PostReadModel --fields title:string content:string author:string --projects Post
```
Almost everything is set-up. We just need to provide a way to view the `Posts` of our blog. For that, we will create a `read model`.

```text
|- <your-project-name>
  |- src
    |- read-models/PostReadModel.ts
```
Once the read-model code has been generated, we will also need to define a few things:

- Who can read the `Posts`
- How the data is manipulated before returning it

```typescript
@ReadModel({
  authorize: 'all'// Specify authorized roles here. Use 'all' to authorize anyone
})
```
To make it easy, we will allow anyone to read it:

```typescript
@Projects(Post, "id")
  public static projectPost(entity: Post, currentPostReadModel?: PostReadModel): PostReadModel {
    return new PostReadModel(entity.id, entity.title, entity.content, entity.author)
  }
```
and we will project the whole entity

```typescript
@ReadModel({
  authorize: 'all'// Specify authorized roles here. Use 'all' to authorize anyone
})
export class PostReadModel {
  public constructor(
    public id: UUID,
    readonly title: string,
    readonly content: string,
    readonly author: string,
  ) {}

  @Projects(Post, "id")
  public static projectPost(entity: Post, currentPostReadModel?: PostReadModel): PostReadModel {
    return new PostReadModel(entity.id, entity.title, entity.content, entity.author)
  }
}
```
The read model should look like the code on the right:

## 6. Deployment
```bash
boost deploy -e production
```
Everything we need for a basic project is set. It is time to deploy it:

It will take a couple of minutes to deploy all the resources.

> GraphQL endpoint

```text
https://<api-gateway-id>.execute-api.us-east-1.amazonaws.com/production/graphql
```
When the the serverless backend is successfully deployed you will see information about your stack endpoints. For this basic project we will only need to pick the REST API endpoint, reflected in the output as `backend-application-stack.baseRESTURL`, and append `/graphql` at the end, e.g.:

We will use this GraphQL API endpoint to test our backend.

## 7. Testing

Let's get started testing the project. We will perform three actions:

- Add a couple of posts
- Retrieve all posts
- Retrieve a specific post

To perform the GraphQL queries, you might want to use something like [Postwoman](https://postwoman.io/graphql), although `curl` would also work.

### 7.1 Creating posts
We will perform two GraphQL `mutation` queries in order to add information:

> The first GraphQL mutation:

```graphql
mutation { 
    CreatePost(input: {
        postId: "95ddb544-4a60-439f-a0e4-c57e806f2f6e",
        title: "This is my first post",
        content: "I am so excited to write my first post",
        author: "Some developer"
    })
}
```

> The second GraphQL mutation:

```graphql
mutation { 
    CreatePost(input: {
        postId: "05670e55-fd31-490e-b585-3a0096db0412",
        title: "This is my second post",
        content: "I am so excited to write my second post",
        author: "The other developer"
    })
}
```

> The expected response for each of the requests above should be:

```json
{
  "data": {
    "CreatePost": true
  }
}
```

We should now have two `Posts` in our backend, no authorization header is required since we have allowed `all` access to our commands and read models.

### 7.2 Retrieving all posts
> GraphQL query, all posts

```graphql
query {
  PostReadModels {
      id
      title
      content
      author
  }
}
```
In order to retrieve the information we just sent, lets perform a GraphQL `query` that will be hitting our read model `PostReadModel`:

```json
{
  "data": {
    "PostReadModels": [
      {
        "id": "05670e55-fd31-490e-b585-3a0096db0412",
        "title": "This is my second post",
        "content": "I am so excited to write my second post",
        "author": "The other developer"
      },
      {
        "id": "95ddb544-4a60-439f-a0e4-c57e806f2f6e",
        "title": "This is my first post",
        "content": "I am so excited to write my first post",
        "author": "Some developer"
      }
    ]
  }
}
```
You should expect a response similar to this:


### 7.3 Retrieving specific post
> GraphQL query, specific posts

```graphql
query {
  PostReadModel(id: "95ddb544-4a60-439f-a0e4-c57e806f2f6e") {
      id
      title
      content
      author
  }
}
```
It is also possible to retrieve specific a `Post` by adding the `id` as input, e.g.:

You should expect a response similar to this:
```json
{
  "data": {
    "PostReadModel": {
      "id": "95ddb544-4a60-439f-a0e4-c57e806f2f6e",
      "title": "This is my first post",
      "content": "I am so excited to write my first post",
      "author": "Some developer"
    }
  }
}
```

## 8. Removing stack
Now, let's undeploy our backend. **Remember that it costs you money to have it on idle**.

> Undeploy stack

```bash
boost nuke -e production
```
To do so, execute the following command from the root of your project, in a terminal:

It will ask you to verify the project name, it will be the same one that it was written when we created the project. If you don't remember the name, go to `config/production.ts` and copy the `name` field. 

## 9. More functionalities

The are many other options for your serverless backend built with Booster Framework:

- GraphQL subscriptions
- REST API
- Securing requests depending on user roles
- Events that trigger more events
- Reading entity snapshots in handlers to apply domain-driven decisions
- and much more...

But we won't be covering them in this section. Keep reading if you want to know more!

<aside class="success">
Congratulations! you've built a serverless backend in less than 10 minutes. We hope you have enjoyed discovering the magic of Booster Framework, please keep reading if you want to know more about it.
</aside>
