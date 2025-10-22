# Demo Project Components

This folder contains the modularized components extracted from the `TryVisualizerPage` component. Each component has been separated for better reusability and maintainability.

## Components Overview

### 1. **HeaderSection.tsx**
Contains the main header section with:
- Page title and feature bullets
- Upload button functionality
- QR code button
- File input handling

**Props:**
- `onUpload`: Function to handle upload button click
- `onQROpen`: Function to open QR code dialog
- `fileInputRef`: Reference to the file input element
- `onFileChange`: Function to handle file selection

### 2. **PreviewBox.tsx**
Displays the room preview with floating demo markers.

**Props:**
- `imageSrc`: Optional image source URL (defaults to demo image)
- `alt`: Optional alt text for the image

### 3. **GalleryCard.tsx**
Individual gallery card component for displaying demo rooms.

**Props:**
- `src`: Image source URL
- `idx`: Index of the image
- `onUse`: Optional callback when "Use" button is clicked
- `onClick`: Optional callback when card is clicked
- `isSelected`: Boolean to show selection state

### 4. **DemoRoomsPanel.tsx**
Container for the demo rooms section including:
- Search functionality
- Gallery grid layout
- Integration with GalleryCard components

**Props:**
- `images`: Array of image URLs
- `selectedIdx`: Currently selected image index
- `onImageSelect`: Function called when an image is selected
- `onImageClick`: Function called when an image card is clicked
- `searchValue`: Current search input value
- `onSearchChange`: Function to handle search input changes

### 5. **QRDialog.tsx**
Modal dialog for displaying QR code for image uploads.

**Props:**
- `open`: Boolean to control dialog visibility
- `onOpenChange`: Function to handle dialog open/close state
- `qrCodeUrl`: Optional custom QR code URL

### 6. **DemoProjectHome.tsx**
Main container component that combines all the above components into a complete page layout. Can be used as an alternative to the original TryVisualizerPage.

**Props:**
- `onImageSelect`: Optional callback when an image is selected
- `onImageClick`: Optional callback when an image card is clicked
- `onFileUpload`: Optional callback when a file is uploaded

### 7. **GetDemoProject.tsx**
Redux-connected component for fetching demo projects (existing component).

## Supporting Files

### **types.ts**
TypeScript interfaces and type definitions for all components.

### **constants.ts**
Shared constants including:
- `DEMO_IMAGES`: Array of demo image URLs
- `CATEGORIES`: Category definitions (currently commented out in main usage)
- `DEFAULT_ROOM_IMAGE`: Default image URL
- `DEFAULT_QR_CODE_URL`: Default QR code URL

### **index.ts**
Barrel export file for easy importing of components and types.

## Usage Examples

### Basic Usage
```tsx
import { DemoProjectHome } from '@/components/demoProject';

function MyPage() {
  return (
    <DemoProjectHome
      onImageSelect={(idx) => console.log('Selected image:', idx)}
      onImageClick={() => navigate('/next-page')}
      onFileUpload={(file) => handleFileUpload(file)}
    />
  );
}
```

### Individual Component Usage
```tsx
import { 
  HeaderSection, 
  PreviewBox, 
  DemoRoomsPanel 
} from '@/components/demoProject';

function CustomLayout() {
  return (
    <div>
      <HeaderSection
        onUpload={() => {}}
        onQROpen={() => {}}
        fileInputRef={fileRef}
        onFileChange={handleFileChange}
      />
      <PreviewBox imageSrc="custom-image.jpg" />
      <DemoRoomsPanel
        images={customImages}
        selectedIdx={0}
        onImageSelect={handleSelect}
        onImageClick={handleClick}
      />
    </div>
  );
}
```

## Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be used individually or combined
3. **Maintainability**: Easy to modify individual parts without affecting others
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Testing**: Each component can be tested independently
6. **Flexibility**: Props allow customization of behavior and appearance