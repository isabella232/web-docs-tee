# Secure Boot STM32MP1

## STM32MP157C devices

### Overview

:::warning
Enabling secure boot in a device is an irreversible process. We recommend to skip actual testing for now.

If you make a mistake or lose the keys, you will brick your device.

We suggest waiting until the next release and use our planned simplified tooling.
:::


The diagram below illustrates the trusted boot chain on the STM32MP15 (source:[https://wiki.st.com/stm32mpu](https://wiki.st.com/stm32mpu))

![](https://wiki.st.com/stm32mpu/nsfr_img_auth.php/1/10/Trusted_boot_chain.png)

[ROM code](https://wiki.st.com/stm32mpu/wiki/STM32MP15_ROM_code_overview) starts the processor in secure mode. It supports the FSBL (Trusted Firmware A) authentication and offers authentication services to the FSBL.

BootROM authenticates FSBL image using image signature; public key and ECDSA algo stored in STM32 header of the image. It performs an additional check to confirm that the public key from the image corresponds to the public key hash.

For additional details check [ST's Boot chains overview](https://wiki.st.com/stm32mpu/wiki/Boot_chains_overview.)

### Authentication
> (source: [https://wiki.st.com/stm32mpu/](https://wiki.st.com/stm32mpu/))

STM32 MPU provides authentication processing with [ECDSA](https://wiki.st.com/stm32mpu/wiki/STM32MP15_secure_boot#cite_note-1) verification algorithm, based on [ECC](https://wiki.st.com/stm32mpu/wiki/STM32MP15_secure_boot#cite_note-2). ECDSA offers better results than RSA with a smaller key. STM32 MPU relies on a 256 bits ECDSA key.

Two algorithms are supported for ECDSA calculation:

- P-256 NIST
- Brainpool 256

The algorithm selection is done via the signed binary header, as shown in STM32 header (subchapter in this same article).
The EDCSA verification follows the process below:

![](https://wiki.st.com/stm32mpu/nsfr_img_auth.php/a/a1/Bootrom_Authentication.png)

It is also possible to sign/authenticate next level images using the same key pair. BootROM does provide services to FSBL (TF-A) for further image verification. It is possible to verify images of the whole chain of trusted bootloaders/firmware up to the first non-secure bootloader (U-Boot):

- TF-A Secure Monitor (BL31)
- OP-TEE (BL32)
- U-Boot (BL33)

This is done by invoking BootROM exported function (`boot_context->p_bootrom_ext_service_ecdsa_verify_signature()`).

 For additional details you can check the sources for Trusted Firmware A, implementation of `check_authentication()` function in `plat/st/common/stm32mp_auth.c` ([ST TF-A fork](https://github.com/STMicroelectronics/arm-trusted-firmware)):

### STM32CubeProgrammer

STM32CubeProgrammer is an official package from ST. It includes a tool for key-pair generation and image signing (*STM32MP_SigningTool_CLI*).

At the moment of this writing, the key generation tool is broken on Linux. ST support suggests using a Windows PC instead. Unfortunately, there is no official open-source alternative of this tool.

:::tip Plan
We are analysing how to provide an alternative signer based on Ledger Nano S device as part of the next Milestone. This will greatly simplify the key provision and signing process. Moreover, it provides additional security with respect to key storage.
:::

### Signing Images

1. First, get list of binaries that should be signed:

```bash
$ cd /build-openstlinuxweston-stm32mp1/tmp-glibc/deploy/images/stm32mp1
$ cat flashlayout_st-image-core/FlashLayout_sdcard_stm32mp157c-dk2-optee.tsv
#Opt	Id	Name	Type	IP	Offset	Binary
-	0x01	fsbl1-boot	Binary	none	0x0	tf-a-stm32mp157c-dk2-trusted.stm32
-	0x03	ssbl-boot	Binary	none	0x0	u-boot-stm32mp157c-dk2-optee.stm32
P	0x04	fsbl1	Binary	mmc0	0x00004400	tf-a-stm32mp157c-dk2-optee.stm32
P	0x05	fsbl2	Binary	mmc0	0x00044400	tf-a-stm32mp157c-dk2-optee.stm32
P	0x06	ssbl	Binary	mmc0	0x00084400	u-boot-stm32mp157c-dk2-optee.stm32
P	0x0A	teeh	Binary	mmc0	0x00284400	tee-header_v2-stm32mp157c-dk2-optee.stm32
P	0x0B	teed	Binary	mmc0	0x002C4400	tee-pageable_v2-stm32mp157c-dk2-optee.stm32
P	0x0C	teex	Binary	mmc0	0x00304400	tee-pager_v2-stm32mp157c-dk2-optee.stm32
...
```

2. Copy images to the temporary folder:
```bash
$ cp tf-a-stm32mp157c-dk2-trusted.stm32 ~/zondax/images
$ cp u-boot-stm32mp157c-dk2-optee.stm32 ~/zondax/images
$ cp tf-a-stm32mp157c-dk2-optee.stm32 ~/zondax/images
$ cp tee-header_v2-stm32mp157c-dk2-optee.stm32 ~/zondax/images
$ cp tee-pageable_v2-stm32mp157c-dk2-optee.stm32 ~/zondax/images
$ cp tee-pager_v2-stm32mp157c-dk2-optee.stm32 ~/zondax/images
```

3. Sign images
```bash
$ export PATH=$PATH:${STM32CubeProgrammer}/bin/
# BL2 TF-A
$ STM32MP_SigningTool_CLI -bin \ ~/zondax/images/tf-a-stm32mp157c-dk2-trusted.stm32 -pubk \ ~/zondax/keys/stmkey/publicKey.pem -prvk \ ~/zondax/keys/stmkey/privateKey.pem -iv 5 -pwd qwerty123 -of 0

# BL33 U-Boot
$ STM32MP_SigningTool_CLI -bin \ ~/zondax/images/u-boot-stm32mp157c-dk2-optee.stm32 -pubk \ ~/zondax/keys/stmkey/publicKey.pem -prvk \ ~/zondax/keys/stmkey/privateKey.pem -iv 5 -pwd qwerty123 -of 0

# BL31 TF-A
$ STM32MP_SigningTool_CLI -bin \ ~/zondax/images/tf-a-stm32mp157c-dk2-optee.stm32 -pubk \ ~/zondax/keys/stmkey/publicKey.pem -prvk \ ~/zondax/keys/stmkey/privateKey.pem -iv 5 -pwd qwerty123 -of 0

# OP-TEE
$ STM32MP_SigningTool_CLI -bin \ ~/zondax/images/tee-header_v2-stm32mp157c-dk2-optee.stm32 -pubk \ ~/zondax/keys/stmkey/publicKey.pem -prvk \ ~/zondax/keys/stmkey/privateKey.pem -iv 5 -pwd qwerty123 -of 0

# OP-TEE
$ STM32MP_SigningTool_CLI -bin ~/zondax/images/tee-pageable_v2-stm32mp157c-dk2-optee.stm32 -pubk ~/zondax/keys/stmkey/publicKey.pem -prvk ~/zondax/keys/stmkey/privateKey.pem -iv 5 -pwd qwerty123 -of 0

# OP-TEE
$ STM32MP_SigningTool_CLI -bin ~/zondax/images/tee-pager_v2-stm32mp157c-dk2-optee.stm32 -pubk ~/zondax/keys/stmkey/publicKey.pem -prvk ~/zondax/keys/stmkey/privateKey.pem -iv 5 -pwd qwerty123 -of 0
```

Check if the signature was integrated, for example you can run:
```
$ colordiff -y <(xxd -l500 tee-pager_v2-stm32mp157c-dk2-optee_Signed.stm32) <(xxd -l500 tee-pager_v2-stm32mp157c-dk2-optee.stm32)
```

And obtain colored diff:
![](/img/signature_diff.png)

Copy back images to deploy folder:

```
cp /home/xdev/zondax/images/tf-a-stm32mp157c-dk2-trusted_Signed.stm32 \ ${IMAGE}/tf-a-stm32mp157c-dk2-trusted.stm32
cp /home/xdev/zondax/images/u-boot-stm32mp157c-dk2-optee_Signed.stm32 \ ${IMAGE}/u-boot-stm32mp157c-dk2-optee.stm32
cp /home/xdev/zondax/images/tf-a-stm32mp157c-dk2-optee_Signed.stm32 \ ${IMAGE}/tf-a-stm32mp157c-dk2-optee.stm32
cp /home/xdev/zondax/images/tee-header_v2-stm32mp157c-dk2-optee.stm32 \ ${IMAGE}/tf-a-stm32mp157c-dk2-optee_Signed.stm32
cp /home/xdev/zondax/images/tee-pageable_v2-stm32mp157c-dk2-optee.stm32 \ ${IMAGE}/tf-a-stm32mp157c-dk2-optee_Signed.stm32
cp /home/xdev/zondax/images/tee-pager_v2-stm32mp157c-dk2-optee.stm32 \ ${IMAGE}/tf-a-stm32mp157c-dk2-optee_Signed.stm32
```

Run script for creating a final raw image ready for:

```
./scripts/create_sdcard_from_flashlayout.sh \ flashlayout_st-image-core/FlashLayout_sdcard_stm32mp157c-dk2-optee.tsv
```

Flash raw image to SD card.

### Deploying Keys

Mount the `bootfs` partition of your newly created SD card on your PC and copy `publicKeyhash.bin` to the root directory of this partition. Boot your STM32MP1 device with SD card inserted.

Check the index of `bootfs` partition:

```bash
STM32MP> part list mmc 0

Partition Map for MMC device 0  --   Partition Type: EFI

Part	Start LBA	End LBA		Name
	Attributes
	Type GUID
	Partition GUID
  1	0x00000022	0x00000221	"fsbl1"
	attrs:	0x0000000000000000
	type:	8da63339-0007-60c0-c436-083ac8230908
	guid:	3f73b06a-7c44-46dd-a171-a40d8113fe33
  2	0x00000222	0x00000421	"fsbl2"
	attrs:	0x0000000000000000
	type:	8da63339-0007-60c0-c436-083ac8230908
	guid:	9503c3f5-7852-48ff-a45f-625a1dd19cc8
  3	0x00000422	0x00001421	"ssbl"
	attrs:	0x0000000000000000
	type:	8da63339-0007-60c0-c436-083ac8230908
	guid:	a6be2db8-3c8d-48b1-a18e-dba285fe40b0
  4	0x00001422	0x00001621	"teeh"
	attrs:	0x0000000000000000
	type:	8da63339-0007-60c0-c436-083ac8230908
	guid:	ae77dbe9-d03c-405b-ab4b-a64550cd5ca9
  5	0x00001622	0x00001821	"teed"
	attrs:	0x0000000000000000
	type:	8da63339-0007-60c0-c436-083ac8230908
	guid:	74058574-4918-48e6-9815-4d674083dafe
  6	0x00001822	0x00001a21	"teex"
	attrs:	0x0000000000000000
	type:	8da63339-0007-60c0-c436-083ac8230908
	guid:	bc61be88-dd61-4f30-abec-b464bedfed2e
  7	0x00001a22	0x00021a21	"bootfs"
	attrs:	0x0000000000000004
	type:	0fc63daf-8483-4772-8e79-3d69d8477de4
	type:	linux
	guid:	16664fb6-9e2f-45f4-bc18-76dd1e2f7aaa
  8	0x00021a22	0x00029a21	"vendorfs"
	attrs:	0x0000000000000000
	type:	0fc63daf-8483-4772-8e79-3d69d8477de4
	type:	linux
	guid:	0e6490b2-b3e1-4270-acc4-3fbec03e450c
  9	0x00029a22	0x001a0d81	"rootfs"
	attrs:	0x0000000000000000
	type:	0fc63daf-8483-4772-8e79-3d69d8477de4
	type:	linux
	guid:	4592c713-3d19-4586-b0d2-f6e86e7d3226
 10	0x001a0d82	0x002fffde	"userfs"
	attrs:	0x0000000000000000
	type:	0fc63daf-8483-4772-8e79-3d69d8477de4
	type:	linux
	guid:	3b38b933-74a6-4b3a-81d4-8eac658cd002
```

`Bootfs` is located in index 7, so we can read `publicKeyhash.bin` from it:

```bash
STM32MP> ext4load mmc 0:7 0xc0000000 publicKeyhash.bin
```

Now, verify that it was parsed correctly by reading the OTP values:

```
STM32MP> stm32key read 0xc0000000
OTP value 24: 1ce94f90
OTP value 25: 971d082f
OTP value 26: d443cf29
OTP value 27: f7c345d4
OTP value 28: 14873635
OTP value 29: b288ad40
OTP value 30: 38841b57
OTP value 31: b7a16954
```

Check if values are the same as in file (take into account BE/LE order):
```
$ hexdump publicKeyhash.bin
0000000 e91c 904f 1d97 2f08 43d4 29cf c3f7 d445
0000010 8714 3536 88b2 40ad 8438 571b a1b7 5469
0000020
```

Fuse the hash:
```
$ stm32key fuse -y 0xc0000000
```

Reset device and check boot log on a serial output. It should contain Boot authentication Success notice:
```
NOTICE:  CPU: STM32MP157CAC Rev.B
NOTICE:  Model: STMicroelectronics STM32MP157C-DK2 Discovery Board
NOTICE:  Board: MB1272 Var2 Rev.C-01
NOTICE:  Boot authentication Success
```
