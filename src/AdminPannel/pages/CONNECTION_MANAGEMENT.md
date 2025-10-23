# Brand Connection Management Implementation

## Overview

Implemented a robust connection management system for Material Brands that allows linking brands with material categories and segments through the `product_brand_categories` table.

## Features

### 1. Conditional UI Based on Data Existence

- **Add Mode**: Shows "Add Connection" button when creating a new brand
- **Edit Mode - No Connections**: Shows "Add Connection" button if no connections exist in database
- **Edit Mode - With Connections**: Automatically loads and displays existing connections

### 2. Connection Structure

Each connection in `product_brand_categories` table contains:

```typescript
{
  id?: number;
  brand_id: number;
  category_id: number | null;
  material_segment_id: number | null;
}
```

### 3. User Interface

#### Add Connection Button (Empty State)

- Displays when no connections exist
- Large dashed border box with Plus icon
- Hover effects for better UX
- Descriptive text explaining the action

#### Connection Cards

- Each connection displayed in a separate card
- Numbered for easy reference (Connection 1, Connection 2, etc.)
- Remove button (X) to delete individual connections
- Two dropdown selects:
  - Material Category (optional)
  - Material Segment (optional)

#### Add Another Connection Button

- Appears below existing connections
- Allows adding multiple category-segment pairs
- Dashed border with hover effects

### 4. Key Functions

#### `loadConnections` (useEffect)

```typescript
// Automatically loads when editing a brand
// Queries product_brand_categories table by brand_id
// Sets connections state and showAddConnection flag
```

#### `handleAddConnection`

```typescript
// Adds a new empty connection to the array
// Allows building multiple connections before saving
```

#### `handleRemoveConnection`

```typescript
// Removes a connection by index
// Updates UI immediately
```

#### `handleConnectionChange`

```typescript
// Updates category_id or material_segment_id for a specific connection
// Validates and converts values properly
```

#### `saveConnections`

```typescript
// Deletes existing connections for the brand
// Filters out empty connections (both fields null)
// Bulk inserts valid connections to database
// Shows success/error toast notifications
```

### 5. Data Flow

#### Adding a New Brand

1. User fills brand details (left column)
2. Clicks "Add Connection" button (right column)
3. Connection card appears with dropdowns
4. User selects category and/or segment
5. Can add multiple connections
6. On submit: Brand saved → Connections saved with brand_id

#### Editing an Existing Brand

1. Edit action loads brand with `product_brand_categories(*)`
2. useEffect detects existing connections
3. Populates connections array from database
4. Displays connection cards with current values
5. User can modify, add, or remove connections
6. On submit: Brand updated → Old connections deleted → New connections saved

### 6. Validation

- At least one field (category_id OR material_segment_id) must be selected
- Empty connections are filtered out before saving
- Database errors are caught and displayed to user

### 7. UI/UX Improvements

- Clean two-column layout (Brand Info | Connections)
- Consistent styling with Tailwind CSS
- Hover states and transitions
- Clear visual hierarchy
- Responsive design
- Toast notifications for feedback

## Technical Details

### State Management

```typescript
const [connections, setConnections] = useState<Connection[]>([]);
const [showAddConnection, setShowAddConnection] = useState<boolean>(false);
```

### Database Query (Loading)

```typescript
const { data, error } = await supabase
  .from("product_brand_categories")
  .select("*")
  .eq("brand_id", currentBrand.id);
```

### Database Operations (Saving)

```typescript
// Delete existing
await supabase
  .from("product_brand_categories")
  .delete()
  .eq("brand_id", brandId);

// Insert new
await supabase.from("product_brand_categories").insert(connectionsToInsert);
```

### Integration with Existing Code

- Fetches categories via `adminFetchCategory`
- Fetches segments via `adminFetchMaterialSegments`
- Uses existing Redux state for data
- Integrates with existing form submission flow

## Benefits

1. **Flexibility**: Multiple connections per brand
2. **User-Friendly**: Intuitive add/remove interface
3. **Data Integrity**: Proper validation and error handling
4. **Performance**: Efficient bulk operations
5. **Maintainability**: Clean, well-structured code
6. **Scalability**: Easy to extend for additional fields

## Future Enhancements (Optional)

- Drag-and-drop reordering of connections
- Bulk edit mode for multiple connections
- Connection templates for quick setup
- Visual indicators for incomplete connections
- Search/filter in category/segment dropdowns
