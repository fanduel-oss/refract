# Observing React components

Refract exposes in `effectFactory` an object `component`.

```js
const effectFactory = initialProps => component => {
    /* ... */
}
```

`component` contains the following properties:
- `observe(propName: string)`
- `mount`
- `unmount`
