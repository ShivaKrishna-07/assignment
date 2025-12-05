# LearnLynk Technical Assignment

A Lead Management System for admissions teams with real-time task tracking.

## Quick Start

```bash
npm install

# Setup environment
cp .env.example .env.local
# Add your Supabase credentials to .env.local

npm run dev
```

Visit: `http://localhost:3000/dashboard/today`

## Features

- Database schema (leads, applications, tasks)
- Edge Function for task creation with validation
- Today's tasks dashboard with mark complete
- Real-time updates via Supabase subscriptions

## Documentation

- [ASSIGNMENT_DOCS.md](./ASSIGNMENT_DOCS.md) - Complete setup & API documentation
- [TESTING.md](./TESTING.md) - Testing checklist & verification steps
- [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md) - Stripe payment integration guide (Section 5)

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── today/          # Tasks due today page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # Reusable UI components
│   └── TasksTable.tsx      # Tasks table component
├── lib/
│   ├── supabaseClient.ts   # Supabase configuration
│   └── utils.ts            # Utility functions
├── providers/
│   └── ReactQueryProvider.tsx  # React Query setup
└── types/
    └── database.ts         # TypeScript type definitions
supabase/
└── functions/
    └── create-task/        # Edge Function for task creation
```

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Real-time**: Supabase Realtime

## Assignment Requirements

All 5 sections completed:

1. ✅ **Database Schema** - Three tables with proper relationships
2. ✅ **Edge Function** - Task creation with validation
3. ✅ **Frontend** - Tasks due today with mark complete
4. ✅ **Real-time** - Auto-refresh on database changes
5. ✅ **Integration (Stripe)** - Complete payment flow with webhooks

### Section 5: Stripe Integration Summary

**How to implement Stripe Checkout for application fees:**

1. **Create Checkout Session**: Edge Function creates Stripe session with application_id in metadata, returns checkout URL
2. **Store Payment Request**: Insert record in payment_requests table with session_id, application_id, amount, and status 'pending'
3. **Handle Webhook**: Verify Stripe webhook signature in Edge Function, listen for checkout.session.completed event
4. **Update Payment Status**: On successful payment, update payment_requests status to 'succeeded' with payment_intent_id and timestamp
5. **Update Application Stage**: Change application status from 'payment_pending' to 'under_review', create auto-task for document review due in 48 hours


