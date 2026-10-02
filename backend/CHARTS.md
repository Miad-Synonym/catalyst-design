# Explainer graphics

D3 renders structured scene.graphic data using backend/charts.js. The local video renderer captures each scene and matches its duration to narration timestamps. Existing plans without graphic fall back to mechanism diagrams.

Supported types: mechanism, timeline, takeaway, bars, step. Consecutive explicit graphic types must differ. Timelines use vertical square milestones, mechanisms use horizontal circular nodes, and takeaways use typography. Numeric examples require 2-3 unique labels, matching finite nonnegative values, units, an illustrative basis, and an assumptions note. Both the note and narration identify illustrative data. Bar and step scales start at zero. Numeric formats are for examples, not verified market reporting.

Validation: backend/test_validation.py covers invalid values, unsupported types, and provenance. Browser smoke checked all four layouts at 1280x720. Graphics currently retain the existing scene fade; marks do not animate independently. Saved videos need re-rendering to change.
