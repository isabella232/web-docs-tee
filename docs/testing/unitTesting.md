---
title: Unit Tests
sidebar_position: 6
---

:::warning
**WHERE ARE THESE TESTS?**
:::

Despite the challenges posed by the particular requirements of the project, we value quality and verifiability of our work, so we adopted a unit testing scheme capable of easily and quickly verify that the functionality of the application is working as intended, by applying these tests to the core application logic.

Unit testing the surronding applications is unfeasible due to the requirements in building these, but we have devised a set of [CI Integration Tests](ci.md) that complement this coverage.

## Prerequisites

- Install rust (this includes cargo)
- Install `build essentials` or a similar package that include `make`

## Run

Open a new terminal and navigate to the cloned repository, then:

```bash
make unit_tests
```

This will take care of navigating to the appropriate folder and run the unit tests for the application
