<!-- # Segment Information Components

This folder contains components for displaying detailed segment information in a structured, user-friendly format.

## Components

### SegmentInfoPanel
Main container component that displays all segment information with tabs for different views:
- **Information**: Editable fields with copy functionality
- **JSON Data**: Raw JSON representation of the segment
- **Ground Truth Value**: Ground truth data for the segment

### SegmentField  
Reusable component for displaying individual segment fields with:
- Inline editing capability
- Copy to clipboard functionality
- Hover effects and visual feedback

### SegmentImage
Component for displaying segment images with:
- URL display
- Image preview
- Error handling for failed image loads
- Responsive design

### SegmentTabs
Tab navigation component for switching between different views:
- Information
- JSON Data  
- Ground Truth Value

## Usage Example

```tsx
import { SegmentInfoPanel, SegmentData } from '@/components/segmentInfo';

const segmentData: SegmentData = {
  id: 'WL1',
  name: 'WL1 - Wall1',
  image: 'https://example.com/image.jpg',
  group: 'Wall1',
  segType: 'Wall',
  label: 'Wall1',
  segName: 'Wall1',
  segShort: 'WL1',
  segDimensionPixel: '',
  perimeterPixel: '926',
  annotationType: 'manual',
  annotation: '129.89, 311.85, 466.41, 307.41, 303.53, 185.71',
  bbAnnotationInt: '129, 185, 466, 311',
  jsonData: { /* additional data */ },
  groundTruthValue: { /* ground truth data */ }
};

function MyComponent() {
  const [showSegmentInfo, setShowSegmentInfo] = useState(false);
  
  const handleUpdate = (field: string, value: any) => {
    // Handle field updates
    console.log(`Updated ${field} to:`, value);
  };

  return (
    <>
      <button onClick={() => setShowSegmentInfo(true)}>
        Show Segment Info
      </button>
      
      {showSegmentInfo && (
        <SegmentInfoPanel
          segment={segmentData}
          onUpdate={handleUpdate}
          onClose={() => setShowSegmentInfo(false)}
        />
      )}
    </>
  );
}
```

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Editable Fields**: Click edit icon to modify field values
- **Copy Functionality**: Copy any field value to clipboard
- **Tab Navigation**: Switch between Information, JSON, and Ground Truth views
- **Image Display**: Show segment images with fallback for failed loads
- **Modal Interface**: Full-screen overlay with close functionality
- **TypeScript Support**: Full type safety with comprehensive interfaces -->