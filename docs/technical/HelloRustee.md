# Hello RusTee

A Trusted application runs in a TEE (trusted execution environment) that is isolated from the normal REE (Rich execution environment) where the normal OS is running. To talk to a TA, you need a host application (HA) that executes in the non-secure world (REE = Rich execution environment).

[Hello RusTee](HelloRustee.md) demonstrates how we can run both a host and trusted apps using OPTEE and Rust in these devices. In order to simplify trusted app development we have created a set of tools to facilitate not only compilation but also emulation (QEMU) and testing. We will use this example app to describe this too.

## Building

### Preconditions

- We assume you are using Ubuntu. Other OSs (MacOS/Windows) are not formally supported.
- Install Docker [Link](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

### Overview

There are different ways in which HelloRustee can be built:

- Local host (i.e. x64): in order to run unit tests, etc.
- Yocto Layer: When a system image is created, Yocto will build the package and deploy to the image
- QEMU ARMv7: Compiled to run in QEMU ARMv7
- QEMU ARMv8: Compiled to run in QEMU ARMv7
- BitBake: Build a binary that can be deployed to a board via SSH/SCP

In this document, we will concentrate on QEMU builds. This means that we will be able to crosscompile and run the binaries inside a local emulator.

### Building for QEMU

Docker containers that have been configured with all the necessary tools, compilers, etc. For this reason, in order to build, you just need to run:

```bash
make build_v7
```
or 
```bash
make build_v8
```

::: warning

- The first time may take some time to download the development containers and launch qemu.

- If you build for ARMv7 and immediately you build again for ARMv8, it is possible that your find compilation issues. Run `make clean` everything to change architectures.
:::

## Testing

### Unit tests

Running unit tests is relatively simple (will use as a target your default architecture):

```bash
make test_unit
```

### Emulation/Integration tests

First, you need to launch the emulator:

```bash
make qemu_v7
```

After some compilation, QEMU should start and you should see two windows opening:

- Secure World: Logging from the Trusted Execution Environment
- Non-Secure World: A standard console

![x](/img/qemu.png)

In the window on the right, you can also see that Rustee executed correctly:

```
QEMU Entrypoint script
----------------------

Copying TAs...
/mnt/ta/8d22f026-eb0a-4401-b575-5cf59327119b.ta

------------------------ LAUNCHING HOST -------------------------------

[RUSTEE] <= 12345
[RUSTEE] => 12387
/ # 
```

Try doing:

```bash
ls /mnt
```

and you will see that the directory where you keep your source code has been mounted there:

``` bash
/mnt # ls -l
total 28
-rw-r--r--    1 tee      tee            454 Mar 21 02:19 Cargo.lock
-rw-r--r--    1 tee      tee           1429 Mar 25 00:21 Makefile
drwxr-xr-x    2 tee      tee           4096 Mar 25 00:28 host
drwxr-xr-x    6 tee      tee           4096 Mar 25 00:28 rust
drwxr-xr-x    2 tee      tee           4096 Mar 25 00:42 scripts
drwxr-xr-x    3 tee      tee           4096 Mar 25 00:28 ta
drwxr-xr-x    5 tee      tee           4096 Mar 25 00:14 target
```

the advantage is that you can now,:

- Continue developing in your host
- Build in your host using `make build_v7`
- Run in QEMU using `/mnt/scripts/run_app.sh`

::: tip Why run_app.sh?
When you build again, before running the host app, you need to install the TA.

TAs are binaries in the form {UUID}.ta that need to be placed at `/lib/optee_armtz/`
:::

::: tip How to exit the emulator?
In order to exit the emulator, you can type `q` in the terminal you used to launch qemu:
```
QEMU 3.0.93 monitor - type 'help' for more information
(qemu) q
make[1]: Leaving directory '/home/zondax/optee/build'

```
:::

### CircleCI

We have also included an example of a circleci configuration:

```toml
version: 2.0

jobs:
  build:
    docker:
      - image: zondax/builder-qemuv7
    steps:
      - checkout
      - run: . $HOME/.cargo/env && cd src && QEMU_V7=1 make

  build_armv8:
    docker:
      - image: zondax/builder-qemuv8
    steps:
      - checkout
      - run: . $HOME/.cargo/env && cd src && QEMU_v8=1 make

workflows:
  version: 2
  build_all:
    jobs:
      - build
      - build_armv8
```

In the next release, we will include qemu-based testing directly in the device.

## Code structure

The example can be divided in two main components:

- Trusted Application (TA): runs inside a Trusted Execution Environment (TEE)
  - It is identified by a UUID
  - It is isolated from the OS and has access to certain peripherals that the normal OS cannot access (i.e. cryptographic co-processor, etc. )
  - We limit TA to no_std code.
- Host Application (HA): runs in the standard OS
  - It can access network, filesystem, etc.

Most of the implementation is Rust-based, however, we have some minimal bootstrapping C code that starts the Rust app that is being exposed as a library. As we make progress, we will reduce even further any remaining C code.

The typical project structure looks like this (some files have been removed for the sake of clarity)

```
.
├── .circleci
│   └── config.yml
├── .gitignore
├── Makefile
├── src
│   ├── .cargo
│   │   └── config                      << we defined special targets for ARM CPUs
│   ├── Cargo.toml
|   |
|   | ############## This block contains the host lib and a small C bootstrap
|   |
│   ├── host
│   │   ├── appmain.c
│   │   ├── appmain.h
│   │   ├── main.c                      << HA bootstraping (this will be moved to Rust soon)
│   │   └── Makefile
│   ├── host_rs
│   │   ├── Cargo.toml
│   │   ├── include
│   │   │   └── librustee_host.h
│   │   └── src
│   │       └── lib.rs                  << HA exposed as a library
│   ├── Makefile
│   ├── rust
│   │   └── .cargo
│   │       ├── .package-cache
│   ├── scripts
│   │   ├── fstab
│   │   ├── inittab
│   │   ├── launch_qemu.sh
│   │   ├── qemu_entrypoint.sh
│   │   └── run_app.sh
|   |
|   | ############## This block contains the TA lib and a small C bootstrap
|   |
│   ├── ta
│   │   ├── include
│   │   │   ├── rustee_ta.h
│   │   │   ├── uuid.h                  << TA identity as a UUID
│   │   │   └── uuid.mk
│   │   ├── Makefile
│   │   ├── newuuid.py                  << script to generate a new UUID and header file
│   │   ├── rustee_ta.c                 << TA entrypoint (this will be moved to Rust soon)
│   │   ├── sub.mk
│   │   └── user_ta_header_defines.h    << TA configuration and parameters
│   └── ta_rs
│       ├── Cargo.toml
│       ├── include
│       │   └── librustee_ta.h
│       └── src
│           └── lib.rs                  << TA exposed as a library
└── .vscode
```
