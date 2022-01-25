---
title: Overview
sidebar_position: 1
---

## Getting Started

-   Build images [Link](..)

## Single Node/Validator + 1 Remote Signer

This setup is what has been used originally for testing the implementation of the signer and the working of the nodes, but has been found insufficient afterwards, especially after rotating keys.

It's still possible to use this setup. The prerequisite are our fork of the substrate node (which also contains the chainspecs used and helpful scripts) and a configured remote signer.

After having configured a connection with your remote signer and after having built the substrate node, navigate to the substrate node fork and run:

```bash
./target/release/substrate --discover-local --chain chainspecs/zondaxSpec.json --tmp --execution native --validator --listen-addr /ip4/0.0.0.0/tcp/30333 --ws-port 9944 --keystore-uri "tcp://localhost:39946"
```

this will start the first node which is connected to the remote signer at localhost:39946, please change the address accordingly.
To star the second node, open a second terminal and run:

```bash
make othernode
```

this will take care of setting up the second node with "Alice", listening on port 30334 for other nodes and 9945 for websocket.

## Two Validators + 1 Remote Signer

This setup is the fruit of our recent research and trial and error, the objective of the setup is test the remote signer functionality in a more "real" environment, meeting the minimal requirements of how common chains are run.

The setup is 2 nodes, "Alice" and "Bob", with their respective stash keys, and "Robert" which is the node making use of the remote signer.

A script has been prepared in the substrate fork to facilitate running everything at once:

```bash
sh demo_starSpec.sh
```

This script will start all 3 nodes in the same terminal and copy their output to 3 separate files for easier inspection later.

These 3 nodes will interact with each other automatically and start producing blocks and also finalize blocks. This can be verified in the terminal interface aswell as the polkadotjs network explorer.

It's possible to change the expected address of the remote signer by passing the entire uri as argument of the script, the same uri that is passed to `--keystore-uri` on the node invocation.
