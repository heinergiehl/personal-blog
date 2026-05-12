---
title: Laravel RAG Chatbot with pgvector
slug: laravel-rag-chatbot-filament-pgvector
summary: A practical guide to building or choosing a Laravel RAG chatbot for Filament with URL ingestion, file ingestion, pgvector, Chroma, citations, and embeddable widgets.
description: Learn how a Laravel RAG chatbot works in Filament, when to use pgvector or Chroma, and what matters for documentation and support bots.
publishedAt: 2026-05-12
imageUrl: /rag-chatbot.webp
---

A **Laravel RAG chatbot** is useful when a generic AI answer is not good enough. Customers, users, and internal teams usually ask questions about your actual product: pricing rules, installation steps, onboarding flows, API behavior, support policies, or documentation details.

RAG helps by retrieving relevant knowledge from your own sources before the model writes an answer. In a Laravel and Filament app, the key is not only the retrieval algorithm. The real product value is the admin workflow around ingestion, review, source management, and monitoring.

This guide explains what a RAG chatbot needs in a Filament panel, when pgvector or Chroma makes sense, and how to avoid turning a chatbot project into a pile of one-off scripts.

## What RAG Means for a Laravel Product

RAG stands for retrieval augmented generation. The typical flow looks like this:

1. Your team adds sources such as docs pages, Markdown files, PDFs, or support articles.
2. The system splits those sources into chunks.
3. Each chunk is embedded and stored in a vector backend.
4. A user asks a question.
5. The app searches for relevant chunks.
6. The answer is generated with the retrieved context.
7. The conversation and source usage are logged for review.

In Laravel, this usually involves queues, storage, scheduled jobs, database tables, provider API keys, and a vector store. In Filament, the same system needs resources, forms, tables, actions, dashboards, and permission rules.

That is why a dedicated [RAG Chatbot](/rag-chatbot) plugin can save a lot of time. It gives you the operational surface that teams otherwise rebuild for every product.

## pgvector vs Chroma for Laravel RAG

Two common vector storage options are PostgreSQL with pgvector and Chroma.

**pgvector** is a strong fit when your Laravel app already runs on PostgreSQL and your team wants fewer moving parts. It keeps vector search close to your application data and works well for teams that already understand database backups, migrations, and monitoring.

**Chroma** can be a good fit when you want a dedicated vector database service or a separate retrieval component. It can make experimentation easier in some stacks, especially when vector operations should be isolated from the main application database.

The practical choice usually comes down to operations:

- use pgvector if PostgreSQL is already part of your production stack
- use Chroma if you prefer a separate vector service
- avoid adding a new service if your team cannot monitor or back it up properly
- make sure your plugin has a health check for whichever backend you choose

For many Laravel teams, pgvector is the simplest production path. The best backend is the one your team can operate confidently.

## What to Ingest

A Filament RAG chatbot should support the source types your product team actually uses. Common sources include:

- public documentation pages
- help center articles
- Markdown docs in a repository
- PDFs with product or policy information
- plain text snippets for short canonical answers
- sitemap URLs for larger documentation areas
- internal onboarding or operations notes

The important part is repeatability. You should be able to re-ingest sources, see failures, retry jobs, and remove stale content. A chatbot that answers from outdated documentation can be worse than no chatbot at all.

The [RAG Chatbot](/rag-chatbot) product page covers the focused path: source ingestion, bot settings, widget controls, and production health monitoring inside Filament.

## Retrieval Settings That Matter

RAG quality is not only about choosing a model. Retrieval settings decide what context the model sees.

The most useful settings are:

- **Top-k:** how many chunks to retrieve
- **Similarity threshold:** how strict retrieval should be
- **Context budget:** how much retrieved content fits into the prompt
- **Chunking strategy:** how source text is split
- **Source filters:** which sources a bot is allowed to use
- **Citation behavior:** whether answers show where information came from

For documentation chatbots, citations are especially valuable. They help users trust the answer and help your team discover weak or missing content.

## Production Checklist

Before treating a Laravel RAG chatbot as production-ready, confirm that you have:

- queue workers running reliably
- retry behavior for failed ingestion jobs
- provider key validation
- vector backend health checks
- domain controls for public widgets
- rate limiting for anonymous users
- conversation review tools
- clear deletion or retention behavior
- a way to update sources without redeploying

These items are not exciting, but they are the difference between a demo and a support tool.

## When RAG Is Enough

RAG is the right choice when the chatbot mainly answers questions. It is ideal for:

- documentation chatbots
- customer support Q&A
- internal knowledge base assistants
- installation or setup helpers
- product FAQ bots
- onboarding guidance

If the user asks a question and the bot answers from your knowledge base, stay focused. Do not add workflow complexity before you need it.

If the chatbot also needs to collect data, branch through flows, call APIs, or perform actions, compare it with [Agentic Chatbot](/agentic-chatbot). The broader plugin adds visual workflows and run tracing on top of the same general chatbot idea.

For a quick overview of the plugin family, start at [Filament plugins for Laravel](/filament-plugins).
