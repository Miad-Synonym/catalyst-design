# Portability receipt

Implemented one responsive, static “Strategy signal” composition from only `design.md` and `tokens.css`.

## Rules and tokens used

- Fixed dark presentation using `--color-page`, with a square phase panel using `--color-step-two-wash` and `--color-step-two`.
- Typography split: FK Raster for the editorial statement, JetBrains Mono for compact metadata, and Clash Grotesk for product UI content.
- Documented mobile type roles (46px feature display, 12px mono metadata, 14px UI body, 16px UI title) and the documented 104px desktop feature role.
- Documented spacing rhythm (`6`, `8`, `12`, `14`, `16`, and `32px`), the 6px product-card radius, and 24px metadata-pill radius.
- Product evidence uses the transaction-card treatment: `--color-card`, 14px padding, 8px internal rhythm, compact UI copy, muted mono metadata, and sparse positive green.
- Pink is treated as the research/narrative phase accent, not as a generic status color. Green is reserved for the positive illustrative outcome.
- The composition changes from a narrow vertical stack below 1000px to a two-column layout at 1000px and above, matching the documented breakpoint model.
- The sample is explicitly labeled static and simulated so it cannot be mistaken for live market data.

## Ambiguity

- The source display fonts are referenced by family name but not bundled because redistribution rights are unknown; browser fallbacks will change fidelity.
- No observed component exists for a strategy-signal card. This is an intentionally unseen composition assembled from the documented phase-panel, transaction-card, typography, color, and responsive rules.
- The 1px divider and 2px chart stroke are implementation details. The contract describes fine connector lines but does not provide dedicated line-width tokens.
- Desktop card width and the two-column proportions are inferred for this portability test. The contract documents the horizontal narrative model, not a measured strategy-card geometry.
- No interaction, loading, empty, error, success, or disabled state is claimed.
