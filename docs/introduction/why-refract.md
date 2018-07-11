# Why Refract?

As JavaScript applications have matured, it has become clear that there is a conflict at their heart.

The ideal we aim for is a **composable component-based architecture**, using functional programming principles and unidirectional data flow. The benefits of this ideal are apps which are **more predictable, more testable, and more maintainable**.

However, once your app needs to include side-effects such as API requests or analytics, this purity becomes impossible.

These side-effects hold us back from writing fully declarative code. Wouldn't it be nice to cleanly separate them from our apps, so that we can achieve our ideal inside our apps while still connecting to the outside world?

**Refract allows you to manage your side-effects declaratively, completely separate from your UI and your state.** It sits between your state and UI, and allows you to leverage the power of reactive programming to handle side-effects.
