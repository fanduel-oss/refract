export declare const compose: Compose
export interface Compose {
    <R>(...fns: Function[]): (arg: any) => R
    <A, R>(f: (arg: A) => R): (arg: A) => R
    <A, B, R>(f: (arg: B) => R, g: (arg: A) => B): (arg: A) => R
    <A, B, C, R>(f: (arg: C) => R, g: (arg: B) => C, h: (arg: A) => B): (
        arg: A
    ) => R
    <A, B, C, D, R>(
        f: (arg: D) => R,
        g: (arg: C) => D,
        h: (arg: B) => C,
        i: (arg: A) => B
    ): (arg: A) => R
    <A, B, C, D, E, R>(
        f: (arg: E) => R,
        g: (arg: D) => E,
        h: (arg: C) => D,
        i: (arg: B) => C,
        j: (arg: A) => B
    ): (arg: A) => R
    <A, B, C, D, E, F, R>(
        f: (arg: F) => R,
        g: (arg: E) => F,
        h: (arg: D) => E,
        i: (arg: C) => D,
        j: (arg: B) => C,
        k: (arg: A) => B
    ): (arg: A) => R
    <A, B, C, D, E, F, G, R>(
        f: (arg: G) => R,
        g: (arg: F) => G,
        h: (arg: E) => F,
        i: (arg: D) => E,
        j: (arg: C) => D,
        k: (arg: B) => C,
        l: (arg: A) => B
    ): (arg: A) => R
    <A, B, C, D, E, F, G, H, R>(
        f: (arg: H) => R,
        g: (arg: G) => H,
        h: (arg: F) => G,
        i: (arg: E) => F,
        j: (arg: D) => E,
        k: (arg: C) => D,
        l: (arg: B) => C,
        m: (arg: A) => B
    ): (arg: A) => R
}
