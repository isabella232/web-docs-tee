---
title: Overview
sidebar_position: 1
---

:::tip Objective
Provide a secure alternative to Kusama / Polkadot validators based on TrustZone (ARM’s Trusted Execution Environment (TEE) technology).

We believe that an affordable reference open-source software/hardware stack based on trusted execution environment technologies will be a very valuable tool contribution to the validator community.
:::

## High-level Overview

- Select at least two ARM-Based hardware alternatives.
- Develop a signer service for these boards with support for Trustzone + Secure Boot technologies.
- Provide Schnorkel support.
- Integrate remote signing capabilities into Substrate.
- Provide a PR to substrate / Kusama node to allow for remote signing services.
- Provide a Ledger Nano S provisioning application to image signing keys.

:::tip More information
Click [here](Description.md) for additional information about the original project proposal.
:::

## Submissions

Please refer to the corresponding submission

- [Submission Milestone 1](SubmissionM1.md) **SUBMITTED**
- [Submission Milestone 2](SubmissionM2.md) **IN PROGRESS**
- [Submission Milestone 3](SubmissionM3.md)

## Where to buy test devices

For testing purposes, we recommend the following devices:

| Model           | Price    | Notes                             |
| --------------- | -------- | --------------------------------- |
| STM32MP157C-DK2 | ~99 USD  | [Mouser][1] [Digikey][2] [ST][3]  |
| MCiMX8-evkb     | ~484 USD | [Mouser][4] [Digikey][5] [NXP][6] |

[1]: https://www.mouser.ch/ProductDetail/STMicroelectronics/STM32MP157C-DK2?qs=9r4v7xj2LnnSrQDGcA2diw==
[2]: https://www.digikey.ch/products/en?keywords=MCIMX8M-EVKB
[3]: https://www.st.com/en/evaluation-tools/stm32mp157c-dk2.html#sample-and-buy
[4]: https://www.nxp.com/part/MCIMX8M-EVKB#/
[5]: https://www.mouser.ch/ProductDetail/NXP-Semiconductors/MCIMX8M-EVKB?qs=%2Fha2pyFaduhMHVqoUq4oRfF9hEn3wIuiNQ14GBmEQkNua8L5aW7Edg%3D%3D
[6]: https://www.digikey.ch/products/en?keywords=STM32MP157C-DK2

## Scope changes

:::warning
Test
:::

- Instead of using i.MX6 (previous generation), we have changed to focus to newer devices based on:
  - STM32MP157C
  - i.MX8
- After discussing with the Parity team, it has been decided that Substrate changes will be done by the Parity team. Zondax with later integrate by using this API.

## Original description

### Objective

Provide a secure alternative to Kusama / Polkadot validators based on TrustZone (ARM’s Trusted Execution Environment (TEE) technology). At the moment of this writing, Polkadot and Kusama validators' main option is to use a full node that signs and stores a session key in the host filesystem.

Validators require a cost efficient, reliable, low latency and secure way to sign and store keys. Their infrastructure and requirements are expected to evolve over time, so a flexible,  customizable and secure path should be available.

Validators are expected to ensure adequate physical security, so attacks that require physical access to devices for an extended period of time are typically out of scope. Key rotation and roles provide some additional safety warranties. For this reason, security assumptions for validator setups are not identical to the security assumptions of consumer hardware wallets.

We believe that an affordable reference open-source software/hardware stack based on trusted execution environment technologies will be a very valuable tool contribution to the validator community. 
This project will focus on providing a solution using ARM-based devices that provide both physical and logical separation from full nodes. This will allow a secure and low-cost solution for validators.

### Description

Validators require a cost efficient, reliable, low latency and secure way to sign and store keys. Their infrastructure and requirements are expected to evolve over time, so a flexible,  customizable and secure path should be available.

Validators are expected to ensure adequate physical security, so attacks that require physical access to devices for an extended period of time are typically out of scope. Key rotation and roles provide some additional safety warranties. For this reason, security assumptions for validator setups are not identical to the security assumptions of consumer hardware wallets.


This project will focus on providing a solution using ARM-based devices that provide both physical and logical separation from full nodes. This will allow a secure and low-cost solution for validators.

In this initial proposal, we will concentrate on ARM Cortex-A based hardware. On a follow up grant and based on our progress on this first round, we will apply for a similar set of milestones to implement a solution based on Cortex-M. In both cases, the design will focus on ARM TrustZone.

The basis for this staged plan is that at the moment LLVM lacks support for Cortex-M security extensions. This initial grant will result not only in a proof-of-concept of validator infrastructure based on Cortex-A but will also inform further work on Cortex-M CPUs.

Moreover, we will provide an initial integration and reference implementation for key management and signing on external devices. The proof-of-concept will be based on selected off-the-shelf industrial quality single board computers (SBCs) that could later be used as reference implementation and design by manufacturers.

Last but not least, we intend to provide an initial report to kick-off an online public set of guidelines and good practices for validators on how to use TrustZone based boards.

### Long term plans

Long Term Plans
Our current proposal refers to the phase A of a multi-phase long-term work plan. We envision the following roadmap:

#### Phase 1: Cortex-A

Our plan aims to support a wide range of ARM-based devices based on Cortex-A, an ARM product line that is readily available today, without the NDAs applicable to restricted platforms.

Moreover, several promising devices are being developed by third parties (such as the USB Armory MK-II) that will be available in the near future. Our reference software design and implementation will be easy to port.

 In this sense, our project intends to give validators a range of secure alternatives to running signing services which is not tied to any specific manufacturer or board designer. By open sourcing the software and providing a few examples running on ARM-based devices, we hope to encourage manufacturers to develop specific products for this market.

#### Phase 2: Cortex-M

Informed by phase A, we aim to extend support to Cortex-M33 devices. These devices require a higher level of integration but in return the attack surface is smaller compared to Linux-based Cortex-A based implementations.

At the moment of this proposal, LLVM support for security extensions cortex-m is still a work in progress. This work is led by Arm developers themselves under the umbrella of Trusted Firmware TF-M.

In addition, this phase will require exploring and extending Rust embedded support to the selected architectures, selecting an adequate operating system such as RTFM, and implementing the HAL for the corresponding design.

The purpose of this phase is to provide an open source alternative to highly integrated devices such as YubiHSM2 that can be extended with custom Rust embedded custom. Moreover, we intend to provide a completely open design that is applicable to a wider range of Cortex-M devices.

Cortex-M35P, the successor to Cortex-M33 adds physical tamper protection on top of TrustZone while still being freely available. Currently, no implementations of this architecture exist, yet its development gives perspective to physical protection of validator hardware in the long run.
