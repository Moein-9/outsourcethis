# Lens Coatings Management - Supabase Integration

This document outlines the implementation of the Lens Coatings Management system with Supabase as the backend database.

## Database Schema

The lens coatings are stored in the `lens_coatings` table with the following schema:

```sql
CREATE TABLE public.lens_coatings (
  coating_id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  category text NOT NULL,
  is_photochromic boolean DEFAULT false,
  available_colors text[],
  created_at timestamp with time zone DEFAULT now()
);
```

## Implementation Details

### Service Layer

The integration is implemented through a service layer in `src/services/lensCoatingService.ts`, which provides the following functions:

- `getAllLensCoatings()`: Fetches all lens coatings from the database
- `addLensCoating()`: Adds a new lens coating to the database
- `updateLensCoating()`: Updates an existing lens coating
- `deleteLensCoating()`: Removes a lens coating from the database

### Component Integration

The `LensCoatingManager.tsx` component has been updated to:

1. Use the service layer functions instead of localStorage
2. Handle loading states for better UX
3. Implement proper error handling with toast notifications
4. Add loading indicators for async operations

## Type Definitions

The lens coating has the following structure:

```typescript
export interface LensCoating {
  coating_id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance-reading" | "progressive" | "bifocal" | "sunglasses";
  is_photochromic?: boolean;
  available_colors?: string[];
  created_at?: string;
}
```

## Setup Instructions

1. Run the SQL script located at `sql/lens_coatings_setup.sql` in your Supabase SQL Editor
2. The script will:
   - Create the `lens_coatings` table
   - Set up Row Level Security (RLS) policies
   - Add sample lens coating data

## Working with PostgreSQL Arrays

One notable feature of this implementation is the use of PostgreSQL arrays for `available_colors`. This allows storing multiple color options for each coating.

In the SQL schema, we define this as `available_colors text[]` which creates an array of text values. When interacting with this field:

- **Reading**: The array comes back as a JavaScript array from Supabase
- **Writing**: We send a JavaScript array, and Supabase automatically converts it to a PostgreSQL array

## Error Handling

The implementation includes comprehensive error handling for:

- Failed data fetching
- Network errors during create/update/delete operations
- Input validation
