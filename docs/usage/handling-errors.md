# Handling Errors

When using Refract, there are two categories of errors to be aware of: _expected_ errors and _unexpected_ errors. Each type should be handled differently.

## Expected Errors

Expected errors are any which you can plan for in advance.

For example, an HTTP request may fail for any number of reasons, and it's good practice to take this into account and design informative error states for any which are relevant to your app.

This type of error is often handled via internal logic within an `aperture`'s streams, and sometimes via the main `handler`. This means that all expected functionality - including common error states - is taken care of within the same context.

## Unexpected Errors

Unexpected errors are any which you cannot plan for. They are usually some kind of exception which has been thrown within your logic, causing your stream to collapse.

This type of error is handled via an `errorHandler`, an optional function which can be passed into `withEffects` along with the main `handler`. This is intended to be a way for you to log unexpected errors, so that you can investigate and fix any issues which emerge when your app is being used in the real world.

An `errorHandler` has an identical function signature to a `handler`, but with an `error` instead of an `effect` passed in as the second argument:

```js
const errorHandler = initialProps => error => {
    /* handle error here */
}
```

## Recovering from unexpected errors

If an unexpected error occurs, it will cause your `aperture` function to no longer work and emit effects! Stream libraries have ways to catch or ignore those errors so they don't propagate and cause entire streams to terminate!

*   For RxJS, you can look at [this guide](https://alligator.io/rxjs/simple-error-handling/) and [that guide](https://xgrommx.github.io/rx-book/content/getting_started_with_rxjs/creating_and_querying_observable_sequences/error_handling.html). These guides are not up to date so make sure you look up operators in the [RxJS documentation](http://reactivex.io/rxjs).
*   With xstream, [use the `replaceError` operator](https://github.com/staltz/xstream#-replaceerrorreplace)
*   With most, [use the `recoverWith` operator](https://github.com/cujojs/most/blob/master/docs/api.md#handling-errors)
