---
title: Overview
sidebar_position: 1
---

# Quick Overview

:::info The following project has been funded by the [Web3 Foundation](https://web3.foundation/).

<img src="/img/web3grant.png" alt="drawing" width="300"/>
:::

This project provides a _hardware + software stack_ targeting blockchain applications such as PoS validation, remote signers, etc.

From an architectural overview, we cover the following aspects:

- Hardware alternatives
- BSP and Operating System
- Trusted apps (TAs) and Host Apps
- Signer Endpoint
- Node Endpoint

## Supported Hardware

At the moment of this writing, we recommend testing using the following boards:

| Model           | MPU         | Manufacturer        |                                   |
| --------------- | ----------- | ------------------- | --------------------------------- |
| STM32MP157C-DK2 | STM32MP157C | ST Microelectronics | [Mouser][1] [Digikey][2] [ST][3]  |
| NXP MCiMX8-evkb | i.MX8       | NXP                 | [Mouser][4] [Digikey][5] [NXP][6] |

[1]: https://www.mouser.ch/ProductDetail/STMicroelectronics/STM32MP157C-DK2?qs=9r4v7xj2LnnSrQDGcA2diw==
[2]: https://www.digikey.ch/products/en?keywords=MCIMX8M-EVKB
[3]: https://www.st.com/en/evaluation-tools/stm32mp157c-dk2.html#sample-and-buy
[4]: https://www.nxp.com/part/MCIMX8M-EVKB#/
[5]: https://www.mouser.ch/ProductDetail/NXP-Semiconductors/MCIMX8M-EVKB?qs=%2Fha2pyFaduhMHVqoUq4oRfF9hEn3wIuiNQ14GBmEQkNua8L5aW7Edg%3D%3D
[6]: https://www.digikey.ch/products/en?keywords=STM32MP157C-DK2

:::tip If you have one of these boards
Click [here to start connecting your hardware](HardwareSetup.md)
:::

_Note: We plan to expand this list in the near future_

Click here if you are interested in the [selection process and a list of future supported devices](HardwareSelection.md).

## Building an SD card image

These tests will concentrate on SD Card images, however, some of the boards support eMMC and/or SATA drives. We will add support for this in the next milestone.

### Preconditions

We assume you are using Ubuntu. Other OSs (MacOS/Windows) are not formally supported.

- Install [Docker CE](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

- Build or pull the container with our build environment (source code at [GitHub](https://github.com/Zondax/docker-builder))
    - `make pull_docker` to retrieve the latest published container image
    - `make build_docker` to build the container image

### Creating the image

:::tip
Building an image can take significant time. For the next milestone, we are working on:
- Minimal images (< 10 MB)
- A distributed build setup (scheduler, builder, clients) based on sccache
  :::

- Depending on the device your are targetting, run one of the following commands:

  | Model                   | Command                            | Support          |
    | ----------------------- | ---------------------------------- | ---------------- |
  | STM32MP157C-DK2         | `make build_image_dk2`             | Full             |
  | NXP MCIMX8M-EVKB        | `make build_image_imx8mq`          | Full             |
  | Compulab SBC-iMX8M-Mini | `make build_image_imx8mq-compulab` | Work in progress |
  | BytesAtWork STM32MP157C | `make build_image_bytesatwork`     | Work in progress |
  | Toradex Apalis i.MX8QM  | `make build_image_apalis`          | Work in progress |

- On completion, images should be available at `shared\images`
- Download [Balena Etcher](https://www.balena.io/etcher), install and execute
- Select the image you want to flash, insert/select the SD card and click
  Flash.
- Now put the SD card in your device, reboot and enjoy

:::tip
We provide more detailed information [here](BSP_Build.md) in case you want to understand what is actually going on in our scripts. Still, this is in active development and expect this detailed instructions to change in the near future.
:::

### Signing the image

:::warning
Enabling secure boot in a device is an irreversible process. We recommend skipping this step for now.

At the moment, we can demonstrate the functionality but simplified tools are part of the next milestone.

Please refer to [Secure Boot](SecureBoot-iMX8M.md) for a description of these manual steps in you still decide to go ahead.
:::

## Hello RusTee

### Overview

Now is time to test a very simple Trusted Application (TA)!

[Hello RusTee](HelloRustee.md) demonstrates how we can run both a host and trusted apps using OPTEE and Rust in these devices.

A Trusted application runs in a TEE (trusted execution environment) that is isolated from the normal REE (Rich execution environment) where the normal OS is running. To talk to a TA, you need a host application (HA) that executes in the non-secure world (REE = Rich execution environment).

In this section, we demonstrate a _"hello world"_ (`hello_rustee`) implementation of a TA and HA using Rust. In practice, the HA will expose the TA signing service to the network.

When an image is built, we already include `hello_rustee` so you just need to login into your device to test OPTEE.

:::tip How does the actual development process looks like?
If you are interested, more information about the process, tooling and testing can be found [here](HelloRustee.md)
:::

### Running

- First, let's connect to the board using a serial connection

```bash
minicom -D /dev/ttyACM0
```

:::tip Attention

- In some systems, you may not have permission to access the serial port. Try using `sudo` if the previous command fails.
- The serial port may vary depending on your OS, machine, etc. Possible alternatives are:

    - /dev/ttyACM0
    - /dev/ttyUSB0
    - /dev/ttyUSB1
    - /dev/ttyUSB2
    - /dev/ttyUSB3
      :::

- Reset the device (some devices have a reset button, otherwise unplug and plug again). You should be able to see in the console how you device is booting.

- The host application `hello_rustee` is preinstalled in the image you build earlier.

Run the host application:

```bash
./hello_rustee
```

- The host application will connect to the TA (trusted application) and exchange data. You should be able to see something similar to:

```bash
[RUSTEE] <= 12345
[RUSTEE] => 12387
```

## Summary

Along these steps, we have shown how:

- To build fully working images for a range of devices (based both on STM32MP175C and i.MX8).
- The secure boot process is documented and clear for the different supported devices.
- We can effectively combine Rust and OPTEE to build trusted applications in different device types.
- We can deploy both HA and TA app to the images and communicate between them.
