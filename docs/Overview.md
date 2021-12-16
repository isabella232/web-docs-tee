---
title: Quick Start
sidebar_position: 1
hide_table_of_contents: true
---

:::info The following project has been funded by the [Web3 Foundation](https://web3.foundation/).

<img src="/img/web3grant.png" alt="drawing" width="300"/>

:::

---

This guide will take you from a clean board and a clean computer to having a board with the image and being able to connect the substrate node to it.

## Substrate Node

We start with compiling the substrate node first, since it takes a while aswell, and we can do it beforehand easily:

1. Clone [our substrate fork](https://github.com/Zondax/substrate/tree/teekeystore) (`teekeystore` branch)

```bash
git clone -b teekeystore https://github.com/Zondax/substrate
```

2. Navigate inside the clone and start building

```bash
cd substrate
cargo buid --release
```

## Board images

Now that we are compiling the substrate node in the background, we can move onto the images (which will also take long to build!)

### Obtaining image

First we need to [get the images](./technical/BSP/intro):

```bash
git clone https://github.com/Zondax/tee-images
```

Then we need to fetch and prepares the manifest, so we combine all the [yocto layers](./technical/framework/teeimages) together:

```bash
cd tee-images
make manifest
```

:::note

If you have already fetched the manifest then you need to add `force` to the command:

```bash
make manifest force
```

:::

### Building image

The next step is to actually start [building the images](./technical/BSP/BSP).

We offer many build options in our images but the ones that we [support](./technical/HardwareSelection) completely are 4:

-   `dk2`, for [STM32MP157F-DK2](https://www.st.com/en/evaluation-tools/stm32mp157f-dk2.html)
-   `imx8mm-evk`, for [MCiMX8-evbk](https://www.compulab.com/products/sbcs/sbc-imx8m-mini-nxp-i-mx8m-mini-single-board-computer/#specs)
-   `qemu` for ARMv7
-   `qemu8` for ARMv8

To start building, we can use a simple make command

```bash
make build $image
```

where `$image` is the image name we are interested in building from the list above.

:::tip

See you in ~2 hours, depending on the power of your machine

:::

## Flashing SDCard

After we are done building our image(s) we can [flash the micro SDcard](./technical/BSP/flashing) with it.

The recommneded and easiest way is to use [balena etcher](https://github.com/balena-io/etcher/releases/tag/v1.7.0).

Select the image built, which can be found at `tee-images/shared/images/$image`, and just flash.

## Hardware Setup

Each board requires a bit different setup, like connecting what cable to where, but the objective is the same: powering on the device and connecting to the serial port to inspect the output on the tty and verify the service is running.

Please refer to the specific hardware setup page for [`dk2`](./technical/HardwareSetup/HW_STM32MP157F-DK2) and [`imx8mm-evk`](./technical/HardwareSetup/HW_8MMINILPD4-EVKB).
