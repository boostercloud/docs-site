# Configuration and environments
One of the goals of booster is to avoid configuration parameters as much as
possible, inferring everything automatically from your code. However, there
are some aspects that can't be inferred (like the application name), or it
is useful to change them under certain circumstances, especially when using
different [environments](#environments)

## Booster configuration
```typescript
import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
import { Provider } from '@boostercloud/framework-provider-aws'

Booster.configure('pre-production', (config: BoosterConfig): void => {
  config.appName = 'my-app-name'
  config.provider = Provider
})
```
You configure your application by calling to the `Booster.configure()` method. 
There are no restrictions about where you should do this call, but the convention is to have your configuration files in the `src/config` folder.
If you used the project generator (`boost new:project <project-name>`), this is where the config files are by default.

The following is the list of the fields you can configure:

- **appName:** This is the name that identifies your application. It will be used
for many things, such us prefixing the resources created by the provider. There
are certain restrictions regarding the characters you can use: all of them must be
lower-cased and can't contain spaces.
Two apps with different names are completely independent.
- **provider:** This field contains the provider library instance that Booster will use when deploying```
or running your application. So far, there is only one provider created for Booster,
`@boostercloud/framework-provider-aws`, and it is probably the one you have already
set if you used the generator to create your project. There will be more providers,
like one that allows running your Booster app locally.

## Environments

```typescript
import { Booster } from '@boostercloud/framework-core'
import { BoosterConfig } from '@boostercloud/framework-types'
// A provider that deploys your app to AWS:
import { AWSProvider } from '@boostercloud/framework-provider-aws'
// A provider that deploys your app locally:
import { LocalProvider } from '@boostercloud/framework-provider-local' 

Booster.configure('dev', (config: BoosterConfig): void => {
  config.appName = 'fruit-store-qa'
  config.provider = LocalProvider
})

Booster.configure('stage', (config: BoosterConfig): void => {
  config.appName = 'fruit-store-stage'
  config.provider = AWSProvider
})

Booster.configure('prod', (config: BoosterConfig): void => {
  config.appName = 'fruit-store-prod'
  config.provider = AWSProvider
})

// This other configuration could be in another file that Pepe doesn't commit
Booster.configure('pepe', (config: BoosterConfig): void => {
  config.appName = 'pepe-fruit-store'
  config.provider = AWSProvider
})
```
When you configure your app by calling `Booster.configure`, the first parameter you need to pass is the
**environment name**, and it identifies a specific set of configuration parameters. When you deploy your 
application, you need to specify which environment you want to deploy.

This way, you can have different configuration depending on your needs. For example, your 'fruit-store' app
can have three environments: 'dev', 'stage', and 'prod', each of them with different app names
or providers. 
A developer named "Pepe" could have another environment with a different app name so that he can deploy the
entire application to a production-like environment and test it. Check the example to see how this app would be
configured.

The only thing you need to do deploy a whole new completely-independent copy of your application is to use 
a different name.
