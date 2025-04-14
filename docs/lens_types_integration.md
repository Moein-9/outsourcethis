# Lens Types Management - Supabase Integration

This document outlines the implementation of the Lens Types Management system with Supabase as the backend database.

## Database Schema

The lens types are stored in the `lens_types` table with the following schema:

```sql
CREATE TABLE public.lens_types (
  lens_id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

## Implementation Details

### Service Layer

The integration is implemented through a service layer in `src/services/lensTypeService.ts`, which provides the following functions:

- `getAllLensTypes()`: Fetches all lens types from the database
- `addLensType()`: Adds a new lens type to the database
- `updateLensType()`: Updates an existing lens type
- `deleteLensType()`: Removes a lens type from the database

### Component Integration

The `LensTypeManager.tsx` component has been updated to:

1. Use the service layer functions instead of local storage
2. Handle loading states for better UX
3. Implement proper error handling with toast notifications
4. Add loading indicators for async operations

## Type Definitions

The lens type has the following structure:

```typescript
export interface LensType {
  lens_id: string;
  name: string;
  type: "distance" | "reading" | "progressive" | "bifocal" | "sunglasses";
  created_at?: string;
}
```

## Setup Instructions

1. Run the SQL script located at `sql/lens_types_setup.sql` in your Supabase SQL Editor
2. The script will:
   - Create the `lens_types` table
   - Set up Row Level Security (RLS) policies
   - Add sample lens types data

## Usage Notes

- Lens types are categorized as: distance, reading, progressive, bifocal, or sunglasses
- The UI displays lens types grouped by category for easier management
- Each lens type can be edited or deleted through the UI
- New lens types can be added through the "Add Lens" button

## Error Handling

The implementation includes comprehensive error handling for:

- Failed data fetching
- Network errors during create/update/delete operations
- Input validation
