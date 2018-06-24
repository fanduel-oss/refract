# Observing actions and selectors

Refact provides packages to help with observing a redux store. Redux stores are observable by default (with `store.subscribe()`) and are [ECMAScript observables](https://github.com/tc39/proposal-observable).

Refract offers a store enhancer to add:
- Library adapters (RxJS, Most, xstream and callbag)
- Action observability

### List of redux packages

- `refract-redux-callbag` for [Callbag](https://github.com/callbag/callbag)
- `refract-redux-most` for [Most](https://github.com/cujojs/most)
- `refract-redux-rxjs` for [RxJS](https://github.com/reactivex/rxjs)
- `refract-redux-xstream` for [xstream](https://github.com/staltz/xstream)
