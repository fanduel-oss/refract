# Why Refract?

As JavaScript applications have matured, it has become clear that there is a conflict at their heart.

The ideal we aim for is a **composable component-based architecture**, using functional programming principles and unidirectional data flow. The benefits of this ideal are apps which are **more predictable, more testable, and more maintainable**.

However, once your app needs to include side-effects such as event handling, API requests or analytics, this purity becomes impossible. These side-effects hold us back from writing fully declarative code. Wouldn't it be nice to cleanly separate them from our apps, so that we can achieve our ideal inside our apps while still connecting to the outside world?

On the other hand, reactive programming has demonstrated how powerful it is to handle synchronous and asynchronous logic in a declarative manner. Refract is possibly the first general-purpose abstraction to fully leverage reactive programming with React (and Preact and Inferno).

**Refract allows you to manage your application logic and effects declaratively and reactively.** You can start to use it gradually today, for managing some side-effects, without changing the way you write components or the libraries you use. As you become more comfortable with Refract and reactive programming, you will be able to take it all the way to write fully reactive React applications!
