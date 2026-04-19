// data/projects.ts

export interface ProductOffer {
  price: string
  priceCurrency: "EUR" | "USD"
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface ProductLanding {
  seoTitle: string
  seoDescription: string
  keywords: string[]
  /** Hero copy under the title */
  subtitle: string
  buyUrl: string
  buyLabel: string
  demoUrl?: string
  docsUrl?: string
  filamentListingUrl: string
  offer: ProductOffer
  /** Sales sections */
  highlights: { title: string; items: string[] }[]
  outcomes: string[]
  whoItsFor: string[]
  requirements: string[]
  faqs: ProductFAQ[]
  /** Optional positioning vs your other plugins */
  compareNote?: string
}

export interface Project {
  slug: string
  title: string
  description: string
  image: string
  liveUrl?: string
  techStack: string[]
  category: "Fullstack" | "Frontend" | "Tool" | "Experiment"
  product?: ProductLanding
}

export const projects: Project[] = [
  {
    slug: "agentic-chatbot",
    image: "/agentic-chatbot.webp",
    title: "Agentic Chatbot",
    description:
      "Premium Filament plugin for grounded RAG chat plus visual agentic workflows, embeddable widgets, and production-ready ops.",
    techStack: ["Filament", "Laravel", "PHP", "Livewire", "AI"],
    category: "Tool",
    liveUrl: "https://filamentphp.com/plugins/heiner-giehl-agentic-chatbot",
    product: {
      seoTitle:
        "Filament Agentic Chatbot — RAG & Visual AI Workflows for Laravel",
      seoDescription:
        "Ship agentic AI assistants inside Filament: RAG knowledge, Vue Flow workflows, API connectors, signed chat widgets, tracing, and doctor checks. Premium Laravel plugin by Heiner Giehl.",
      keywords: [
        "Filament agentic chatbot",
        "Filament AI plugin",
        "Laravel agentic AI",
        "Filament RAG workflow",
        "Filament chatbot widget",
        "Laravel Livewire AI assistant",
        "Filament 5 AI",
      ],
      subtitle:
        "Go beyond simple Q&A: run grounded retrieval, branch with a visual workflow editor, call HTTP APIs, trace every run, and embed a polished widget—without leaving your Filament panel.",
      buyUrl: "https://checkout.anystack.sh/agentic-chatbot?via=arf178",
      buyLabel: "Buy Agentic Chatbot",
      demoUrl: "https://filament-agentic-chatbot.heinerdevelops.tech/",
      docsUrl:
        "https://github.com/heinergiehl/agentic-chatbot-filament-docs/blob/main/PRODUCT_OVERVIEW.md",
      filamentListingUrl:
        "https://filamentphp.com/plugins/heiner-giehl-agentic-chatbot",
      offer: { price: "69.98", priceCurrency: "USD" },
      highlights: [
        {
          title: "RAG that is ready for real traffic",
          items: [
            "Multiple bots with their own models, prompts, and retrieval settings",
            "URL, file, sitemap, and text sources with queue-based ingestion",
            "PostgreSQL + pgvector or Chroma; streaming answers with citations",
            "Conversation history, analytics, and citation coverage insight",
          ],
        },
        {
          title: "Agentic workflows your team can actually maintain",
          items: [
            "10 node types: triggers, AI, KB retrieval, routers, HTTP, DB actions, joins, conditions",
            "Vue Flow canvas with AI-assisted drafting from plain language",
            "Versioned releases, import/export JSON, and full run traces",
            "Reusable API connector profiles shared across workflows",
          ],
        },
        {
          title: "Embeds and production hygiene",
          items: [
            "Blade component, script tag, or NPM widget; signed tokens when you need them",
            "`php artisan filament-agentic-chatbot:doctor` for pre-flight validation",
            "Data retention hooks and GDPR-oriented export/delete patterns",
          ],
        },
      ],
      outcomes: [
        "Launch a demo-backed AI product page you can send to buyers and stakeholders.",
        "Replace one-off LangChain scripts with a Filament-native control plane.",
        "Keep marketing sites and SaaS apps on the same Laravel stack with one purchase flow.",
      ],
      whoItsFor: [
        "Agencies productizing AI for clients on Laravel + Filament",
        "SaaS teams adding onboarding, support, or internal copilots",
        "Developers who want RAG today and agentic branching tomorrow—same plugin",
      ],
      requirements: [
        "PHP 8.4+",
        "Laravel 12+",
        "Filament 5.2+",
        "PostgreSQL with pgvector (recommended) or ChromaDB",
        "Queue worker + supported LLM provider API key",
      ],
      compareNote:
        "Choose RAG Chatbot when you mainly need grounded Q&A and widgets. Choose Agentic Chatbot when you also need visual workflows, external APIs, and deep run tracing—see the Filament listing for a full comparison.",
      faqs: [
        {
          question: "Is this different from your RAG Chatbot plugin?",
          answer:
            "Yes. RAG Chatbot is optimized for knowledge-grounded assistants. Agentic Chatbot includes everything needed for multi-step, branching automations (workflows, connectors, tracing) on top of the same RAG foundation.",
        },
        {
          question: "Can I try it before purchasing?",
          answer:
            "Yes. The public demo at filament-agentic-chatbot.heinerdevelops.tech includes pre-built bots, ingested sources, workflows, and a live widget so you can validate the UX end to end.",
        },
        {
          question: "Does it work with my existing Filament panels?",
          answer:
            "Install via Composer, register FilamentAgenticChatbotPlugin in your panel provider, publish config, migrate, and run the bundled doctor command. It follows standard Filament v5 patterns.",
        },
        {
          question: "What about privacy and data handling?",
          answer:
            "The package ships with operational guidance for retention, export, and deletion workflows. You control hosting, vector storage, and provider keys in your own infrastructure.",
        },
      ],
    },
  },
  {
    slug: "image-studio-pro",
    image: "/image-studio-pro.webp",
    title: "Image Studio Pro",
    description:
      "A full in-panel image editor for Filament with canvas tools, templates, brand presets, and advanced editing capabilities.",
    techStack: ["Filament", "Laravel", "PHP", "Livewire"],
    category: "Tool",
    liveUrl: "https://filamentphp.com/plugins/heiner-giehl-image-studio-pro",
    product: {
      seoTitle:
        "Filament Image Studio Pro — In-Panel Creative Studio for Laravel",
      seoDescription:
        "Edit, template, and approve images inside Filament: canvas editor, asset library, brand presets, team review, Spatie Media Library, and cloud storage. Premium plugin for Laravel admins.",
      keywords: [
        "Filament image editor",
        "Filament image plugin",
        "Laravel admin image editor",
        "Filament creative studio",
        "Filament Media Library editor",
        "in-panel image editor Laravel",
      ],
      subtitle:
        "Give marketers and ops teams a Canva-class workspace without exporting files: edit on a canvas, enforce brand presets, route approvals, and push renders straight into Filament forms or Media Library collections.",
      buyUrl:
        "https://checkout.anystack.sh/filament-image-gallery-pro?via=arf178",
      buyLabel: "Buy Image Studio Pro",
      demoUrl: "https://filament-image-studio-pro.heinerdevelops.tech/",
      docsUrl:
        "https://github.com/heinergiehl/filament-image-studio-pro-docs/blob/main/docs/getting-started.md",
      filamentListingUrl:
        "https://filamentphp.com/plugins/heiner-giehl-image-studio-pro",
      offer: { price: "49.99", priceCurrency: "EUR" },
      highlights: [
        {
          title: "Professional canvas editing",
          items: [
            "Layers, text, shapes, markup, filters, drawing, and 30+ shortcuts",
            "Templates, brand presets, and reusable source assets",
            "Exports to PNG, JPEG, or WebP with autosave and revision history",
          ],
        },
        {
          title: "Native Filament integration",
          items: [
            "CreativeStudioEditor field, actions from tables, and dedicated studio pages",
            "ViewImageAction, OpenMediaAction, galleries, and before/after compare",
            "Outputs to storage paths, asset references, or Spatie Media Library",
          ],
        },
        {
          title: "Team-ready governance",
          items: [
            "Draft → review → approval flows with audit-friendly history",
            "Tenant-aware scoping plus Gate-driven permissions",
            "Indexed browsing for large S3/GCS/R2 libraries",
          ],
        },
      ],
      outcomes: [
        "Stop the download-edit-reupload loop for social, blog, and ad creatives.",
        "Centralize brand-safe templates so non-designers ship on-message artwork.",
        "Keep every render traceable with approvals and revision checkpoints.",
      ],
      whoItsFor: [
        "Content and marketing teams inside Filament-backed products",
        "Agencies delivering multi-tenant admin experiences",
        "Products that already rely on Laravel storage or Spatie Media Library",
      ],
      requirements: [
        "PHP 8.2+",
        "Laravel 12.x",
        "Filament 5.x",
        "Livewire 4",
      ],
      faqs: [
        {
          question: "Do I need Photoshop or an external editor?",
          answer:
            "No. Image Studio Pro is designed to keep creative work inside Filament with canvas tools, presets, and exports that drop directly into your forms or media collections.",
        },
        {
          question: "Can I connect cloud storage?",
          answer:
            "Yes. Local, S3, GCS, R2, MinIO, and compatible drivers are supported, including indexed browsing for large libraries.",
        },
        {
          question: "Is there a live demo?",
          answer:
            "Yes—visit filament-image-studio-pro.heinerdevelops.tech for the marketing site and admin login to explore the full studio.",
        },
        {
          question: "How does licensing work?",
          answer:
            "Purchase via the official checkout linked on the Filament plugin page. You receive Composer repository access and ongoing updates according to the published license terms.",
        },
      ],
    },
  },
  {
    slug: "rag-chatbot",
    image: "/rag-chatbot.webp",
    title: "RAG Chatbot",
    description:
      "Production-ready AI chatbot management for Laravel + Filament with multi-bot support, knowledge ingestion, and embeddable widgets.",
    techStack: ["Filament", "Laravel", "PHP", "Livewire", "AI"],
    category: "Tool",
    liveUrl: "https://filamentphp.com/plugins/heiner-giehl-rag-chatbot",
    product: {
      seoTitle:
        "Filament RAG Chatbot — Knowledge-Grounded AI for Laravel Admin",
      seoDescription:
        "Manage multi-tenant RAG bots in Filament: ingest URLs and files, tune retrieval, embed widgets, and run doctor checks. Premium Laravel + Filament plugin by Heiner Giehl.",
      keywords: [
        "Filament RAG plugin",
        "Laravel RAG chatbot",
        "Filament chatbot",
        "Filament knowledge base AI",
        "pgvector Filament",
        "embeddable AI widget Laravel",
      ],
      subtitle:
        "Spin up support bots, documentation assistants, or internal copilots with a Filament-native admin: multiple bots, grounded answers with citations, ingestion queues, and one-script embeds.",
      buyUrl: "https://checkout.anystack.sh/filament-rag-chatbot?via=arf178",
      buyLabel: "Buy RAG Chatbot",
      demoUrl: "https://filament-rag.heinerdevelops.tech/",
      docsUrl: "https://filament-rag.heinerdevelops.tech/docs",
      filamentListingUrl:
        "https://filamentphp.com/plugins/heiner-giehl-rag-chatbot",
      offer: { price: "49.99", priceCurrency: "EUR" },
      highlights: [
        {
          title: "Bot operations without bespoke code",
          items: [
            "Separate bots with unique prompts, providers, models, and retrieval tuning",
            "Public, member, and admin contexts with per-bot widget branding",
            "Conversation review, ingestion dashboards, and production safeguards",
          ],
        },
        {
          title: "Knowledge ingestion that scales",
          items: [
            "Text, files, and URLs with queue-driven retries",
            "Support for Markdown, HTML, PDFs, and public web content",
            "Configurable top-k, similarity thresholds, and context budgets",
          ],
        },
        {
          title: "Embeds developers expect",
          items: [
            "Single-script website embed plus NPM loader for SPAs",
            "Signed tokens, domain allowlists, and rate limiting",
            "Quick prompts, welcome text, and presentation controls",
          ],
        },
      ],
      outcomes: [
        "Answer customer questions using your real docs—not generic model hallucinations.",
        "Ship embeddable widgets in minutes instead of building admin CRUD yourself.",
        "Keep vector operations observable with doctor checks and queue visibility.",
      ],
      whoItsFor: [
        "Teams that need grounded support or documentation chatbots",
        "Products already standardized on Laravel, Filament, and pgvector/Chroma",
        "Founders who want a proven admin UX instead of wiring LangChain glue code",
      ],
      requirements: [
        "PHP 8.4+",
        "Laravel 12+",
        "Filament 5+",
        "PostgreSQL + pgvector (recommended) or Chroma",
        "LLM provider API key (Gemini, OpenAI, Anthropic, xAI, etc.)",
      ],
      compareNote:
        "Need visual agentic workflows, API connectors, and deep execution traces? Upgrade path: Agentic Chatbot builds on the same product family with advanced automation tooling.",
      faqs: [
        {
          question: "How is this different from generic ChatGPT integrations?",
          answer:
            "Filament RAG focuses on your data: ingestion pipelines, retrieval tuning, citations, and Filament resources for day-two operations—not a single hard-coded prompt.",
        },
        {
          question: "Can I run multiple bots?",
          answer:
            "Yes. Each bot can have its own sources, models, prompts, and widget branding, which is ideal for multi-product suites or customer-specific knowledge spaces.",
        },
        {
          question: "Is there a health check command?",
          answer:
            "Run `php artisan filament-rag:doctor` after configuring your vector backend and queue to validate connectivity and core requirements.",
        },
        {
          question: "Where can I read the full documentation?",
          answer:
            "Public docs live at filament-rag.heinerdevelops.tech/docs with quickstart, operations, and security guides.",
        },
      ],
    },
  },
  {
    slug: "interview-scheduler",
    image: "/interview-scheduler.png",
    title: "Interview-Scheduler",
    description: "Allows the Employer to schedule interviews with candidates.",
    techStack: [
      "Laravel",
      "Vue.js",
      "Laravel Echo",
      "ShadCN-Vue",

      "TailwindCSS",
    ],
    category: "Fullstack",
    liveUrl: "https://interview-scheduler.heinerdevelops.tech",
  },
  {
    slug: "canva-clone",
    image: "/canva-clone.png",
    title: "Canva Clone",
    description: "Trying to build a fullstack app, which feels like canva.com.",
    techStack: ["Next.js", "TypeScript", "Fabric.js", "Tailwind CSS"],
    category: "Fullstack",
    liveUrl: "https://canva-clone.heinerdevelops.tech",
  },
  {
    slug: "gif-creator",
    image: "/gifmagic.png",
    title: "GIF Editor",
    description:
      "A browser-based tool to turn videos into editable GIFs using FFMPEG.wasm and Fabric.js.",
    techStack: ["React", "FFMPEG.wasm", "Fabric.js", "Vite"],
    category: "Tool",
    liveUrl: "https://gif-creator.heinerdevelops.tech",
  },
  {
    slug: "insta-media-downloader",
    image: "/downloaderInsta.png",
    title: "Instagram Media Downloader",
    description: "Download Instagram images, videos, and reels.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Python/Flask"],
    category: "Fullstack",
    liveUrl: "https://insta.savetube.me/de",
  },
  {
    slug: "threejs-carousel",
    image: "/three-carousel.png",
    title: "ThreeJS Carousel",
    description:
      "A fun experiment to learn more about ThreeJS and Shaders by building an interactive carousel.",
    techStack: ["Three.js", "GSAP", "GLSL", "Vite"],
    category: "Frontend",
    liveUrl: "https://react-three-carousel.vercel.app/",
  },
]
