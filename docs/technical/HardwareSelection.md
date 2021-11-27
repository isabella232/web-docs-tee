# Hardware Selection

:::info The following project has been funded by the [Web3 Foundation](https://web3.foundation/).

<img src="/img/web3grant.png" alt="drawing" width="300"/>
:::

### Selection process

We are evaluating and working with multiple architectures and manufacturers at this moment. We are taking into account several factors including but not limited to:

- Security ( Trustzone, HAB support, Secure Memory )
- Logistics ( Market availability, Lead Time )
- Support ( Existing BSPs, Technical Support, Documentation )
- Robustness ( Temperature range, Power supply range, SBC/Carrier Format)
- Peripheral ( Ethernet connection, USB connection )
- Price

We have contacted each manufacturer, evaluated their support process, received technical documentation. In many cases, we have acquired the product to run internal tests.

As a reference we can provide a list of some of the devices we are currently working with:

| Model                 | MPU              | Manufacturer | Notes                |
| --------------------- | ---------------- | ------------ | -------------------- |
| **_STM32MP157C-DK2_** | STM32MP157C      | ST Micro     | [Link][1] [A, B, C]  |
| ODYSSEY STM32MP157C   | STM32MP157C      | Seeed        | [Link][2] [A, X]     |
| phyCORE-STM32MP1      | STM32MP157C      | Phytec       | [Link][3] [A, X]     |
| byteDEVKIT            | STM32MP157C      | BytesAtWork  | [Link][4] [A, B, C]  |
| emSBC-Argon           | STM32MP157C      | emtrion      | [Link][5] [A, X]     |
| USB Armory Mk-II      | i.MX6UL          | F-secure     | [Link][6] [A, B, C]  |
| WISE-710              | i.MX6            | Advantech    | [Link][7] [A, B, C]  |
| phyBOARD-Segin        | i.MX6            | Phytec       | [Link][8] [A, X]     |
| LEC-iMX8M             | i.MX8 Quad       | Adlink       | [Link][13] [A]       |
| phyBOARD-Polaris      | i.MX8M Quad      | Phytec       | [Link][9] [A, X]     |
| **_MCiMX8-evkb_**     | i.MX8M Quad      | NXP          | [Link][11] [A, B, C] |
| Apalis iMX8 QuadMax   | i.MX8 Quad Max   | Toradex      | [Link][10] [A, B, C] |
| SBC-iMX8M-Mini        | i.MX8M Mini Quad | Compulab     | [Link][12] [A, B, C] |
| PICO-PI-IMX8M         | i.MX8M Mini Quad | TechNexion   | [Link][14] [A, B, C] |
| Verdin iMX8M          | i.MX8M Mini Quad | Toradex      | [Link][15] [A, X, C] |

**[A]** contacted manufacturer
**[B]** we adquired a device
**[C]** evaluated custom image
**[X]** not available yet

---

[1]: https://www.st.com/en/evaluation-tools/stm32mp157c-dk2.html
[2]: http://wiki.seeedstudio.com/ODYSSEY-STM32MP157C/
[3]: https://www.phytec.eu/products/st/stm32mp1/
[4]: https://www.bytesatwork.io/produkt/bytedevkit-stm32mp1/
[5]: https://www.emtrion.de/en/details_products-accessoires/emsbc-argon-single-board-computer.html
[6]: https://inversepath.com/usbarmory.html
[7]: https://advdownload.advantech.com/productfile/PIS/WISE-710/file/WISE-710_DS20191213102415.pdf
[8]: https://www.phytec.de/produkt/single-board-computer/phyboard-segin/
[9]: https://www.phytec.de/produkt/single-board-computer/phyboard-polaris/
[10]: https://www.toradex.com/de/computer-on-modules/apalis-arm-family/nxp-imx-8
[11]: https://www.nxp.com/design/development-boards/i-mx-evaluation-and-development-boards/evaluation-kit-for-the-i-mx-8m-applications-processor:MCIMX8M-EVK
[12]: https://www.compulab.com/products/sbcs/sbc-imx8m-mini-nxp-i-mx8m-mini-single-board-computer/#specs
[13]: https://www.adlinktech.com/Products/Computer_on_Modules/SMARC/LEC-iMX8M?lang=en
[14]: https://shop.technexion.com/pico-pi-imx8m-mini.html
[15]: https://www.toradex.com/computer-on-modules/verdin-arm-family/nxp-imx-8m-mini-nano

#### Why some devices are prioritized?

After analyzing and testing a wide range of devices, we noticed a few common themes:

- BSP quality issues
- Inadequate form factor for datacenter applications: We believe ethernet support is a critical requirement.
- Market availability problems: devices are still not available, stocks were low and supply chain is not clear.

With respect to software layers, we had a look at different design alternatives. Taking a pragmatic long-term support perspective, we decided to use a extremely minimal Yocto+OPTEE image for the initial implementation.

While there are interesting opportunities in the bare metal / RTOS space, we consider them too experimental. Moreover, we prefer to rely on projects with a substantial community to ensure long term maintenance. This means, relying on extensive testing, CVE availability, strong community, etc.
