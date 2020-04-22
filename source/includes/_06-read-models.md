# Read Models - The Read Pipeline
> TODO: (Not in the current release) To generate a Read Model you can use a read model generator. It works similarly than the entities generator:

```shell
boost new:read-model <name of the read model class> --fields fieldName:fieldType --projects EntityOne EntityTwo
```

> Using the generator will generate a class with the following structure in `src/read-models/<name-of-the-read-model>.ts`. For instance:

```shell
boost new:read-model CartReadModel --fields id:UUID cartItems:"Array<CartItem>" paid:boolean --projects Cart
```

> It will generate a class with the following structure:

```typescript
@ReadModel
export class CartReadModel {
  public constructor(
    readonly id: UUID,
    readonly cartItems: Array<CartItem>,
    public paid: boolean
  ) {}

  @Projection(Cart, 'id')
  public static updateWithCart(cart: Cart, oldCartReadModel?: CartReadModel): CartReadModel {
    return new CartReadModel(cart.id, cart.cartItems, cart.paid)
  }
}
```

Read Models are cached data optimized for read operations and they're updated reactively when [Entities](#entities) are updated by new [events](#events). They also define the *Read* API, the available REST endpoints and their structure.

Read Models are classes decorated with the `@ReadModel` decorator that have one or more projection methods. A Projection is a method decorated with the `@Projection` decorator that, given a new entity value and (optionally) a previous read model state, generate a new read model value.

Read models can be projected from multiple [entities](#entities) as soon as they share some common key called `joinKey`.

Read Model classes can also be created by hand and there are no restrictions regarding the place you put the files. The structure of the data is totally open and can be as complex as you can manage in your projection functions.

Defining a read models enables a new REST Read endpoint that you can use to query or poll the read model records [see the API documentation](#booster-cloud-framework-rest-api).