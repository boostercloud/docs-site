# A bird's eye view of Booster

Booster was synthesized from years of experience in high availability,
and high performance software scenarios. Most implementation details in
these situations repeat time after time. Booster abstracts them in order
for you to focus on what matters: The domain of your application.

In this section you'll get a small grasp of how Booster works, but this is
not a full guide.

Just get a taste of Booster, and when you're ready, you can
[install Booster](#installing-booster),
begin [writing your first Booster app](#your-first-booster-app),
or even get into the [in-depth reference documentation](#booster-in-depth).

## Think about user actions, not endpoints

```typescript
@Command({
  authorize: 'all',
})
export class SendMessage {
  public constructor(
    readonly chatroomID: UUID,
    readonly messageContents: string
  ) {}

  public handle(register) {
    const timestamp = new Date()
    register.events(
      new MessageSent(this.chatroomID, this.messageContents, timestamp)
    )
  }
}
```

A user action is modeled in Booster as a Command.

Similar to controllers, command handlers serve as one of the entry points to your system,
they scale horizontally automatically.

Commands are defined as decorated TypeScript classes with some fields and a `handle` method.

## Time travel through your data

```typescript
@Event
export class MessageSent {
  public constructor(
    readonly chatroomID: UUID,
    readonly messageContents: string,
    readonly timestamp: Date
  ) {}

  public entityID(): UUID {
    return this.chatroomID
  }
}
```

Instead of mutating your data in a database, Booster stores an infinite
stream of events. You get the possibility of seeing how your data changes
through time and space.

Need to fix a bug that happened one year ago? Just change the event generation
and re-run it from the past.

Events, like Commands, are just TypeScript classes. No strings attached.

## Data modelling

```typescript
interface Message {
  contents: string
  hash: string
}

@Entity
export class Chatroom {
  public constructor(
    readonly id: UUID,
    readonly messages: Array<Message>,
    readonly lastActivity: Date
  ) {}

  @Reduces(MessageSent)
  public static reduceMessageSent(event: MessageSent, prev?: Chatroom): Chatroom {
    const message = {
      contents: event.messageContents,
      hash: md5sum.digest(event.messageContents)
    }

    if (prev) {
      prev.messages.push(message)
      prev.lastActivity =
        event.timestamp > prev.lastActivity
        ? event.timestamp
        : prev.lastActivity
      return prev
    }

    return new Chatroom(event.chatroomID, [message], event.timestamp)
  }
}
```

Define your data with TypeScript types, without having to learn a new
data definition language.

Entities are the central part of your domain. They are a representation
of your event stream at some point in time.

You specify the fields of your entity as all the important things that
will be generated from your events.

No alien libraries, no need about thinking in the state of the database,
just plain TypeScript and some cool decorators.

Database failure? Don't fret! The entities will be regenerated from the
events.

On top of that, Entities serve as automatic snapshots, so your app is
very fast!

## Combining and transforming your data

```typescript
@ReadModel
export class ChatroomActivity {
  public constructor(
    readonly id: UUID,
    readonly lastActivity: Date,
  ) {}

  @Projection(Chatroom, 'id')
  public static updateWithChatroom(chatroom: Chatroom, prev?: ChatroomActivity): ChatroomActivity {
    return new ChatroomActivity(chatroom.id, chatroom.lastActivity)
  }
}
```

Most of the time, you don't want to expose all of the data you are storing
in your system. You might want to hide some parts, transform others.

Also, you might want to combine some entities into one object so the
client can read them more efficiently.

Get your data delivered in the shape that you want, instantly to your
client. Booster will push the changes live, so you only have to focus
in rendering it or consuming in the way you require.

## GraphQL is hard? Who said that?

```graphql
# Send a command
mutation {
  SendMessage(
    input: {
      chatroomID: 1,
      messageContents: "Hello Booster!"
    }
  )
}

# Subscribe to a read model
subscription {
  ChatroomActivity(id: 1) {
    id
    lastActivity
  }
}
```

GraphQL is nice on the client side, but on the backend, it requires you
to do quite some work. Defining resolvers, schema, operations, and
friends, takes some time, and it is not the most thrilling work you can
do. Especially when your domain has nothing to do with managing a GraphQL
API.

Each Command is mapped to a GraphQL mutation, and each ReadModel, is mapped
to a GraphQL query or subscription.

Just write your Booster app as you would do normally, and enjoy a GraphQL
API for free, with it's schema, operations and everything.

## Fasten your seatbelts

This is a simplified view of Booster. It supports more other features
that will definitely speed-up your development process. Among them:

* Automatic Migrations - with them you can easily introduce changes in your data
* Versioning - to do stuff like A/B testing
* Authentication - integrated with your cloud provider, so you don't have to manage security yourself

All of this under the best practices of security and privacy of your cloud provider.
Booster defaults to the most strict option, so you don't have to worry about security
configuration beforehand.

Thrilled already? Jump to [the installation steps](#installing-booster), read
[how to write your first Booster app](#your-first-booster-app), and
join the community in the [Spectrum chat](https://spectrum.chat/boostercloud).