# Thinking In Refract

Refract differs from the typical mental model used for React applications. It requires to adapt your mental model to:

- think in reactive programming
- systematically think through effects

Thinking reactive will help you think through effects and _vice versa_. This change of paradigm requires time and Refract can be adopted gradually: you can initially use it where most obvious, and discover over time more and more use cases.


## Thinking reactive

Reactive programming is reknown for being challenging to learn. It requires a different mental model and the vast majority of us has been wired to think our code imperatively.

Reactive programming isn't more complicated than the rest, but it requires time for your brain to slowly transition to this paradigm. There are more and more resources available online to learn reactive programming, but we recommend [The introduction to Reactive Programming you've been missing
](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754).

If you are new to reactive programming or don't have a library of choice yet, we recommend you look at the different libraries we offer bindings for (RxJS, xstream, Most, callbag) and choose the one you are most confortable with.


## Thinking through effects

Being able to systematically think through effects also requires a change in how you conceive what happens in your application. Mainly, it requires you to think about state transitions rather than state.

Instead of thinking _"While x is going on, y should be in that state"_, you need to think _"When x happens, y should transition to that state"_. Let's put this into perspective with a simple example: a registration form. Your form needs to contain the following elements:

- An username field which needs to make sure the chosen value isn't already taken.
- A submit button which sends a request to an API. While the request is being processed, the form should not be editable.

When not thinking through effects, we would make the following statements:
- When a user type characters in the username field, network requests need to be performed to validate the chosen username, while the submitted button is disabled.
- When a user clicks on the submit button, the username value should be posted to the API, while both the submitted button and username field are disabled.

Thinking through effects requires to isolate each action or event from their resulting effect:
- On each new character typed in the username field, the form status should transition to 'validating'
- When the form status transition to 'validating', the submit button should be disabled
- When the form status transition to 'validating', a network request should be made to the API for validating the chosen username
- When a request to validate the chosen username is sent any previous request should be cancelled
- When the username validation response is received, the form validation status should be updated
- When the submit button is clicked, the form status should transition to 'readyt'
- When the form status transition to 'ready', the form should be disabled
- When the form status transition to 'ready', a create user request should be sent to the API
- When a successful create user request is received from the API, the app should navigate away
- When a non successful create user request is received from the API, the form should be enabled AND an error message should be displayed

Thinking through effects actually allows you to decompose any problem in small and discrete pieces.
