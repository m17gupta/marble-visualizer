# Admin Panel

A comprehensive admin dashboard with sidebar navigation, data tables, charts, and various management interfaces.

## Components

### Main Components
- **AdminPanel**: Main container component with sidebar and content area
- **Sidebar**: Navigation sidebar with menu items matching the design

### Shared Components
- **MetricCard**: Reusable metric display cards with trends and changes
- **DataTable**: Feature-rich table component with search, pagination, and actions

### Chart Components
- **LineChart**: SVG-based line chart for trend visualization
- **BarChart**: Horizontal bar chart for comparing values
- **PieChart**: Pie chart with legend for showing distributions

### Pages
- **Dashboard**: Overview with metrics, charts, and activity feed
- **Analytics**: Detailed analytics with page performance and user behavior
- **Projects**: Project management with status tracking and timelines
- **Team**: Team member management with roles and activity
- **DataLibrary**: Data source management and quality monitoring
- **Reports**: Report generation and download management

## Usage

```tsx
import { AdminPanel } from './AdminPannel';

function App() {
  return (
    <div className="h-screen">
      <AdminPanel />
    </div>
  );
}
```

## Features

- **Responsive Design**: Works on desktop and mobile devices
- **Search & Filtering**: All tables include search functionality
- **Pagination**: Automatic pagination for large datasets
- **Interactive Charts**: Hover effects and tooltips
- **Real-time Updates**: Data can be easily updated via props
- **Customizable**: All components accept custom styling

## Styling

Built with Tailwind CSS for consistent and customizable styling. All components follow the design system with:
- Consistent spacing and typography
- Color-coded status indicators
- Hover and focus states
- Responsive breakpoints