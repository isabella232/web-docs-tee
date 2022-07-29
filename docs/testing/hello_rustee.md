---
title: Hello world demo application
sidebar_position: 3
---

The [hello-rustee](../technical/40.Development/41.HelloRustee.md) application is a hello world program that we use to
check that the optee framework built by buildroot works as expected. This
demo application is also intended for development purposes due to
its simplicity while having the same hierarchical structure as our main application
(the tee-substrate-service).
:::note
It is preferable to run the [xtests](./xtests.md) before running this
hello world application.
:::

There are different ways to execute it:

- Using qemu either version 7 or 8.
- Using the STM32MP157-DK2 device
- Using the 8MXMMINILPD4 device

In all of them the application output must be the same and look like:

```bash
[TEE] << been to trusted and back
[TEE] >> been to trusted and back
```

To run this application, the first step is to clone the [buildroot images](https://github.com/Zondax/buildroot-zondax) repository:

```bash
git clone https://github.com/Zondax/buildroot-zondax.git
cd buildroot-zondax
```

## Running using qemu/qemu8:

After you cloned the buildroot repository follow the steps indicated
[here](../technical/BSP/BSP) for either qemu or qemu8.
Once the steps there are done, execute the following commands that are
also listed in the development section, we repeat them here for
simplicity and to make the testing instructions clear:

### Start qemu and testing env

To start `qemu` environment, we first need to compile the app with the following commands:

```bash
./tools/optee/gen_keys.sh
make zondaxtee_qemu_defconfig
make
make start-qemu-host
```

Wait for boot and login with user `root` (no password is required).

:::tip
To exit and kill qemu, click `CTRL+a x`
:::

### Execute hello-rustee

This demo application is by default part of any image created using
buildroot-zondax. You can run it directly. After login in `qemu`, just run it as it were a command:

```bash
RUST_LOG=info hello-rustee
```

As you can see, we enable Rust logging using **RUST_LOG=info**, you can set
the log level to `debug` or `trace`. The output looks like:

```bash
Requesting session
running client service
[2021-12-07T00:07:49Z INFO  rustee_host] [TEE] << been to trusted and back
[2021-12-07T00:07:49Z INFO  rustee_host::logic] [TEE] >> been to trusted and back
```

During the execution of hello-rustee you could have seen some logging information being shown on the
secure world panel

```bash
F/TC:? 0 trace_syscall:151 syscall #3 (syscall_get_property)
D/LD:  ldelf:168 ELF (778cc440-1b20-428e-952d-f0194237c79e) at 0x4006e000
D/TA:  TA_CreateEntryPoint:8 Create entry point
Creating
D/TA:  TA_OpenSessionEntryPoint:21 Open Session entry point
Opening session
F/TC:? 0 plat_prng_add_jitter_entropy:72 0xF1
D/TC:? 0 tee_ta_init_pseudo_ta_session:299 Lookup pseudo TA 1866acea-da5c-4440-bf28-c9cf7bf0d07b
D/TC:? 0 ldelf_load_ldelf:91 ldelf load address 0x40006000
D/LD:  ldelf:134 Loading TS 1866acea-da5c-4440-bf28-c9cf7bf0d07b
F/TC:? 0 trace_syscall:151 syscall #3 (syscall_get_property)
F/TC:? 0 trace_syscall:151 syscall #5 (syscall_open_ta_session)
D/TC:? 0 ldelf_syscall_open_bin:142 Lookup user TA ELF 1866acea-da5c-4440-bf28-c9cf7bf0d07b (Secure Storage TA)
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x0D
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x68
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x65
D/TC:? 0 ldelf_syscall_open_bin:146 res=0xffff0008
D/TC:? 0 ldelf_syscall_open_bin:142 Lookup user TA ELF 1866acea-da5c-4440-bf28-c9cf7bf0d07b (REE)
D/TC:? 0 ldelf_syscall_open_bin:146 res=0
F/TC:? 0 trace_syscall:151 syscall #7 (syscall_invoke_ta_command)
F/TC:? 0 trace_syscall:151 syscall #11 (syscall_mask_cancellation)
F/TC:? 0 trace_syscall:151 syscall #7 (syscall_invoke_ta_command)
F/TC:? 0 trace_syscall:151 syscall #3 (syscall_get_property)
F/TC:? 0 trace_syscall:151 syscall #8 (syscall_check_access_rights)
F/TC:? 0 trace_syscall:151 syscall #8 (syscall_check_access_rights)
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x58
F/TC:? 0 plat_prng_add_jitter_entropy:72 0xDD
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x9F
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x49
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x53
F/TC:? 0 plat_prng_add_jitter_entropy:72 0xB1
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x82
F/TC:? 0 plat_prng_add_jitter_entropy:72 0x9A
F/TC:? 0 plat_prng_add_jitter_entropy:72 0xAF
F/TC:? 0 trace_syscall:151 syscall #6 (syscall_close_ta_session)
F/TC:? 0 trace_syscall:151 syscall #3 (syscall_get_property)
D/LD:  ldelf:168 ELF (1866acea-da5c-4440-bf28-c9cf7bf0d07b) at 0x40024000
D/TA:  TA_CreateEntryPoint:8 Create entry point
Creating
D/TA:  TA_OpenSessionEntryPoint:21 Open Session entry point
Opening session
D/TA:  TA_InvokeCommandEntryPoint:35 Invoke Command entry point
Invoked command
D/TC:? 0 tee_ta_close_session:512 csess 0xcb149f10 id 2
D/TC:? 0 tee_ta_close_session:531 Destroy session
D/TA:  TA_CloseSessionEntryPoint:27 Close Session entry point
Closing session
D/TA:  TA_DestroyEntryPoint:14 Destroy entry point
Destroying
D/TC:? 0 destroy_context:308 Destroy TA ctx (0xcb149eb0)

```

Which seems to indicate that all checks passed. Here the Optee framework
received the request to open a session to our TA, the framework looks
for the TA(UUID), and initializes it, finally it calls its invoke_command
function passing the arguments we send in the initial request.

## Running on STM32MP157-DK2/8MXMMINILDP4-EVK

The procedure to run the applications on both devices is the same.
after [configuring](../technical/20.HardwareSetup/20.intro.mdx) your device, login using root username and run the demo app:

```bash
hello-rustee
```

The Output should be quite similar to what we got running the app in `qemu`.
