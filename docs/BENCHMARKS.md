# Observed generation tests

These are individual local observations, not latency guarantees or user-study results.

| Test | Observed time | Scope |
|---|---:|---|
| Fresh Aurora presenter | 130.7 seconds | Four-second opening, including download/decode; not a full new explanation |
| Turbo v2.5 voice | 5.4 seconds | Same 72-word script as the comparison |
| Eleven v3 voice | 20.9 seconds | Same-script comparison |

The Aurora output decoded and assembled successfully with an existing retail test. Sampled frames showed new face and hand movement. This does not establish consistently good lip sync. Raw provider receipts and experimental exports remain private.

The current default is VEED Fabric Fast at 480p with a three-second presenter opening. One October 2 test took 15.7 seconds for the provider result and 17.2 seconds including upload, download and decoding. It used existing narration, so this is not an end-to-end benchmark. The completed clip was assembled into the stalled Fed explanation; narration continues over locally rendered graphics. Lower resolution trades detail for speed. One run does not establish typical latency or lip-sync reliability.
