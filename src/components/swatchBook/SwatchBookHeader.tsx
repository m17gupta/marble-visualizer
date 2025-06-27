import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

interface SwatchBookHeaderProps {
  canImport: boolean;
  onCreateClick: () => void;
  onImportClick: () => void;
}

export function SwatchBookHeader({ canImport, onCreateClick, onImportClick }: SwatchBookHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">SwatchBook</h1>
        <p className="text-muted-foreground">
          Discover and explore our comprehensive collection of paint swatches
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCreateClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Swatch
        </Button>
        
        {canImport && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onImportClick}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Swatches
          </Button>
        )}
      </div>
    </div>
  );
}
