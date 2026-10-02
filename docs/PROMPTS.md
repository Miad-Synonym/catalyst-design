# Current prompt system

- [Planner](../backend/planner.txt): production instructions for short chat, narration, diagrams, follow-ups and clarification.
- [Presenter direction](../backend/presenter.py): approved identity and fresh performance direction using each generated script.
- [Validation](../backend/worker.py): bounded plan shape, timing and text checks before assembly.

The runtime prompts are reusable product instructions, not the author's full development conversation. Earlier experimental rules are excluded to avoid confusing them with the current implementation.

The initial retail baseline broadly requested a narrated explanation of a supplied headline and possible market implications. Revisions narrowed explanations to one causal mechanism, an illustrative example, and a conditional market takeaway. Current rules separate the chat's overview from the video's example and keep exact graphical text outside the video model. The three-diagram layout remains a limitation.
