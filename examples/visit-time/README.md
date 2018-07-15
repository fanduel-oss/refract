# 🏠 [Home](../../) / [Examples](../) / Visit Time

## Visit time

This examples renders a stopwatch counting the time a user spends on a page while being online.

#### Aperture

Two sources observed:

*   The visibility status of the page (See [page visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
*   The online status of the navigator (See [online and offline events](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/Online_and_offline_events)

Every time the page becomes visible and online, the stopwatch resumes. If the page becomes either offline or hidden, the stopwatch pauses.

#### Handler

The Refract `handler` handles `pause`, `resume` and `tick` effects to track the total time spent on the page and set it in state. It handles `Date.now()` impure calls.

#### Result

The end result is a stopwatch counting the number of milliseconds spent on the page when visible and online. To play with it you can:

*   switch between tabs, and you'll notice the counter hasn't moved while the example tab was hidden
*   toggle your navigator online status (can be done via devtools)

<!-- prettier-ignore-start -->
| callbag | most | RxJS | xstream |
| --- | --- | --- | --- |
| [`code`](./callbag) [`live`](https://codesandbox.io/s/github/troch/refract/tree/master/examples/visit-time/callbag) | [`code`](./most) [`live`](https://codesandbox.io/s/github/troch/refract/tree/master/examples/visit-time/most)  | [`code`](./rxjs) [`live`](https://codesandbox.io/s/github/troch/refract/tree/master/examples/visit-time/rxjs)  | [`code`](./xstream) [`live`](https://codesandbox.io/s/github/troch/refract/tree/master/examples/visit-time/xstream)  |
<!-- prettier-ignore-end -->
