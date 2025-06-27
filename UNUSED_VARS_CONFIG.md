# Unused Variables/Imports Configuration

This project has been configured to handle unused variables and imports in a centralized way.

## Configuration Files Applied:

### 1. `.eslintrc.js`
- Disables `@typescript-eslint/no-unused-vars` warnings
- Disables `no-unused-vars` warnings  
- Disables `@typescript-eslint/no-unused-imports` warnings
- Applied to all `.ts` and `.tsx` files

### 2. `tsconfig.app.json`
- Set `noUnusedLocals: false`
- Set `noUnusedParameters: false`
- Prevents TypeScript compiler from showing unused variable errors

### 3. `.vscode/settings.json`
- Disables VS Code's built-in unused variable highlighting
- Prevents auto-removal of unused imports on save
- Customizes ESLint rule severities

### 4. `package.json` Scripts
- `npm run lint:fix` - Fix ESLint issues
- `npm run lint:no-unused` - Run lint ignoring unused vars
- `npm run build:no-lint` - Build without linting

## Usage:

### For Intentionally Unused Variables:
```typescript
// Use underscore prefix for intentionally unused vars
const _unusedVariable = someValue;

// Or add comment to suppress warning for specific lines
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unusedVariable = someValue;
```

### For Unused Imports:
Keep imports even if unused - they won't show warnings anymore.

```typescript
import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Share2, 
  // These won't show warnings even if unused
  Edit3, 
  Eye, 
  EyeOff,
} from 'lucide-react';
```

## Re-enabling Warnings (if needed):

To re-enable unused variable warnings in the future, modify `.eslintrc.js`:

```javascript
rules: {
  '@typescript-eslint/no-unused-vars': 'warn', // or 'error'
}
```

## File-Specific Overrides:

To enable warnings for specific files, add to `.eslintrc.js`:

```javascript
overrides: [
  {
    files: ['src/utils/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error'
    }
  }
]
```
