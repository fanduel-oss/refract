# Handling Errors

When using Refract, there are two categories of errors to be aware of: _expected_ errors and _unexpected_ errors. Each type should be handled differently.

## Expected Errors

Expected errors are any which you can plan for in advance.

For example, an HTTP request may fail for any number of reasons, and it's good practice to take this into account and design informative error states for any which are relevant to your app.

This type of error is often handled via internal logic within an `aperture`'s streams, and sometimes via the main `handler`. This means that all expected functionality - including common error states - is taken care of within the same context.

## Unexpected Errors

Unexpected errors are any which you cannot plan for.

They are usually some kind of exception which has been thrown within your logic, causing your stream to collapse, and due to their nature it's not possible to plan for them before they occur.

This type of error is handled via an `errorHandler`, an optional function which can be passed into `withEffects` along with the main `handler`. This is intended to be a way for you to log unexpected errors, so that you can investigate and fix any issues which emerge when your app is being used in the real world.

An `errorHandler` has an identical function signature to a `handler`, but with an `error` instead of an `effect` passed in as the second argument:

```js
const errorHandler = (initialProps) => (error) => {
    /* handle error here */
}
```
