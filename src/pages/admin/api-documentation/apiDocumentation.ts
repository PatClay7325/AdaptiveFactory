export const apiDocumentation = `
# Enhanced API Documentation

This comprehensive documentation guide provides detailed information for implementing and interacting with the project's API. It includes advanced documentation formats, authentication methods, error handling strategies, rate limiting guidelines, versioning approaches, webhook integration, and extensive PostgreSQL implementation details for backend developers.

## Table of Contents

1. [Documentation Structure](#documentation-structure)
2. [Quick Start Guide](#quick-start-guide)
3. [Interactive Documentation Setup](#interactive-documentation-setup)
4. [Enhanced Authentication Documentation](#enhanced-authentication-documentation)
5. [Error Codes and Handling Documentation](#error-codes-and-handling-documentation)
6. [Rate Limiting Documentation](#rate-limiting-documentation)
7. [Enhanced Versioning Strategy Documentation](#enhanced-versioning-strategy-documentation)
8. [Webhook Documentation](#webhook-documentation)
9. [Comprehensive PostgreSQL Queries and Schemas](#comprehensive-postgresql-queries-and-schemas-for-backend-developers)
10. [Integration Examples in Multiple Languages](#integration-examples)
11. [Next.js API Implementation](#next-js-api-implementation)
12. [Testing Framework](#testing-framework)
13. [Deployment Guide](#deployment-guide)
14. [Performance Optimization](#performance-optimization)
15. [Monitoring and Alerting](#monitoring-and-alerting)
16. [Troubleshooting Guide](#troubleshooting-guide)
17. [Environmental Configuration](#environmental-configuration)
18. [GraphQL Implementation Alternative](#graphql-implementation-alternative)

## Documentation Structure

\`\`\`
/docs
  /api
    README.md                     # Overview of the API architecture
    CHANGELOG.md                  # Version history and changes
    ERROR_CODES.md                # Standardized error codes and formats
    AUTHENTICATION.md             # Detailed authentication guide
    RATE_LIMITS.md                # API rate limiting information
    VERSIONING.md                 # API versioning strategy
    WEBHOOKS.md                   # Webhook documentation
    QUICK_START.md                # Quick start guide for new developers
    TESTING.md                    # Testing framework documentation
    DEPLOYMENT.md                 # Deployment and migration guide
    PERFORMANCE.md                # Performance optimization guidelines
    MONITORING.md                 # Monitoring and alerting setup
    TROUBLESHOOTING.md            # Common issues and solutions
    ENVIRONMENTS.md               # Environment configuration guide
    GRAPHQL.md                    # GraphQL implementation alternative
    /dashboard                    # Documentation for dashboard section
    /admin                        # Documentation for admin section
    /operations                   # Documentation for operations section
    /openapi                      # OpenAPI/Swagger specifications
    /postman                      # Postman collections
    /examples                     # Code examples in multiple languages
    /database                     # Database schemas and queries
    /interactive                  # Interactive documentation setup
\`\`\`

## Quick Start Guide

This quick start guide provides a minimal implementation path for developers to get up and running quickly.

### 1. Set Up Supabase Project

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)
2. Note your Supabase URL and API keys (anon key and service role key)

### 2. Database Setup

Execute the basic schema setup using the Supabase SQL Editor:

\`\`\`sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create core tables
CREATE TABLE dashboard_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  overview_text TEXT,
  highlights JSONB,
  performance_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE key_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  trend NUMERIC,
  description TEXT,
  time_range TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE dashboard_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_metrics ENABLE ROW LEVEL SECURITY;

-- Add basic policies
CREATE POLICY "Users can read their own dashboard summaries" 
ON dashboard_summary FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own dashboard summaries" 
ON dashboard_summary FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own metrics" 
ON key_metrics FOR SELECT USING (auth.uid() = user_id);
\`\`\`

### 3. API Setup in React Frontend

1. Install Supabase client in your React project:

\`\`\`bash
npm install @supabase/supabase-js
\`\`\`

...

`;