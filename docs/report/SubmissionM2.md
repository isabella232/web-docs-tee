---
title: Milestone 2
sidebar_position: 3
---

## Proof-of-Concept

### Overview

- Reference implementation of a signing service (both ed25519 and sr25519) running on the selected boards. This will include:
- Rust based implementation of the service
- TrustZone support
- Schnorrkel support
- Secure-boot + documented upgrade mechanism
- Substrate changes and corresponding pull request to allow for external signing services.
- Reference embedded Linux configuration for the corresponding boards
- Tutorial: Configuration and operation of the hardware device

### Deliverables

1. Proof of concept
2. Corresponding unit and integration tests
3. Upgrade procedure with self-hosted PKI / firmware signing mechanism, e.g., using a Ledger Nano S
4. Tutorial on how to initialize, set-up and configure the hardware device
5. Substrate open PR to accept external signer (may be still under review)
