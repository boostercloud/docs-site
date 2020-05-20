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
 
All this is done through GraphQL, a nice query language for APIs that has useful advantages over simple REST APIs.
If you are not familiar with GraphQL then, first of all, don't worry! _Using_ a GraphQL API is simple and straightforward.
The hardest part of GraphQL  
Booster creates a GraphQL API for your application. Why GraphQL and not a simple REST API?
For many reasons, among them:
-- keep from here-----------------------
 - It is more user-friendly
 - Schema
 - Subscriptions
 - Fetch only what you want
 - etc
 
## Write API (commands submission)

- [ ] TODO: Improve this documentation

`POST https://<httpURL>/commands`

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
