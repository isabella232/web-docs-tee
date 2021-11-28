---
title: OLD M1
sidebar_position: 5
---

## Research and Prototyping

### Overview

During this milestone research and prototyping was the main focus. Following the original plan, we concentrated on:

- Reference boards selection and feasibility.
- Operating system and other critical components
- Define applicable toolchains ( Rust, C/C++, etc.) and provide a "hello world" example involving Rust and OPTEE
- Development process: Define CI and Testing strategy.

From an architectural overview, we considered the following aspects:

- Hardware
- BSP and Operating System
- Trusted App (TA) and Host App (Signer Endpoint)
- Node Endpoint
- Other artifacts
  - Provisioning process and documentation
  - Image signing tool
  - Documentation

### Testing guide

<!--We invite you to follow the [tutorial/testing guide](../testing/intro).-->

:::warning
The testing guide will be updated and adjusted as we make progress.
:::

## Deliverables

### 1. Hardware selection

:::tip Milestone requirement
Select two hardware platforms (from different providers) to use as a proof-of-concept.
:::

Our decision for M1 is to start development on the following boards. We have mainly prioritized technical support, supply chain, form factor, ethernet availability, latest generation MPU and community.

| Model           | MPU         | Manufacturer        |                                       |
| --------------- | ----------- | ------------------- | ------------------------------------- |
| STM32MP157C-DK2 | STM32MP157C | ST Microelectronics | ![](/img/STM32MP157C-DK2_angle2.jpg) |
| NXP MCiMX8-evkb | i.MX8       | NXP                 | ![](/img/imx8m.png)                  |

We plan to extend support to the following devices in the following weeks

| Model                    | MPU         | Manufacturer | Reason for delay                                             |
| ------------------------ | ----------- | ------------ | ------------------------------------------------------------ |
| Compulab SBC-iMX8M-Mini  | i.MX8       | Compulab     | OPTEE regression test fails. Being diagnosed by Compulab |
| TechNexion PICO-PI-IMX8M | i.MX8       | TechNexion   | Zondax is currently testing for compatibility                |
| Verdin iMX8M             | i.MX8       | Toradex      | Device is still not available in the market                  |
| byteDEVKIT               | STM32MP157C | BytesAtWork  | Issues at boot. Discussing with manufacturer at this moment  |

It is unlikely that we will add support for the following devices:

| Model                   | MPU   | Manufacturer | Reason for delay                                          |
| ----------------------- | ----- | ------------ | --------------------------------------------------------- |
| USB Armory Mk-II        | i.MX6 | F-secure     | Inadequate form factor. Lack of ethernet port, etc.       |
| Advantech WISE-710      | i.MX6 | Advantech    | BSP and support was very low quality                      |
| Phytec phyBOARD-Segin   | i.MX6 | Phytec       | OPTEE is not supported by the manufacturer                |
| Phytec phyBOARD-Polaris | i.MX8 | Phytec       | OPTEE is not supported by the manufacturer                |
| Apalis iMX8 QuadMax     | i.MX8 | Toradex      | OPTEE Support issues. Being discussed with NXP & Toradex  |

Nevertheless, our implementation will be easy to port to other platforms. We expect the list of supported devices to grow over time.

We provide more details in the following links:

- [Supported Hardware](http://localhost:8081/zondbox-docs/Overview.html#hardware)
- [Selection work](http://localhost:8081/zondbox-docs/HardwareSelection.html)

### 2. Feasibility

:::tip Milestone requirement
Minimal implementations for each selected board to demonstrate feasibility.
:::

We provide instructions for the [supported platforms here](https://zondax.github.io/zondbox-docs/Overview.html). You will be able to find:

- How to setup the hardware for a testing and development environment.
- How to build an image and load it using an SD card
- How to boot and test "hello_rustee"
  - Hello_Rustee is an OPTEE-based implementation including both trusted and host apps.
  - This is described in the next section.

The following repositories contain the implementation for different components / layers:

| Component / layer                                             | Link / Repository                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| Yocto images (build environment, container, CI and manifests) | [GitHub](https://github.com/Zondax/zondbox-images)            |
| Yocto metalayer with specific image customization             | [GitHub](https://github.com/Zondax/meta-zondax)               |
| Build container (build environment, toolchains, qemu)         | [GitHub](https://github.com/Zondax/docker-builder)            |
| HelloRustee - Rust + OPTEE example                            | [GitHub](https://github.com/Zondax/hello-rustee/)             |
| Documentation website (frequently being updated)              | [GitHub](https://zondax.github.io/zondbox-docs/Overview.html) |
| Documentation Source code                                     | [GitHub](https://github.com/Zondax/zondbox-docs)              |

#### Secure Boot

While we have already significantly simplified most of the development and testing process, there are still some aspects that are specific to each of the boards.
In particular, as explained [here](https://zondax.github.io/zondbox-docs/SecureBoot.html#stm32mp157c-devices), secure booting still requires manual steps.

For the time being, we recommend W3F to review the documentation but avoid executing the steps. Mistakes may result in irreversible changes to the boards (one time programming (OTP) fuses).
In milestone 2, we will deliver better tooling to simplify this process.

### 3. Hello World + Development process

:::tip Milestone requirement

- Hello-World examples and basic configuration to demonstrate Secure Boot and TrustZone usage.
:::

The current Yocto images contain "hello_rustee" [GitHub](https://github.com/Zondax/hello-rustee/), an example to demonstrate:

- A Trusted Application
- A Host application
- How hello_rustee is supported in a wide range of devices
- How we can deploy a fully working app and TA in our custom Yocto image.

The corresponding instructions are available in the [testing guide](https://zondax.github.io/zondbox-docs/Overview.html#hello-rustee)

:::tip Milestone requirement

- Detailed description of the development and testing process.

- Corresponding unit and integration tests

:::

Not only, we show how to deploy an example OPTEE TA, but also we have created a set of tools to facilitate the typical development workflow, i.e.:

- compilation
- emulation (QEMU) and,
- testing (unit / integration / CI)

In this [section and code example](https://zondax.github.io/zondbox-docs/Overview.html#hello-rustee), we demonstrate and explain:

- How to launch hello_rustee in QEMU
- How to use Rust in combination with OPTEE
- How to use no_std Rust in the trusted application
- How to run unit tests
- How to run integration tests

The complete source for RusTee can be found [here](https://github.com/Zondax/hello-rustee/).
