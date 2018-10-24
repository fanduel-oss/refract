# Introduction

Thanks for considering making a contribution to Refract! We want to make contributing as easy and transparent as possible, no matter how you wish to add to the project. By contributing, you agree to abide by our [code of conduct](./CODE_OF_CONDUCT.md).

# Reporting Issues & Asking Questions

Before opening an issue, please search the issue tracker to make sure your issue hasn't already been reported.

### Bugs and Improvements

We use GitHub Issues to track bugs and improvements to Refract, its examples, and the documentation. We encourage you to open issues to discuss improvements, architecture, theory, internal implementation, etc. If a topic has been discussed before, we will ask you to join the previous discussion.

Write proposals and bug reports with as much detail as possible - the more informative the starting point, the clearer and more useful the discussion will be.

For example, a good bug report includes as much detail as possible:

*   A quick summary and/or background.
*   Steps to reproduce - with sample code wherever possible.
*   What you expected to happen.
*   What actually happened.
*   Notes - for example why you think this might be happening, or solutions you tried which didn't work.

### Getting Help

For support or usage questions such as “how do I do X with Refract” or “my code doesn't work”, please search and ask on StackOverflow first.

Some questions may take a long time to get an answer. If your question gets closed or you don't get a reply on StackOverflow after waiting a few days, we encourage you to join [our Discord channel](https://discord.gg/fqk86GH), and respectfully bring people's attention to your question.

It is a good idea to structure your code and question in a way that is easy to understand. For example, we encourage you to use syntax highlighting, indentation, and split text into paragraphs. Consider providing a minimal example which reproduces your issue - we recommend [CodeSandbox.io](https://codesandbox.io/) or similar for demonstrating issues in a format which is easy to debug.

Please keep in mind that people spend their free time trying to help you!

# Contributing

If you don't have a specific contribution in mind, take a look at the issue tracker to find a list of open issues which need attention.

### Code

For non-trivial changes, please open an issue with a proposal for a new feature or refactoring before starting on the work. We don't want you to waste your efforts on a pull request that we might not want to accept.

However, sometimes the best way to start a conversation is to send a pull request which demonstrates your idea.

Use your judgement to decide the best approach!

In general, the contribution workflow looks like this:

1.  Open a new issue in the Issue tracker, and discuss with others.
1.  Fork the repo and create a new branch based off master.
1.  Write your code, committing regularly to your feature branch with clear commit messages.
1.  If you've added code that should be tested, add tests.
1.  If you've changed APIs, update the documentation.
1.  Ensure the test suite passes and that there are no linting errors.
1.  Submit a pull request, referencing any issues it addresses!
1.  Once code has been reviewed and given tentative approval, copy into the various packages for final approval.

Please try to keep your pull request focused in scope and avoid including unrelated commits!

After you have submitted your pull request, we'll try to get back to you as soon as possible. We may suggest some changes or improvements.

Refract provides multiple packages to provide first-class support for multiple reactive programming libraries and component libraries. We use a monorepo for all packages but we don't follow a traditional approach usually found with Lerna or Bolt: instead we treat packages as a build target.

*   After cloning, the repo should initialise itself after you've installed dependencies.
*   You'll find all editable code in the `base` directory.
*   Tests run against packages (files are copied across before tests run). But you can manually copy them by running `yarn copy` (or `npm run copy`).

### Documentation

Improvements to the documentation are always welcome. Docs go through the same review process as code, and are held to a similarly high standard.

### Examples

Refract comes with official examples to demonstrate various concepts and best practices. When adding a new example, please adhere to the style and format of the existing examples, and try to reuse as much code as possible.

Thank you for contributing!
Name: "Vineetha VG"  
   Place: "Kerala,India"  
   Github: [vineethaaa](https://github.com/vineethaaa)  
    
