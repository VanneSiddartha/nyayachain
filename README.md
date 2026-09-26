# NyayaChain

NyayaChain is a demo frontend for a tamper-evident legal evidence management workflow designed for cybersecurity and legal document chain-of-custody operations.

## Problem addressed

This prototype demonstrates how investigators, supervisors, legal reviewers, and auditors can securely review digital evidence while preserving an auditable evidence trail and version-scoped access model.

## Features

- Role-based demo interface for Investigating Officer, Supervisory Officer, Legal Reviewer, and Auditor
- Document register, case management, version history, and transfer workflows
- Tamper simulation and integrity alerting
- Custody timeline and audit table concepts
- Mock API service layer designed for later FastAPI replacement
- Responsive, dark-nav evidence-management UI

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Folder structure

- `frontend/src/components` — reusable UI components
- `frontend/src/context` — application state and role context
- `frontend/src/data` — centralized mock data
- `frontend/src/pages` — route-level pages
- `frontend/src/services` — API/service abstractions
- `frontend/src/types` — TypeScript domain models
- `frontend/src/utils` — permissions and validation helpers

## Install

```bash
cd frontend
npm install
```

## Run locally

```bash
cd frontend
npm run dev
```

## Build

```bash
cd frontend
npm run build
```

## Demo users

- Ravi Kumar — Investigating Officer
- Anita Sharma — Supervisory Officer
- Priya Mehta — Legal Reviewer
- Arjun Rao — Auditor

## Demo workflow

1. Investigating Officer uploads evidence and creates V1.
2. A transfer request is created for Legal Reviewer.
3. Supervisor approves the transfer.
4. Legal Reviewer gains access to the approved version only.
5. Simulated cyber attack marks the version as restricted.
6. Integrity alert, timeline events, and report data update in the UI.

## Mock-data explanation

This app uses synthetic demo records under `frontend/src/data` to populate cases, documents, custody events, transfers, and alerts. These values are intentionally mock and not production security values.

## Backend integration plan

The service layer in `frontend/src/services/api.ts` is structured to be swapped with real FastAPI endpoints later. Planned endpoints match the application workflow, including auth, cases, documents, transfers, custody, verification, and alerts.

## Security limitations

The frontend is a presentation and workflow layer. Backend authorization is the security boundary. This demo does not enforce real RBAC or cryptographic protection; it demonstrates the intended workflow and permission design.
