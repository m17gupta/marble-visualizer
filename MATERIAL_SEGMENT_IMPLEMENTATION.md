# Material Segment Implementation

This implementation provides a complete solution for managing material segments in your React application with Redux Toolkit and TypeScript.

## Files Created

### 1. Model Layer
- **`src/models/materialSegment/MaterialSegmentModel.ts`** - TypeScript interfaces and types
- **`src/models/materialSegment/index.ts`** - Export file for the model

### 2. Redux Layer
- **`src/redux/slices/materialSegmentSlice.ts`** - Redux Toolkit slice with async thunks
- Updated **`src/redux/store.ts`** - Added material segment slice to the store

### 3. Service Layer
- **`src/services/materialSegment/materialSegmentApi.ts`** - API service functions
- **`src/services/materialSegment/index.ts`** - Export file for the service

### 4. Component Layer
- **`src/components/MaterialSegmentList.tsx`** - Example usage component

## Database Schema Mapping

The implementation maps to your database columns:

```sql
CREATE TABLE material_segments (
  id INTEGER PRIMARY KEY,
  name CHARACTER VARYING,
  color CHARACTER VARYING,
  color_code CHARACTER VARYING,
  icon TEXT,
  icon_svg TEXT,
  index INTEGER,
  is_active BOOLEAN,
  is_visible BOOLEAN,
  description TEXT,
  short_code CHARACTER VARYING,
  categories TEXT[], -- JSON array
  gallery TEXT[]     -- JSON array
);
```

## API Endpoints

The service expects these REST API endpoints:

- `GET /material-segments` - Fetch all segments (with optional filters)
- `GET /material-segments/:id` - Fetch single segment
- `POST /material-segments` - Create new segment
- `PUT /material-segments/:id` - Update segment
- `DELETE /material-segments/:id` - Delete segment
- `POST /material-segments/:id/duplicate` - Duplicate segment
- `PATCH /material-segments/:id/toggle-visibility` - Toggle visibility
- `PATCH /material-segments/:id/toggle-active` - Toggle active status
- `PATCH /material-segments/reorder` - Reorder segments
- `POST /material-segments/:id/gallery` - Add image to gallery
- `DELETE /material-segments/:id/gallery` - Remove image from gallery
- `GET /material-segments/search` - Search segments
- `GET /material-segments/category/:category` - Get by category
- `GET /material-segments/categories` - Get all categories
- `PATCH /material-segments/bulk-update` - Bulk update
- `DELETE /material-segments/bulk-delete` - Bulk delete

## Usage Examples

### 1. Basic Usage in Component

```tsx
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchMaterialSegments, selectSegment } from '@/redux/slices/materialSegmentSlice';

function MyComponent() {
  const dispatch = useDispatch<AppDispatch>();
  const { segments, loading, selectedSegmentId } = useSelector(
    (state: RootState) => state.materialSegments
  );

  useEffect(() => {
    dispatch(fetchMaterialSegments());
  }, [dispatch]);

  const handleSelectSegment = (id: number) => {
    dispatch(selectSegment(id));
  };

  return (
    <div>
      {segments.map(segment => (
        <div key={segment.id} onClick={() => handleSelectSegment(segment.id)}>
          {segment.name}
        </div>
      ))}
    </div>
  );
}
```

### 2. Creating a New Segment

```tsx
import { createMaterialSegment } from '@/redux/slices/materialSegmentSlice';

const handleCreate = async () => {
  try {
    await dispatch(createMaterialSegment({
      name: 'New Segment',
      color: '#FF0000',
      color_code: '#FF0000',
      short_code: 'NS',
      index: 0,
      is_active: true,
      is_visible: true,
      description: 'A new material segment',
      categories: ['category1'],
      gallery: []
    })).unwrap();
  } catch (error) {
    console.error('Failed to create segment:', error);
  }
};
```

### 3. Filtering Segments

```tsx
import { setFilters, fetchMaterialSegments } from '@/redux/slices/materialSegmentSlice';

const handleFilter = () => {
  const filters = {
    is_active: true,
    categories: ['category1', 'category2'],
    search: 'search term'
  };
  
  dispatch(setFilters(filters));
  dispatch(fetchMaterialSegments(filters));
};
```

### 4. Direct API Usage

```tsx
import { materialSegmentService } from '@/services/materialSegment';

// Fetch all segments
const segments = await materialSegmentService.fetchAll();

// Create a segment
const newSegment = await materialSegmentService.create({
  name: 'Test Segment',
  color: '#00FF00',
  color_code: '#00FF00',
  short_code: 'TS',
  index: 1
});

// Update a segment
const updatedSegment = await materialSegmentService.update({
  id: 1,
  name: 'Updated Name'
});

// Delete a segment
await materialSegmentService.delete(1);
```

## Features Included

### Redux Slice Features
- ✅ Fetch all segments with filtering
- ✅ Fetch single segment by ID
- ✅ Create new segments
- ✅ Update existing segments
- ✅ Delete segments
- ✅ Duplicate segments
- ✅ Toggle visibility/active status
- ✅ Reorder segments
- ✅ Gallery management
- ✅ Search functionality
- ✅ Category filtering
- ✅ Bulk operations
- ✅ Local state updates
- ✅ Error handling
- ✅ Loading states

### API Service Features
- ✅ RESTful API integration
- ✅ Type-safe requests/responses
- ✅ Error handling with descriptive messages
- ✅ Query parameter handling
- ✅ Bulk operations support
- ✅ Search and filtering
- ✅ Gallery management

### TypeScript Support
- ✅ Fully typed interfaces
- ✅ Request/response type definitions
- ✅ Filter type definitions
- ✅ Redux state typing

## Integration with Canvas Editor

To integrate with your `CanvasEditor`, you can:

1. **Import the slice in your canvas component:**
```tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const { segments } = useSelector((state: RootState) => state.materialSegments);
```

2. **Use segments for material selection:**
```tsx
const handleMaterialSelect = (segmentId: number) => {
  const selectedSegment = segments.find(s => s.id === segmentId);
  if (selectedSegment) {
    // Apply the segment's color/texture to the canvas element
    applyMaterialToCanvasElement(selectedSegment);
  }
};
```

3. **Connect with your existing segments slice:**
```tsx
// In your canvas editor, when a segment is created
const newCanvasSegment = {
  // ... existing segment properties
  materialSegmentId: selectedMaterialSegment.id,
  fillColor: selectedMaterialSegment.color
};
```

## Next Steps

1. **Backend Implementation**: Implement the corresponding REST API endpoints
2. **Testing**: Add unit tests for the Redux slice and API service
3. **UI Polish**: Enhance the MaterialSegmentList component with more features
4. **Integration**: Connect with your existing canvas and materials system
5. **Validation**: Add form validation for create/update operations
6. **Permissions**: Add role-based access control if needed

## Dependencies

Make sure you have these packages installed:
- `@reduxjs/toolkit`
- `react-redux`
- `framer-motion` (for animations)
- Your existing UI component library

The implementation is now ready for use and can be extended based on your specific requirements!
