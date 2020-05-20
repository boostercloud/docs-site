# Your application API

The API is the way the outside world interact with your system, and any server-side application needs one.
With Booster, you don't need to worry about it: _it is created for you_ and evolves with your code _automatically_.

When you finish deploying your application using the `boost deploy` command, it will print useful information needed to 
use your API. It will be shown under the "Outputs" section.

```sh
Outputs:
<application name>.httpURL = https://<API ID>.execute-api.<region>.amazonaws.com/<environment name>
<application name>.websocketURL = wss://<API ID>.execute-api.<region>.amazonaws.com/<environment name>
<application name>.clientID = abcdXjk1234
```

The meaning of those values are:

- **httpURL**: This is the main URL of your application. You will need it to interacting with the 
authentication/authorization API and to send commands and read model queries.
- **websocketURL**: This is the Websocket URL you will need to use to subscribe to your read models and receive
them every time they are updated in real time 
- **clientID**: This parameter is specific for the AWS provider (so you will see only if you used that provider) and is 
needed only for the `auth/sign-up` and `auth/sign-in` endpoints.

For details, see the following sections.

<aside class="notice">
Note that the <strong>Content-Type</strong> for all requests is always <code>application/json</code>
</aside>


## Authentication and Authorization API

The following endpoints are provisioned if your application have at least one role defined. For more information about how
to use roles to restrict the access to your application, see the section [Authentication and Authorization](#authentication-and-authorization).

### Sign-up
Register a user in your application. After a successful invocation, an email will be sent to the user's inbox
with a confirmation link. **Users's won't be able to sign-in before they click in that link**.
#### Endpoint
```http request
POST https://<httpURL>/auth/sign-up
```
#### Request body
```json
{
	"clientId": "string",
	"username": "string",
	"password": "string",
	"userAttributes": {
   		"roles": ["string"]
	}
}
```

Parameter | Description
--------- | -----------
_clientId_ | The application client Id that you got as an output when the application was deployed.
_username_ | The username of the user you want to register. It **must be an email**.
_password_ | The password the user will use to later login into your application and get access tokens.
_userAttributes_ | Here you can specify the attributes of your user. These are: <br/> - _roles_  An array of roles this user will have. You can only specify here roles with the property `allowSelfSignUp = true`


#### Response
An empty body

#### Errors
> Sign-up error response body example: Not specifying an email as username.

```json
{
    "__type": "InvalidParameterException",
    "message": "Username should be an email."
}
```

You will get an HTTP status code different from 2XX and a body with a message telling you the reason of the error.

### Sign-in
Allows your users to get tokens to be able to make request to restricted endpoints.
Remember that before a user can be signed in into your application, **its email must be confirmed**

#### Endpoint
```http request
POST https://<httpURL>/auth/sign-in
```
#### Request body
```json
{
	"clientId":"string",
	"username":"string",
	"password":"string"
}
```

Parameter | Description
--------- | -----------
_clientId_ | The application client Id that you got as an output when the application was deployed.
_username_ | The username of the user you want to sign in. It must be previously signed up
_password_ | The password used to sign up the user.

#### Response
```json
{
    "accessToken": "string",
    "expiresIn": "string",
    "refreshToken": "string",
    "tokenType": "string"
}
```

Parameter | Description
--------- | -----------
_accessToken_ | The token you can use to access restricted resources. It must be sent in the `Authorization` header (prefixed with the `tokenType`)
_expiresIn_ | The period of time, in seconds, after which the token will expire
_refreshToken_ | The token you can use to get a new access token after it has expired.
_tokenType_ | The type of token used. It is always `Bearer`

###### Errors
> Sign-in error response body example: Login of an user that has not been confirmed

```json
{
    "__type": "UserNotConfirmedException",
    "message": "User is not confirmed."
}
```

You will get a HTTP status code different from 2XX and a body with a message telling you the reason of the error.

### Sign-out
Finalizes the user session by cancelling their tokens.

###### Endpoint
```http request
POST https://<httpURL>/auth/sign-out
```
###### Request body
> Sign-out request body
```json
{
	"accessToken":"string"
}
```

Parameter | Description
--------- | -----------
_accessToken_ | The access token you get in the sign-in call.

###### Response
An empty body
###### Errors
> Sign-out error response body example: Invalid access token specified

```json
{
    "__type": "NotAuthorizedException",
    "message": "Invalid Access Token"
}
```

You will get a HTTP status code different from 2XX and a body with a message telling you the reason of the error.

 

## Commands and ReadModels API
 
This is the main API of your application, as it allows you to:

 - _Modify_ data by **sending commands**
 - _Read_ data by **querying read models**
 - _Receive data in real time_ by **subscribing to read models** 
 
All this is done through [GraphQL](https://graphql.org/), a nice query language for APIs that has useful advantages over simple REST APIs.

If you are not familiar with GraphQL, then, first of all, don't worry! 
_Using_ a GraphQL API is simple and straightforward.
_Implementing it_ on the server side is the hardest part, as you need to define your schema, operation, resolvers, etc.
Luckily, you can forget about that because it is already done by Booster.
 
<aside class="notice">
The GraphQL API is fully <strong>auto-generated</strong> based on your <em>commands</em> and <em>read models</em>
</aside>

### Relationship between GraphQL operations and commands and read models
GraphQL defines three kinds of operations that you can use: _mutations_, _queries_, and _subscriptions_. 

The names are pretty meaningful, but we can say that you use a `mutation` when you want to change data, a `query` when you want to get
data on-demand, and a `subscription` when you want to receive data at the moment it is updated.

Knowing this, you can infer the relationship between those operations and your Booster components:

- You _send_ a **command** using a **mutation**
- You _read_ a **read model** using a **query**
- You _subscribe_ to a **read model** using a **subscription** 

### How to send GraphQL request
GraphQL uses two existing protocols: 

- _HTTP_ for `mutation` and `query` operations
- _Websocket_ for `subscription` operations

The reason for the Websocket protocol is that, in order for subscriptions to work, there must be a way for the server to send data
to clients when it is changed. HTTP doesn't allow that, as it is the client the one which always initiates the request.
 
This is the reason why Booster provisions two main URLs: the **httpURL** and the **websocketURL** (you can see them after
deploying your application). You need to use the "httpURL" to send GraphQL queries and mutations, and the "websocketURL"
to send subscriptions.

Therefore:

- To send a GraphQL mutation/query, you just send an HTTP request to the _httpURL_, with _method POST_, and a _JSON-encoded body_ with the mutation/query deatils.
- To send a GraphQL subscription, you first connect to the _websocketURL_, and then send a _JSON-encoded message_ with the subscription details.

Check the following section for details and examples.

<aside class="notice">
You normally don't need to deal with this low-level details. There are plenty of GraphQL clients for sending request manually
(like <a href="https://postwoman.io/">Postwoman</a>) or libraries you can use in the client-side of your application
(like <a href="https://www.apollographql.com/">Apollo</a>)
</aside>
### Sending commands

The way we send a command to our Booster app is by using a GraphQL "mutation". The following GraphQL request is sending the command ChangeCart with all its required payload:

URL: <httpURL>/graphql GraphQL body:

mutation {
  ChangeCart(input: {
      cartId: "demo"
      sku: "ABC_01"
      quantity: 2
  })
}
In case you are using an HTTP client without support for GraphQL, you can do exactly the same by sending an HTTP request with method "POST" and include a JSON body with a field named "query" with the GraphQL mutation: URL: <httpURL>/graphql Method: POST Body:

{
   "query":"mutation { ChangeCart(input: { cartId: \"demo\" sku: \"ABC_01\" quantity: 2 }) }"
}

#### Request body:

```json
{
  "typeName": "ChangeCartItem",
  "version": 1,
  "value": {
    "cartId": "demo",
    "sku": "ABC-10",
    "quantity": 1
  }
}
```

## Read API (retrieve a read model)

- [ ] Improve this documentation

### Get a list

`GET https://<httpURL>/readmodels/<read model class name>`

Example:

`GET https://<httpURL>/readmodels/CartReadModel`

### Get a specific read model

`GET https://<httpURL>/readmodels/<read model class name>/<read model ID>`

Example:

`GET https://<httpURL>/readmodels/CartReadModel/42`
