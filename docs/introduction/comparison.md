# Comparison

The benefits of Refract are:
- it can observe any source of data: React props, Redux actions and state, any producer
- it can define any side-effect declaratively: you are fully in control of what can be done and how it is expressed
- it collocates side-effects with your components and they only run when your components run: great for code splitting and performance
- it leverages existing reactive programming libraries: RxJS, xstream, most and callbag
- it doesn't prescribe a state container solution

We think Refract is superior to all libraries named below with the exception of redux-cycles, which benefits from Cycle.js declarative and reactive awesomeness: Refract can achieve similar results, see advanced topic for achieving [fully declarative effects](../advanced/fully-declarative.md)

## Redux-based solutions

With redux, handling of side-effects can be done using thunks. But it is possible to react to actions dispatched to the store with middlewares, and they have been used by many libraries to handle side-effects: redux-saga, redux-observable and redux-loop to name a few.

Most of those solutions have a limited scope: they observe actions, and dispatch actions as a result. It is only a subset of what Refract can do:
- with redux, Refract can observe actions and state nodes
- Refract can dispatch actions as a side-effect, or trigger any other type of side-effect

### redux-thunk

[Thunks](https://redux.js.org/api-reference/applymiddleware#example-using-thunk-middleware-for-async-actions) can be used to express any side-effect imperatively and to dispatch to your store asynchronously. It is a good way to get started before making a choice on what abstraction and side-effect model to use, if you choose to go down this way (there is nothing wrong in sticking to thunks!).

### redux-saga

[Redux-saga](https://redux-saga.js.org/) is a powerful solution to express side-effects and is the leader on its space. However like similar redux-based solutions, it is limited to dispatching actions as a result observing actions. Redux-saga introduces its own DSL and time-based operators. It makes the learning curve steep and adds size to your bundle and requires you to learn it, without being able to re-use it outside Redux. "Sagas" can be added dynamically, but they can't be removed.

### redux-observable

[Redux-observable](https://redux-observable.js.org/) is simlar to redux-saga, and offers another powerful solution. It has the same limitations of action to action effects. It leverages RxJS for declaring them, which can be used outside your redux store. Reactive programming is not easy to learn and the learning curve of redux-observable is also steep. However it can be worth the investment: reactive programming is getting more and more attention these days. Redux-observable allows you to use other reactive libraries (xstream, most) but on top of RxJS, which is unfortunately shipped by default. Finally, it is possible to dynamically add "epics", but it isn't possible to remove any.

### redux-loop

[Redux-loop](https://redux-loop.js.org/) embeds side-effect logic in your reducers. It is not limited to reacting to actions and you can also react to state changes. But effects can only be actions and it adds complexity to your reducers, not separating concerns of state mutation and side-effects. Redux-loop is not as powerful as redux-saga or redux-observable with time-based effects and can't perform operations like debouncing, throttling, etc.


## redux-cycles

I'm not listing [redux-cycles](https://github.com/cyclejs-community/redux-cycles) in the list of redux-based solutions: it is more a Cycle.js based solution by adding redux observability to it, and it benefits from its mighty power to plug Redux in its declarative and reactive model. Like redux-observable or Refract, it leverages reactive programming, can be used with various libraries (most, RxJS, xstream) but requires xstream by default.


## react-side-effect

[React-side-effect](https://github.com/gaearon/react-side-effect) allows to have declarative side-effects within React, by reacting to prop changes. It is a great solution for basic needs. If it shares similarities with Refract, it cannot react to prop functions being called. It is also not able to create time-based effects, and side-effects can't use props (no possible dependency injection).
