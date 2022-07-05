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

We start with compiling the substrate node first, since it takes a while as well, and we can do it beforehand easily:

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

### Obtaining the build code 

First we need to [get the buildroot configs](./technical/BSP/intro):

```bash
git clone --recursive --branch master https://github.com/Zondax/buildroot-zondax/
```
```

Then we need to move to this directory which contains the scripts and
Make files used to build the images for the supported boards:

```bash
cd buildroot-zondax
```

### Building image

The next step is to actually start [building the images](./technical/BSP/BSP).

We offer many build options in our images but the ones that we [support](./technical/HardwareSelection) completely are 4:

-   `dk2`, for [STM32MP157F-DK2](https://www.st.com/en/evaluation-tools/stm32mp157f-dk2.html)
-   `imx8mmevk`, for [MCiMX8-evbk](https://www.compulab.com/products/sbcs/sbc-imx8m-mini-nxp-i-mx8m-mini-single-board-computer/#specs)
<!---   `qemu` for ARMv7-->
<!---   `qemu8` for ARMv8-->

Before starting building, You should generate required keys for each
board, those keys are use to enable secure-boot and optee
authentication. We have prepared some scripts under the `tools/` directory for each
board for this. For example, for the dk2, the process to generate all
the keys is as follows:
- First generate the *Optee* key that is used by both boards:
```bash
./tools/optee/gen_keys.sh
```
- Then generate the keys for the dk2 board 
```bash
./tools/dk2/generate_keys.sh
./tools/uboot/gen_keys.sh
```
For the imx board, the process is different, as the keys are generated
as part of its build process, because it rely on a third party tool.

Finally, after key generation we can start building using the command
bellow:
```bash
make $image
```

where `$image` is the image name we are interested in building from the list above.

:::tip

See you in ~2 hours, depending on the power of your machine

:::

## Flashing SDCard

After we are done building our image(s) we can [flash the micro SDcard](./technical/BSP/flashing) with it.

The recommended and easiest way is to use [balena etcher](https://github.com/balena-io/etcher/releases/tag/v1.7.0).

Select the image built, which can be found at `buildroot-st/output/images/` for the dk2 or `buildroot/output/images` for the imx8mmevk, and just flash.

## Hardware Setup

Each board requires a bit different setup, like connecting what cable to where, but the objective is the same: powering on the device and connecting to the serial port to inspect the output on the tty and verify the service is running.

Please refer to the specific hardware setup page for [`dk2`](./technical/HardwareSetup/HW_STM32MP157F-DK2) and [`imx8mm-evk`](./technical/HardwareSetup/HW_8MMINILPD4-EVKB).
