# Catalyst: Understand the move

A conversational explainer that helps people understand market news before they form a view and decide what to do.

## 1. Context

I built the “understand” layer of the Catalyst experience for everyday consumers with basic market knowledge.

That shaped the experience. I kept the language simple and down to earth, started with the main idea, and left deeper detail for follow-up questions. A familiar chat interface lets users ask, watch, and follow up without learning another workflow.

## 2. Tension

The hardest problem was balancing generation speed with quality and consistency. Each video depends on the script, narration, footage, and graphics working together. Improving one part could introduce a longer wait somewhere else.

The explanation also needed to make sense on its own. Some early videos felt disconnected, so I worked on giving each one a clear question, a concrete example, and a takeaway.

## 3. The Room

I’d work with engineers early to understand reliability, infrastructure, cost, and realistic wait times. I’d work with a PM to decide where video adds value and how to test it.

My instinct was to keep the interaction familiar and conversational. I’d push back on adding a presenter or chart to every explanation. Each element needs to help the user understand enough to justify its complexity and wait.

## 4. Decisions

I split production into specific jobs: a language model writes the script, a voice model handles narration, a video model creates footage, and local code renders graphics and assembles the video.

I explored a recurring presenter to make the experience more personal and recognizable. But fresh presenter footage takes longer and introduced lip-sync problems. Narration with graphics offered a faster option, particularly for follow-ups.

I also designed the wait. The chat gives users a short explanation while the video is prepared. I pushed for the video to build on that information rather than repeat it.

I developed a reusable prompt system that turns each input into a focused explanation. It gives the chat and video distinct roles, keeps the language conversational, and structures the video around one clear question, a concrete example, and a market takeaway. I refined those rules through testing to reduce repetition and keep the explanation coherent across different topics.

I directed the AI on the audience, chat flow, and what belonged in the chat versus the video. I pushed back when explanations felt disconnected, narration sounded synthetic, or footage repeated. I reviewed the videos, spotted lip-sync drift and looping footage, and adjusted the cuts. I trusted the agent to implement the graphics and video assembly while I continued reviewing the output.

For an unreadable article link, users can paste the article text or continue with a headline-based explanation.

## 5. Outcomes

In my testing, chat and narration are the strongest parts. The explanations introduce ideas in small, story-driven chunks. Narrated follow-ups are faster than fresh presenter videos.

Visual variety, lip sync, source verification, and presenter wait time still need work. The live pipeline runs locally. The interface can go on Vercel, but generation and assembly need a hosted worker and shared storage.

Next, I’d measure time to the first useful answer, follow-up usage, and whether users can explain the idea back in their own words. That would help establish whether the video earns its wait.

---

## Repository reference

- `design-system/` contains the evidence-backed design-system reference derived from the public Catalyst site.
- `design-system/index.html` is the visual reference entry point.

## Run and review

- [Local setup and architecture](docs/SETUP.md)
- [Current generation prompts](docs/PROMPTS.md)
- [Selected development decisions](docs/TRACE-GUIDE.md)
- [Measured tests and limitations](docs/BENCHMARKS.md)

The live prototype runs locally. No API key or private development transcripts are included.
