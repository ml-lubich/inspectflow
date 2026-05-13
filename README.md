# InspectFlow

> Modern, affordable home inspection report software for independent
> home inspectors. Competitors (Spectora $109/mo, HomeGauge $89/mo,
> Home Inspector Pro $74/mo) are overpriced for solo/small operators —
> InspectFlow costs **$19/mo**.

```mermaid
flowchart LR
    USER[("👤 home inspector")]
    LANDING["🌐 / · landing"]
    AUTH{{"🔐 Supabase Auth"}}
    DASH["📊 /dashboard<br/>inspections"]
    REPORT["📝 report builder<br/>rooms · photos · notes"]
    PDF["📄 jspdf + html2canvas<br/>PDF export"]
    DB[("🗄 Supabase<br/>Postgres + Storage")]
    SHARE[/"🔗 client-shareable<br/>report"/]

    USER --> LANDING --> AUTH --> DASH
    DASH --> REPORT --> DB
    REPORT --> PDF --> SHARE

    classDef io fill:#0e1116,stroke:#2f81f7,stroke-width:1.5px,color:#e6edf3;
    classDef tool fill:#161b22,stroke:#3fb950,stroke-width:1.5px,color:#e6edf3;
    classDef brain fill:#161b22,stroke:#d29922,stroke-width:1.5px,color:#e6edf3;
    classDef out fill:#0e1116,stroke:#a371f7,stroke-width:1.5px,color:#e6edf3;
    class USER,DB io;
    class REPORT,PDF,LANDING,DASH tool;
    class AUTH brain;
    class SHARE out;
```

## Table of contents

- [Stack](#stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (Postgres + Auth + Storage)
- **UI:** Radix UI primitives + custom components
- **Icons:** Lucide React
- **PDF:** jspdf + html2canvas
- **Animations:** Framer Motion
- **Package Manager:** Bun

## Architecture

- `/src/app/` — App Router pages
- `/src/components/` — Reusable components
- `/src/lib/` — Utilities, Supabase client, types
- `/src/app/api/` — API routes

## Getting Started

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).
