# Wrdlift

> A journaling web app for intermediate or above English speakers who have plateaued and want to keep growing.

---

## Motivation

After living in Australia for about ten years, my English had reached a comfortable plateau. I could work, socialise, and get by just fine but somewhere along the way, I stopped pushing further. I still wanted to improve every day, but realised I need to find another way to do it in everyday life for easy access and also fun way.

**Wrdlift** came from that personal frustration. It's built for people like me, English is not their first language but want to journal daily in English, but also want a gentle nudge to expand their vocabulary without feeling like they're back in a classroom.

Write freely. The app surfaces better ways to say what you already said using your own words as the starting point. Over time, your journal becomes a time capsule: you can look back at old entries alongside the suggestions and see how your expression has evolved.

---

## Key Features

- ✍️ **Daily Journal Editor** - distraction-free writing experience
- 🔍 **Repeated Word Detection** - identifies overused words in each entry
- 💡 **Inline Vocabulary Suggestions** - alternative words marked up in context with highlighting your own words
- 📚 **Journal History** - browse past entries with suggestions preserved
- 🔐 **User Authentication** - secure sign-up and login via Supabase Auth
- 📄 **Pagination** - journal history loads in pages to keep performance consistent as entries grow

---

## Tech Stack

| Layer           | Technology            |
| --------------- | --------------------- |
| Framework       | Next.js (App Router)  |
| Language        | TypeScript            |
| UI              | React, shadcn/ui      |
| Styling         | Tailwind CSS          |
| Auth & Database | Supabase (PostgreSQL) |
| AI              | OpenAI API            |
| Deployment      | Vercel                |

---

## Architecture Decisions

**OpenAI calls kept server-side via Server Actions**
All requests to the OpenAI API are handled through Next.js Server Actions, never from the client. This keeps the API key out of the browser entirely and gives a clean, controlled place to validate and shape the AI response before it reaches the UI.

**AI and save merged into a single request flow**
Early in development, saving a journal entry and calling the AI were two separate operations and the entry saved first, then a second request went out to OpenAI to analyse it. This created a noticeable delay and two points of failure. Merging both into a single Server Action meant the AI analysis and the database write happen in the same flow, which made the experience feel significantly faster and the logic easier to reason about.

**Row Level Security (RLS) on all user data**
Supabase RLS policies are applied at the database level so users can only ever read and write their own journal entries. Security is enforced at the data layer, not just the application layer.

**Pagination on journal history**
Rather than fetching all entries on load, journal history is paginated via Supabase queries. This keeps initial load time predictable regardless of how many entries a user has accumulated.

---

## Challenges

**Merging AI and save into one coherent flow**
The initial architecture treated saving and AI analysis as two separate concerns. In practice, that meant two round-trips, two loading states, and a slow, disjointed experience. Refactoring them into a single Server Action was the right call. It simplified the code and made the UI feel more responsive. The lesson was to think about user-facing performance earlier when designing async flows.

**Getting the AI to return consistent, usable output**
The hardest part of the AI feature wasn't calling the API. It was making the response reliable. The model needed to return structured markup that could be rendered inline with the original entry. Getting that output shape consistent across varied journal content took real iteration on the prompt.

---

## Lessons Learned

**Prompt engineering is interface design.**
Writing a prompt that reliably produces structured, renderable output taught me that the LLM is less a magic box and more a collaborator you have to be precise with. The same instinct that makes a good API contract, clear input and predictable output, applies directly to prompts.

**Getting familiar with Supabase RLS.**
I was having an issue with the same error over and over again when I was working on the sign up and log in feature. When those were working, I couldn't save the journals and the app would break. I didn't understand why till I had a call with a friend who works in the field, and he straight away pointed out the `.select()` was in my route call but RLS wasn't set up for select. That was such a win for the day and I learned clearly.

**Font size on inputs must be at least 16px - no exceptions.**
This one cost me real debugging time. On iOS, any `<input>` or `<textarea>` with a font size below 16px triggers an automatic zoom for accessibility reasons. It's browser-enforced behaviour and cannot be overridden with CSS alone. Every input in Wrdlift is set to a minimum of 16px. A small detail that has an outsized impact on mobile usability.

---

## Current Limitations

- No support for image, video, or media attachments in journal entries
- User account deletion is not yet implemented
- Suggestions are currently English-only

---

## Screenshots

> _Portfolio screenshots and app flow walkthrough coming soon._

---

## Status

Wrdlift is a personal portfolio project. Planned improvements include user account deletion, richer suggestion explanations, and potential support for other languages.

---

Built by **Jasmine** · [LinkedIn](#https://www.linkedin.com/in/jasminejisu/) · [GitHub](#https://github.com/heyyyjisu/)
