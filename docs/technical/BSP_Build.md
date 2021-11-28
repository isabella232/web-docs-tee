# Building images

 We support two boards:

| Model              |
| ------------------- |
| STM32MP157F-DK2     |
| 8MMINILPD4-EVKB     |


The following instructions will explain in detail how to use yocto in order
to build SD Cart images for each board. The images contain the secure application for signing and key generation using a trusted execution environment 
base on the OPTEE standard.

## Preconditions

- We assume you are using Ubuntu. Other OSs (MacOS/Windows) are not formally supported.
- Install Docker [Link](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- The build process is expensive and would require all your computer
  resources, we assume you are using the computer exclusively to build the
  image.

## Common steps
First clone our entry point project that contains some scripts that take care of getting the packages and recipes to build 
an image for any of the supported boards:

```bash
git clone git@github.com:Zondax/tee-images.git
```

then switch to the honister branch

```bash
cd tee-images
git checkout honister
```

update the manifest

```bash
make manifest force
```

Once the manifest is updated we can start building the linux-base operating system that would run on the board you selected. 
It is important to mention that this step will build a full linux image containing everything is needed to run our optee-base application.
It could take a lot of resources and time depending on your computer.

## STM32MP157F-DK2

To start building a DK2 image run the following command:
```bash
make build dk2
```
Once the process is completed the full image is located in
```bash
shared/images/dk2/FlashLayout_sdcard_stm32mp157f-dk2-optee.raw
```

## 8MMINILPD4-EVKB
There is an unconventional raw image for this board, and it seems we
need a third-party tool. [Here](https://community.nxp.com/t5/i-MX-Processors/imx8m-mini-evk-flashing-images-to-SD-card/m-p/1078290) we can find more information on how to
flash a SD Card. Further steps are require on this regards.
:::warning
TODO!!
:::


## Flashing your SD-card

The next step is to burn the image on the SD Card which should be at least 4 GB.
Depending on your setup, it is possible that `/dev/mmcblk0` is not the correct
device, instead of `/dev/mmcblk0` it is possible that you need to use something like
`/dev/sd?` if you are using card readers, etc. In order to be sure how the card is prefixed on your setup, run the
following command
```bash
df -h
```
Now we can flash the SD Card using DD.
:::warning 
before to use the command dd, please unmount all the partitions associated to SDCARD.
```bash
sudo umount `lsblk --list | grep mmcblk0 | grep part | gawk '{ print $7 }' | tr '\n' ' '`
```
:::
### STM32MP157F-DK2
Just pass the path to the dk2 raw image to DD:

```bash
cd shared/images/dk2
sudo dd if=FlashLayout_sdcard_stm32mp157f-dk2-optee.raw of=/dev/mmcblk2 bs=8M conv=fdatasync status=progress
```
### 8MMINILPD4-EVKB
:::warning
TODO!!
:::
