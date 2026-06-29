# AI Investment Research Agent

An AI-powered company research app for the InsideIIM x Altuni AI Labs take-home assignment. Users enter a public company name, the backend gathers company, financial, and recent web evidence, then returns a validated `INVEST` or `PASS` research opinion.

## Live Demo

Not deployed yet. The app runs locally with the setup below.

## Features

- React + Vite frontend with search, report sections, charts, recent searches, and dark mode.
- Express + TypeScript backend with health check, validation, logging, security middleware, and centralized error handling.
- LangGraph workflow split into company resolution, financial collection, news research, analysis, committee decision, and validation nodes.
- Finnhub, Tavily, and Gemini clients with timeouts, retries, typed errors, and environment-based keys.
- Deterministic financial calculations in TypeScript before LLM interpretation.

## Setup

```bash
npm install
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
npm run dev
```

Frontend: <http://localhost:5173>  
Backend health: <http://localhost:4000/api/health>

## Environment Variables

Backend values live in `backend/.env`:

```env
NODE_ENV=development
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
LOG_LEVEL=info
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
FINNHUB_API_KEY=
FINNHUB_BASE_URL=https://finnhub.io/api/v1
TAVILY_API_KEY=
```

Frontend values live in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Do not commit real API keys.

## Architecture

```text
frontend React/Vite
        |
        v
Express API (/api/health, /api/analyze)
        |
        v
LangGraph research workflow
        |
        +--> Finnhub company and financial data
        +--> Tavily recent web research
        +--> Gemini structured analysis
```

## LangGraph Workflow

```text
resolveCompany
  -> financialData
  -> newsResearch
  -> normalizeEvidence
  -> financialAnalysis
  -> riskAnalysis
  -> investmentCommittee
  -> validateDecision
```

The implementation is intentionally modular so Phase 2 and later work can deepen each provider integration without reshaping the app.

## Data Sources

- Finnhub: symbol search, company profile, metrics, reported financials, and price candles.
- Tavily: recent company news and business-risk research.
- Gemini: interpretation and structured analysis only.

## Calculations

Revenue growth, net-income growth, cash-versus-debt comparisons, missing-data detection, and chart normalization are deterministic TypeScript calculations. Gemini receives normalized data and must not invent financial figures.

## Recommendation Methodology

The final decision is generated only by the investment committee node and validated deterministically. If the output is invalid or evidence is insufficient, the app falls back to `PASS` with low confidence.

## Error And Fallback Behavior

Provider failures, invalid companies, ambiguous company names, rate limits, missing keys, missing financial history, invalid LLM output, and unexpected errors return friendly API errors without exposing stack traces or secrets.

## Example Runs

Example output files will be generated under `examples/` after real provider keys are configured.

## Key Decisions And Trade-Offs

- In-memory execution only; no database is added for this assignment.
- No auth, portfolio tools, broker integration, or personalized financial advice.
- Provider calls are cached lightly in memory during a server process to reduce repeated work.

## Limitations

- Real analysis requires valid Gemini, Finnhub, and Tavily API keys.
- In-memory cache does not survive redeploys or restarts.
- International ticker support depends on Finnhub coverage.

## Responsible AI Disclaimer

This project generates AI-assisted research summaries and is not personal financial advice.

## How AI Was Used While Building

Codex was used to scaffold, implement, inspect, and verify the project. Chat transcript files can be saved under `examples/ai-development-logs/` when available.

## Future Improvements

- Add streaming progress endpoints.
- Add deeper provider test fixtures.
- Deploy to Vercel/Render.
- Generate sanitized example outputs with live keys.
