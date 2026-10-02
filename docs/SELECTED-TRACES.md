# Selected LLM development traces

Selected excerpts from the development conversation. Quoted wording is retained, including conversational phrasing and typos. These are excerpts, not complete transcripts. Voice-session assistant replies are taken from the recorded transcript. Outcome notes are editorial summaries, not additional quoted messages. Credentials, private account details, tool payloads and unrelated conversation are omitted.

## 1. Challenging a weak explanation

**Miad:**
> This video just doesn't work out and narration is way too synthetic. And also, the explanation is not good. It doesn't make any sense. It's just randomly saying stuff.

**Assistant:**
> You’re right; it does feel disconnected and synthetic. Right now it’s basically five separately narrated scenes. We need one clear through-line before generating again.

**What changed:** Subsequent iterations focused on one question, a concrete example and a conditional market implication. The current [planner](../backend/planner.txt) encodes that structure. This exchange demonstrates a quality correction, not proof that all later explanations are accurate.

## 2. Assigning separate jobs to footage and graphics

**Miad:**
> So, the LLM writes the script. The video model makes the visuals or the footage. And then our interface um kind of completes that with real charts and numbers and captions

**Assistant:**
> Yes, exactly. Eight seconds presenter, cut to the basket, then a chart in code. One caveat: the chart still needs real figures. Should I pull the underlying report, or show an illustrative example labeled as such?

**Miad:**
> Show example

**What changed:** The retail experiment used an explicitly illustrative basket comparison. The current [renderer](../backend/render.mjs) keeps graphical text in code. The live pipeline currently renders conceptual diagrams; this exchange does not establish a live source-data integration.

## 3. Giving chat and video different roles

**Miad:**
> I want the explainer to be in perfect harmony with the ai chat and what it says, the video should't repeat anything the ai has already said.

**What changed:** The current planner assigns the chat three short explanatory points and asks the video to add a concrete example instead of repeating the chat verbatim. This excerpt contains the user direction; no assistant reply has been reconstructed for it.

## 4. Reviewing the actual footage

**Miad:**
> Actually, don't replace it with the checkout shot. Just cut to the graphics after five seconds

**Assistant:**
> I’ll keep the original basket shot, play five seconds once, then cut straight to the graphics while the narration finishes.

**What changed:** Miad rejected a proposed replacement shot and chose an earlier cut to graphics to avoid looping the five-second basket clip. This describes an earlier retail edit, not the current live diagram-only cutaways.

## 5. Catching a reused presenter performance

**Miad:**
> the presenter video is always the same!! make sure nothing is hardcoded.

**Assistant:**
> You were seeing the same body performance with new lip-sync. I’ve changed new explainers to generate fresh movement from the approved presenter image and each script’s audio. Her identity and Catalyst styling stay consistent.

**What changed:** New initial explainers use [fresh image-and-audio presenter generation](../backend/presenter.py) instead of a shared source performance. The four-second capability test took 130.7 seconds including download and decode. The repetition fix introduced a substantial latency tradeoff; see [benchmarks](BENCHMARKS.md). Follow-ups use narrated graphics.
