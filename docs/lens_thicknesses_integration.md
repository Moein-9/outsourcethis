# Lens Thicknesses Management - Supabase Integration

This document outlines the implementation of the Lens Thicknesses Management system with Supabase as the backend database.

## Database Schema

The lens thicknesses are stored in the `lens_thicknesses` table with the following schema:

```sql
CREATE TABLE public.lens_thicknesses (
  thickness_id text PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  description text,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

## Implementation Details

### Service Layer

The integration is implemented through a service layer in `src/services/lensThicknessService.ts`, which provides the following functions:

- `getAllLensThicknesses()`: Fetches all lens thicknesses from the database
- `addLensThickness()`: Adds a new lens thickness to the database
- `updateLensThickness()`: Updates an existing lens thickness
- `deleteLensThickness()`: Removes a lens thickness from the database

### Component Integration

The `LensThicknessManager.tsx` component has been updated to:

1. Use the service layer functions instead of localStorage
2. Handle loading states for better UX
3. Implement proper error handling with toast notifications
4. Add loading indicators for async operations

## Type Definitions

The lens thickness has the following structure:

```typescript
export interface LensThickness {
  thickness_id: string;
  name: string;
  price: number;
  description?: string;
  category: "distance-reading" | "progressive" | "bifocal";
  created_at?: string;
}
```

## Setup Instructions

1. Run the SQL script located at `sql/lens_thicknesses_setup.sql` in your Supabase SQL Editor
2. The script will:
   - Create the `lens_thicknesses` table
   - Set up Row Level Security (RLS) policies
   - Add sample lens thickness data

## Error Handling

The implementation includes comprehensive error handling for:

- Failed data fetching
- Network errors during create/update/delete operations
- Input validation

## Migrating Existing Data

If you're migrating from the previous localStorage implementation:

1. The SQL setup script includes sample data that matches the common lens thickness options
2. Custom lens thicknesses created by users will need to be added to the database

## Integration with Lens Pricing System

The lens thicknesses are a key component in the lens pricing system, used in:

- `LensSelector` component for thickness selection
- Pricing calculations through the lens pricing combinations
- Order processing and invoicing

When updating this system, make sure to update any related lens pricing combinations to maintain consistency in the application's pricing model.
