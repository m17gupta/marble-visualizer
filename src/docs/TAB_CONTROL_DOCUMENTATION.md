# Tab Control System Documentation

## Overview
This system provides a centralized way to control tabs using Redux state management and custom hooks.

## Components

### 1. InspirationTabSlice (Redux Slice)
- **Location**: `src/redux/slices/InspirationalSlice/InspirationTabSlice.ts`
- **Purpose**: Manages the global state for inspiration tabs
- **State Variables**:
  - `currentInspTab: string` - Currently active tab
  - `isLoading: boolean` - Loading state
  - `error: string | null` - Error state

### 2. useInspirationTab Hook
- **Location**: `src/hooks/useInspirationTab.ts`
- **Purpose**: Custom hook for managing tab state and interactions
- **Returns**:
  - `currentTab` - Current active tab value
  - `handleTabChange` - Function to change tabs
  - `changeTab` - Programmatic tab change function
  - `isTabActive` - Function to check if a tab is active

### 3. StudioStyleTabs Component
- **Location**: `src/components/studio/studioMainTabs/StudioStyleTabs.tsx`
- **Purpose**: Main tab container component
- **Features**:
  - Controlled tabs using Redux state
  - Dynamic tab rendering
  - Conditional styling based on active state

## Usage Examples

### Basic Tab Control
```tsx
import { useInspirationTab } from "@/hooks/useInspirationTab";

function MyComponent() {
  const { currentTab, handleTabChange, isTabActive } = useInspirationTab("chat");
  
  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      {/* Tab content */}
    </Tabs>
  );
}
```

### Programmatic Tab Control
```tsx
function TabController() {
  const { changeTab, isTabActive } = useInspirationTab();
  
  const switchToHistory = () => {
    changeTab("history");
  };
  
  return (
    <button onClick={switchToHistory}>
      Go to History {isTabActive("history") && "(Current)"}
    </button>
  );
}
```

### Conditional Rendering Based on Tab
```tsx
function ConditionalComponent() {
  const { isTabActive } = useInspirationTab();
  
  return (
    <div>
      {isTabActive("chat") && <ChatSpecificComponent />}
      {isTabActive("renovation") && <RenovationTools />}
      {isTabActive("history") && <HistoryViewer />}
    </div>
  );
}
```

## Tab Configuration
The current tab system supports three tabs:
- `"chat"` - Chat interface
- `"renovation"` - Play/renovation tools
- `"history"` - History viewer

## Key Features

### 1. Centralized State Management
- All tab state is managed in Redux
- Consistent across all components
- Persists across component re-renders

### 2. Controlled Components
- Tabs are fully controlled by state
- No uncontrolled state leaks
- Predictable behavior

### 3. Programmatic Control
- Change tabs from any component
- Useful for navigation flows
- Event-driven tab switching

### 4. Conditional Logic
- Check active tab state anywhere
- Conditional rendering support
- Dynamic styling based on state

## Best Practices

1. **Use the Hook**: Always use `useInspirationTab` instead of directly accessing Redux
2. **Default Values**: Provide sensible defaults for tab initialization
3. **Type Safety**: Use TypeScript for tab value validation
4. **Error Handling**: Handle loading and error states appropriately
5. **Performance**: Use React.memo for heavy tab content components

## Advanced Usage

### Custom Tab Validation
```tsx
const validTabs = ["chat", "renovation", "history"] as const;
type TabValue = typeof validTabs[number];

function validateTab(tab: string): tab is TabValue {
  return validTabs.includes(tab as TabValue);
}
```

### Tab History Management
```tsx
const [tabHistory, setTabHistory] = useState<string[]>([]);

const handleTabChangeWithHistory = (newTab: string) => {
  setTabHistory(prev => [...prev, currentTab]);
  handleTabChange(newTab);
};

const goBack = () => {
  const previousTab = tabHistory[tabHistory.length - 1];
  if (previousTab) {
    setTabHistory(prev => prev.slice(0, -1));
    handleTabChange(previousTab);
  }
};
```

## Troubleshooting

### Common Issues
1. **Tab not changing**: Check if `onValueChange` is properly connected
2. **State not persisting**: Ensure Redux store is properly configured
3. **Multiple instances**: Each component using the hook shares the same state

### Debugging
- Use Redux DevTools to monitor state changes
- Add console logs in the custom hook
- Check component re-render patterns
