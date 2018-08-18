# Getting Started

The usage section of the docs explores the intended use of Refract, focusing on each concept or feature in isolation.

If you are unfamiliar with reactive programming, we recommend reading Andre Staltz's article [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) before reading these docs. Reactive programming is central to Refract, so some understanding of the paradigm will be essential.

---

Before we begin, below is a quick explanation of some new terms associated with Refract which we will use throughout the documentation.

Each will be more thoroughly explored through examples, but starting with a rough approximation in mind will help.

## Aperture

An `aperture` controls the streams of data which enter Refract.

It is a function which observes data sources within your app, passes this data through any necessary logic flows, and outputs a stream of `effect` values in response.

## Handler

A `handler` is a function which causes side-effects in response to any `effect` value output by the `aperture`.

## Error Handler

An `errorHandler` is a function which causes side-effects in response to any `error` value output by the `aperture`.
