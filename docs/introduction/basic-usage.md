# Basic usage

Refract is very basic itself: it is a toolbox designed to enable complex cases. Its power is in your hands and this section is designed to show you how to make the most of it. We are now going through the two different parts composing Refract's logic:

- Your own function to map things you observe to effects
- Your custom effect handler


```
 Your App             Effect factory            Effect handler
                +                         +
                |                         |
                |  +----> Effect A +---+  |
                |  |                   |  |
Something  +------------> Effect B +-----------> Trigger A, B and C
 changes        |  |                   |  |
                |  +----> Effect C +---+  |
                |                         |
                +                         +
```

## Declaring effects

## Handling effects
