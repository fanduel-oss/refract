const identity = arg => arg

export const compose: Compose = (...fns) => {
    if (fns.length === 0) {
        return identity
    }

    if (fns.length === 1) {
        return fns[0]
    }

    return arg =>
        fns.reduceRight((previousResult, fn) => fn(previousResult), arg)
}

export interface Compose {
    <Result>(...fns: Function[]): (arg: any) => Result
    <A, Result>(f: (arg: A) => Result): (arg: A) => Result
    <A, B, Result>(f: (arg: B) => Result, g: (arg: A) => B): (arg: A) => Result
    <A, B, C, Result>(
        f: (arg: C) => Result,
        g: (arg: B) => C,
        h: (arg: A) => B
    ): (arg: A) => Result
    <A, B, C, D, Result>(
        f: (arg: D) => Result,
        g: (arg: C) => D,
        h: (arg: B) => C,
        i: (arg: A) => B
    ): (arg: A) => Result
    <A, B, C, D, E, Result>(
        f: (arg: E) => Result,
        g: (arg: D) => E,
        h: (arg: C) => D,
        i: (arg: B) => C,
        j: (arg: A) => B
    ): (arg: A) => Result
    <A, B, C, D, E, F, Result>(
        f: (arg: F) => Result,
        g: (arg: E) => F,
        h: (arg: D) => E,
        i: (arg: C) => D,
        j: (arg: B) => C,
        k: (arg: A) => B
    ): (arg: A) => Result
    <A, B, C, D, E, F, G, Result>(
        f: (arg: G) => Result,
        g: (arg: F) => G,
        h: (arg: E) => F,
        i: (arg: D) => E,
        j: (arg: C) => D,
        k: (arg: B) => C,
        l: (arg: A) => B
    ): (arg: A) => Result
    <A, B, C, D, E, F, G, H, Result>(
        f: (arg: H) => Result,
        g: (arg: G) => H,
        h: (arg: F) => G,
        i: (arg: E) => F,
        j: (arg: D) => E,
        k: (arg: C) => D,
        l: (arg: B) => C,
        m: (arg: A) => B
    ): (arg: A) => Result
}
