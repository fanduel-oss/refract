# Handling Errors

## Using Streams

It is usually preferable to handle any expected errors within your stream logic inside your `aperture`, to ensure you provide a clean user experience for any expected scenario.

For example, it's not uncommon for an async request to fail, so it's a good idea to take this into account in your logic.

## Using An `errorHandler`

If an error occurs within your `aperture`'s pipelines which is not caught internally, an error object is passed to your `errorHandler`.

```js
const errorHandler = (initialProps) => (error) => {
    /* handle errors here */
}
```

This is a useful escape hatch to allow for handling unexpected errors. One use case for this would be to send these errors to a log somewhere, and investigating them!
