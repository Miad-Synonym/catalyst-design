# Local prototype Loom guide

Latest recording: [Building an AI Video Explainer Pipeline](https://www.loom.com/share/01ae1e91b41842c2aab513e02c6f0d99) (4:57). The two-minute outline below is recording guidance.

Aim for two minutes. Record the local prototype the team will run, rather than the static deployment. Prepare a completed example so generation does not consume the recording; clearly say when you skip ahead.

## 0:00–0:20 · What I built

“I built the understand layer of Catalyst, before someone forms a view and takes action. It is for people with basic market knowledge, so I kept it simple and used a familiar chat interface.”

Show the input and short chat explanation.

## 0:20–0:50 · How I directed the AI

“I directed the AI to build a reusable prompt system. It breaks each topic down into one clear idea, a concrete example, and what it could mean for markets. Then it assigns each part to the right tool: the language model writes the explanation, the voice model handles narration, the video model creates the presenter, and code renders the graphics. I kept reviewing the results and pushing back on repetition, unclear explanations, and visuals that weren’t helping.”

This describes the configured pipeline: the backend routes those outputs to specific models; the planner does not freely choose providers.

## 0:50–1:20 · Show the experience

Show useful chat responses arriving before the video, the preparing bubble, then skip ahead to the completed explainer. Play a brief presenter-to-graphics transition. Explain that follow-ups focus on the next concept and can use narrated graphics without a presenter.

## 1:20–1:40 · Show one recovery

Use the article-link example. When the article cannot be read, show the choice to paste its body or continue from the headline. Do not describe the headline-only result as a verified article summary.

## 1:40–2:00 · What I would test next

“The chat and narration feel strongest in my testing. I would keep improving the graphics and consistency, and test whether people can explain the idea back afterward. This version runs locally because generation and video assembly use a local worker. The setup instructions are in the repo.”

Do not promise a fixed generation time. The three-second Fabric Fast presenter test took 17.2 seconds including transfer and validation; that was one test of the presenter stage, not the full user journey.
