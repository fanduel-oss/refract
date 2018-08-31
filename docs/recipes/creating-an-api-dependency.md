# Creating an API Dependency

The recommended approach to injecting dependencies into your apertures and handlers has been explored elsewhere - both in the [usage section](../usage/injecting-dependencies.md) and in a [dependency injection](./dependency-injection.md) recipe - but an important question has not been covered: what does a dependency look like?

While each app likely has a small number of obvious dependencies which would clearly be useful inside Refract - such as your router or your Redux store - there are other dependencies which would benefit from the same approach.

This recipe explores one of the typical dependencies you might find yourself building: and API dependency.

## Life Without an API Dependency

If we build an app without a centralised API dependency, we will eventually encounter a number of problems.

#### Repetition

Any time we wish to fetch data from an external source, there's some boilerplate we will need to include:

```js
fetch(`https://api.github.com/users/${username}`)
    .then(response => response.json())
    .catch(error => console.error(error))
```

When using fetch inside an aperture, there's actually a little extra boilerplate needed, and even worse it makes our aperture impure:

```js
const aperture = () => component =>
    component.observe('username').pipe(
        mergeMap(username =>
            fromPromise(
                fetch(`https://api.github.com/users/${username}`)
                    .then(response => response.json())
                    .catch(error => ({ error }))
            )
        )
    )
```

The error catching logic is also problematic. If we take the approach shown above, we need to handle the different types of data being emitted inside one stream.

Alternatively, we could introduce even more boilerplate and handle errors directly in the stream:

```js
const aperture = () => component =>
    component
        .observe('username')
        .pipe(
            mergeMap(username =>
                fromPromise(
                    fetch(`https://api.github.com/users/${username}`).then(
                        response => response.json()
                    )
                )
            ),
            catchError(error => of({ type: RECEIVE_ERROR, error }))
        )
```

Neither feels like a clean solution: it's still a lot of overhead for a simple API request.

#### Flexibility

This approach makes the code harder to change. What if we want to migrate to a new version of the API, or add an extra header to the request, or add some common data transformation to a specific endpoint? We would have to trawl through our app, find every API request, and consider the context of each request to make sure we're refactoring correctly.

#### Testability

Calling fetch inside our aperture makes our aperture impure, and we would have to use something like Jest's module mocking system to test it.

#### Request Cancellation

Depending on how we use the imperative fetch requests, we might not be able to cancel any in-flight requests.

## The Solution

So what's the alternative?

The end goal is a dependency which can be added to our app much like a Redux store: a JavaScript object containing methods which we can call, isolating the impure code and wrapping it into a format which we can easily mock in tests.

```js
const apiDependency = {
    getUser: username =>
        fromPromise(
            fetch(`https://api.github.com/users/${username}`)
                .then(response => response.json())
                .catch(error => ({ error }))
        )
}

ReactDOM.render(<App api={apiDependency} />)
```

This dependency could then be exposed to Refract, allowing it to be called inside the apertures like so:

```js
const aperture = ({ api }) => component =>
    component
        .observe('username')
        .pipe(mergeMap(username => api.getUser(username)))
```

This is a much cleaner separation of concerns, allowing us to declaratively call our API endpoints, without caring about the implementation details, and without unnecessary repetition.

When refactoring the API, all the code is in one place, and we no longer have to consider the context in which it is called. When testing, we can easily create a mock dependency, and our apertures remain pure.

## Considerations

#### Using Your API Dependency Outside Refract

If you handle all of your app's side-effects via Refract, you have the opportunity to build your API dependency with this in mind.

By using primitives from your streaming library as building blocks, you can simplify features such as request cancellation, retry on error, or complex data transformations. Encapsulating your API into a single dependency lets you consider it in isolation, and makes your code clearer and more consistent.

However, using Refract for everything might not be your goal - or you might need to migrate an existing app over time. In those cases, a centralised dependency would still provide some of those benefits.

The main difference in approach is that you would likely return raw promises instead of streams, so that they can be easily used outside Refract. You would still gain from the testability and consistency, and make it easier to refactor in future.

#### Runtime Configuration

Another significant advantage to this approach is that it can simplify runtime API configuration. For example, if you need to pass some data along with every request, you can achieve this by instantiating your api dependency inside a callack function:

```js
const createApiDependency = ({ apiUrl, client }) => {
    const apiHeaders = {
        Authorization: client.authorization
    }

    const request = axios.create({
        baseUrl: apiUrl,
        headers: apiHeaders
    })

    return {
        getUser: username =>
            fromPromise(
                request(`https://api.github.com/users/${username}`)
                    .then(response => response.json())
                    .catch(error => ({ error }))
            )
    }
}
```

More complex configuration is also made possible via this separation of the API into its own isolated module.
