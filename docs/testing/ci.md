---
title: CI Tests 
sidebar_position: 5
---

Nowadays software development is more complicated than ever and it's important that software is tested and verified so that we can be sure it works as intended.

There are many ways to test software, and we decided to test every commit we make to guarantee that our changes do not cause tests to fail, and eventually catching breaking changes early in the development pipeline.

Unfortunately this project has some complex requirements that require certain environment to be setup before running or even compiling the application is possible.

As such we have prepared a set of tests (and framework) to be run by Github Actions on every commit. These tests are run and the reports collected by a [script].

## Setup

Due to the nature of the environment, the quickest way to create the test suite to be run in CI was to provide it as an alternative build mode for the (host) application.

Using such method, it's possible to execute the application normally and have it run the entire test suite, as written in the [`execute_tests`](https://github.com/Zondax/tee-substrate-service/blob/master/REE/lib/src/ci.rs#L13) function.

This is done by creating a connection to the service exposed by the application and then running all the tests.

:::note
To avoid usage of the "CI" build in production a "fake task" mechanism is adopted.

This implies "selecting" a never-ending task in the application scheduler in the case of a normal build, but in the "CI" build this task is instead the set of tests.

This leads to the application terminating once the tests have all executed, while otherwise just execute the server task.
:::

The Github Action manifest makes the runner build the application in "CI mode" to enable the tests before running them via the script.

## Sample test

In the following snippet you can see our custom test utility used to run our test suite.

```rust
Test::new(
        "generateNew 00",
        "generate new sr25519 keypair and return a public key; no seed",
        || {
            client
                .sr25519_generate_new()
                .map_err(|e| format!("failed to issue request: {:?}", e))?;
            Ok::<_, String>(())
        },
    )
    .exec();
```

This is a simple utility to reduce boilerplate related to scheduling in the application scheduler or [printing test reports](#reports).

## Reports

Due to the nature of how we run these tests, we are not able to run these tests directly.

This in turn translates on printing test reports to the console and then later interpreting them to collect the results. 

A [script] has been devised to serve the purpose of doing setup tasks, running the application and finally collecting reports and presenting a summary

## Script Overview

The [script] will first start the qemu virtual machine (via `make run`), then setup a netcat listeners on the ports exposed by the machine for both the logging interfaces, capturing their output.

After the tests have run it detects (via grep) the section of the logging output that contains the raw test reports created by the suite.

The region of the reports is delimited by `TESTS STARTING` and `TESTS FINISHED` output strings.

After that, the region is searched once again for successes and failures (marked by `SUCCESS` and `FAILURE` strings) and these results are counted.

If there's at least 1 failure the whole suite is considered failed and the script exits with an error, so that the Github Action can determine it was a failure.

[script]: https://github.com/Zondax/tee-base/blob/b034c42bfa4e3a00e7d3ee173ddac6a01b1a0803/scripts/run_ci_tests.sh
