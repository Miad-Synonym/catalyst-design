# Run locally

Requires Node 22+, Python 3.10+, and a fal API key with access to the configured endpoints. Generation incurs fal charges. No credential is bundled.

The commands below target macOS/Linux. Packaging has been checked on macOS; Windows has not been tested.

```sh
git clone https://github.com/Miad-Synonym/catalyst-design.git
cd catalyst-design
npm ci
npx playwright install chromium
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env.catalyst.local
# Edit .env.catalyst.local and set FAL_KEY, or export FAL_KEY in your shell.
npm start
```

Open http://127.0.0.1:8772/prototype/. The server binds to localhost. Do not expose it publicly; hosted use requires authentication, persistent job execution, storage and spending controls. Jobs and provider receipts are stored in ignored `.runtime/jobs/`. A retry resumes receipts rather than intentionally starting another paid request.

Optional environment variables: `CATALYST_PYTHON` selects a Python executable; `CATALYST_BROWSER_CHANNEL=chrome` uses installed Chrome; `CATALYST_PRESENTER_IMAGE_URL` overrides the approved public reference still; `CATALYST_VIDEO_HOURLY_LIMIT` sets a positive paid-job limit (unset means no hourly video cap). Only one worker runs at a time.

## Pipeline and current limits

The fal OpenRouter endpoint plans with `openai/gpt-6-luna`. ElevenLabs Turbo v2.5 generates Jessica narration and timestamps. Initial videos generate fresh presenter motion using Creatify Aurora; follow-ups use narrated graphics. D3 and FFmpeg run locally. The current planner requires three conceptual diagrams, not sourced numeric charts. Article links require pasted text or an explicit headline-only fallback. There is no independent news verification.

The frontend retains legacy demo helpers, but live requests do not play their archived files. Those files are intentionally excluded. This package does not automatically decide to skip video whenever text would suffice.

## Checks without paid generation

```sh
cd backend
../.venv/bin/python -m unittest test_presenter test_validation test_input_context test_quota
```

To run HTTP security checks, start a separate server with `PORT=8773 FAL_KEY=test-only npm start`, then run `node backend/test_api.mjs`. These checks reject malformed requests and do not submit valid generation jobs.

## Reviewer checklist

Use your own fal key in the private config; keys are not included in GitHub. The key must have access to OpenRouter planning, ElevenLabs speech and Creatify Aurora. Your fal account is charged for new generations. The public presenter reference needs network access and can be replaced with `CATALYST_PRESENTER_IMAGE_URL` if unavailable.

The browser UI, graphics and final assembly run on your machine. fal runs the model requests remotely. Keep the local server running until generation finishes. First requests can take minutes; speed varies by provider and queue. Do not expect the Vercel demo to launch this local worker.

On Linux, Playwright may require system packages; use its browser installation instructions if Chromium reports missing libraries. On Windows, the Python executable override would be needed because the default virtual-environment path assumes macOS/Linux; Windows support has not been verified.
