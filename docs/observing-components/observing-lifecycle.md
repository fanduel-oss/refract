# Observing component lifecycle

## Components mounting

`component.mount` is a stream which will emit a single value (like a signal) when a component mounts.

It can be useful to defer any logic after a component has been mounted.

## Components unmounting

`component.unmount` is a stream which will emit a single value (like a signal) when a component unmounts.

It can be useful to trigger side-effects when a component is about to be unmounted.
