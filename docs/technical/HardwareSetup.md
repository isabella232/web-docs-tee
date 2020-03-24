# Hardware Setup

::: tip Thanks!
The following project has been funded by the [Web3 Foundation](https://web3.foundation/).

![Docusaurus](/img/web3grant.png)
:::

## Connecting your hardware

Support for several devices will be added over time. 

In this section, we provide very brief instructions on how to plug you device to run a set of initial tests. 

### STM32MP157C-DK2

::: tip FULL SUPPORT 
This device/board is currently fully supported
:::

![STM32MP157C-DK2](/img/STM32MP157C-DK2_angle2.jpg)

Using this device is very simple. Connect:

- Power supply
- Ethernet (not used in this specific test)
- Connect a USB cable to the ST-Link port

![STM32MP157C-DK2](/img/STM32MP157C-DK2_connections.png)

[ST documentation](https://wiki.st.com/stm32mpu/wiki/Getting_started/STM32MP1_boards/STM32MP157C-DK2/Let%27s_start/Unpack_the_STM32MP157C-DK2_board#) is excellent and you can find plenty of information there.

### NXP MCIMX8M-EVKB

::: tip FULL SUPPORT
This device/board is currently fully supported
:::

![MCIMX8M-EVKB](/img/imx8m.png)

Connect the following cables:

- Power supply (DC Jack 12 V)
- Ethernet (not used in this test)
- Connect a USB cable to the debug port

- turn on the device by using the power switch

### Compulab SBC-iMX8M-Mini

::: warning SUPPORTED (EXISTING ISSUES)
The board is supported but we have detected issues in related software components
:::

![imx8m-mini](/img/compulab-imx8m-mini.png)

- Make sure jumpers E6, E9, and E14 are populated (default state).
- Make sure jumpers E4, E7, E8 and E15 are removed (default state).
- Connect a standard USB cable (included in the kit) between your host PC and the evaluation kit micro-USB2.0 connector P13.
- Connect the DC 12V power supply adapter (included) to main DC power connector J2.

### TechNexion PICOPIIMX8M-R40

::: warning SUPPORTED
Work in progress
:::

### byteDEVKIT (Bytes at work)

::: danger PENDING SUPPORT - BOOT ISSUES BEING DIAGNOSED
Support for this board is still work in progress
:::

Connect:

  - Power supply
  - Ethernet (not used in this test)
  - Console cable in the 6 pin connector near the Ethernet port

![STM32MP157C-BAW](/img/STM32MP157C_baw.png)

::: tip
Please refer to [Bytes at work documentation](https://www.bytesatwork.io/wp-content/uploads/2019/07/Datasheet_byteDEVKIT_STM32MP1-V1_1-1.pdf) for more information
:::

### Toradex Apalis iMX8 QuadMax

::: danger PENDING SUPPORT - ISSUES BEING DIAGNOSED
Support for this board is still in progress
:::

- We expect you to have the following hardware:

  - Carrier Board: Ixora
  - SoM: Apalis i.MX8QM
  - Heatsink (this is strongly recommended)

- Connect the SoM (apalis) into carrier board (ixora)

![Apalix + Ixora](/img/toradex_2.jpg)

- Apply the heatsink and screws

![Apalix + Ixora](/img/toradex_3.jpg)

- Connect cables ( power, ethernet, UART)
- Power up
