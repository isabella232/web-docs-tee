---
title: Optee tests 
sidebar_position: 2
---

The first step after [flashing](../technical/30.BSP/99.Flashing.mdx) the SD Card with our distribution and
[booting](../technical/20.HardwareSetup/20.intro.mdx) the device is running the **Optee tests**, better known as [xtests](https://github.com/OP-TEE/optee_test). 
These tests are important because they ensure that the Tee kernel drivers and supplicant that are
running on the device work and behave as they are supposed to do and
they show what parts of optee fail. 
Optee has many features, some of them are not really necessary, like secure tcp
sockets, peripheral communication like SPI or serial ports. As those
features are not necessary for our application, even though some optee
tests fail they might not be critical.

## Running xtest
Open a shell session in your device using either Minicom or SSH. then
run the following command:
```bash
xtest
```
:::note
Refer to the [official](https://optee.readthedocs.io/en/latest/building/gits/optee_test.html) xtest documentation for further options
:::


for the __STM32MP157F-DK2__ board the test summary would look like this:
```bash
regression_6017 OK
regression_6018.1 FAILED first error at /usr/src/debug/optee-test/3.14.0+gitAUTOINC+f2eb88affb-r0/git/host/xtest/regression_6000.c:1707
regression_6018.2 FAILED first error at /usr/src/debug/optee-test/3.14.0+gitAUTOINC+f2eb88affb-r0/git/host/xtest/regression_6000.c:1697
regression_6018 FAILED
regression_6019 OK
regression_6020 OK
regression_8001 OK
regression_8002 OK
regression_8101 OK
regression_8102 OK
regression_8103 OK
+-----------------------------------------------------
25435 subtests of which 4 failed
92 test cases of which 2 failed
0 test cases were skipped
TEE test application done!
```
You could see in some part of the output an error like this:
 
```bash
/usr/src/debug/optee-test/3.14.0+gitAUTOINC+f2eb88affb-r0/git/host/xtest/regression_6000.c:1707: fs_write(&sess, obj, block, block_size) has an unexpected value: 0xffff3024 = TEE_ERROR_TARGET_DEAD, expected 0x0 = TEEC_SUCCESS
  regression_6018.1 FAILED
o regression_6018.2 Storage id: 80000000
/usr/src/debug/optee-test/3.14.0+gitAUTOINC+f2eb88affb-r0/git/host/xtest/regression_6000.c:1697: fs_create(&sess, file_01, sizeof(file_01), 0x00000002, 0, ((void *)0), 0, &obj, storage_id) has an unexpected value: 0xffff0003 = TEEC_ERROR_ACCESS_CONFLICT, expected 0x0 = TEEC_SUCCESS
  regression_6018.2 FAILED
  regression_6018 FAILED

```
We are still investigating this error that is part of an API of Optee
that our application does not us. 

Regarding to the __8MMINILPD4-EVKB__ board the test summary would look like this:
```text
24688 subtests of which 12 FAILED92 test cases of which 5 FAILED0 test
cases were skipped
TEE test application done!
```

The failing tests show a bit what part of the API they were calling:
```bash
* regression_4005 Test TEE Internal API Authenticated Encryption operations
o regression_4005.1 AE case 0 algo 0x40000710 line 2407
  regression_4005.1 OK
o regression_4005.2 AE case 1 algo 0x40000710 line 2407
/usr/src/debug/optee-test/3.14.0+gitAUTOINC+f2eb88affb-r0/git/host/xtest/regression_4000.c:2625: ta_crypt_cmd_ae_decrypt_final(c, &session, op2, ae_cases[n].ctx + ae_cases[n].in_incr, aeS
  regression_4005.2 FAILED
  regression_4005 FAILED
```
They called the AES encryption and decryption API(some functions of this API) in optee which our application does not use.
We only use the allocation API and the sandboxing feature that offers us a way to 
run secure application in an isolating manner. Advances features like secure file systems, secure peripheral communications and
symmetric/asymmetric encryption are out of the scope of our application.

:::note
The optee version installed on each board are different:

| Board           |      Optee version |
| --------------- | :----------------: |
| STM32MP157F-DK2 | 3.12               |
| 8MMINILPD4-EVKB | 3.10               |
:::













