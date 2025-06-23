import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDispatch, RootState } from '@/redux/store';
import { bulkImportSwatches, Swatch } from '@/redux/slices/swatchSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Upload,
  FileText,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  FileJson,
  FileSpreadsheet,
  Trash2,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImportSwatch extends Omit<Swatch, '_id' | 'slug' | 'created_at' | 'updated_at'> {
  _tempId: string;
  _status: 'valid' | 'invalid' | 'warning';
  _errors: string[];
  _warnings: string[];
  _selected: boolean;
}

interface ValidationResult {
  valid: ImportSwatch[];
  invalid: ImportSwatch[];
  warnings: ImportSwatch[];
}

export function SwatchImportPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<ImportSwatch[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPreview, setShowPreview] = useState(false);
  const [editingItem, setEditingItem] = useState<ImportSwatch | null>(null);
  const [selectAll, setSelectAll] = useState(true);

  // Check if user has permission to import
  const canImport = user?.role === 'admin' || user?.role === 'vendor';

  if (!canImport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Access Denied</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  You need admin or vendor permissions to import swatches.
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/swatchbook')}
                  className="w-full"
                >
                  Go to SwatchBook
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="w-full"
                >
                  Login with Different Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const validTypes = ['text/csv', 'application/json', '.csv', '.json'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    
    if (!validTypes.includes(file.type) && !['csv', 'json'].includes(fileExtension || '')) {
      toast.error('Please upload a CSV or JSON file');
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const text = await file.text();
      let parsedData: any[] = [];

      if (file.type === 'text/csv' || fileExtension === 'csv') {
        parsedData = parseCSV(text);
      } else {
        parsedData = JSON.parse(text);
      }

      if (!Array.isArray(parsedData)) {
        throw new Error('File must contain an array of swatch objects');
      }

      const processedData = parsedData.map((item, index) => ({
        ...item,
        _tempId: `temp_${index}`,
        _status: 'valid' as const,
        _errors: [],
        _warnings: [],
        _selected: true,
      }));

      setImportData(processedData);
      validateData(processedData);
      toast.success(`Successfully parsed ${parsedData.length} swatches from ${file.name}`);
    } catch (error) {
      toast.error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row');

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const obj: any = {};
      
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        // Handle nested objects and arrays
        if (header.includes('.')) {
          const keys = header.split('.');
          let current = obj;
          for (let j = 0; j < keys.length - 1; j++) {
            if (!current[keys[j]]) current[keys[j]] = {};
            current = current[keys[j]];
          }
          current[keys[keys.length - 1]] = parseValue(value);
        } else if (header.endsWith('[]')) {
          const key = header.replace('[]', '');
          obj[key] = value ? value.split('|').map(v => v.trim()) : [];
        } else {
          obj[header] = parseValue(value);
        }
      });
      
      data.push(obj);
    }

    return data;
  };

  const parseValue = (value: string): any => {
    if (value === '') return '';
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(Number(value)) && value !== '') return Number(value);
    return value;
  };

  const validateData = (data: ImportSwatch[]) => {
    const validated = data.map(item => {
      const errors: string[] = [];
      const warnings: string[] = [];

      // Required fields validation
      if (!item.title) errors.push('Title is required');
      if (!item.description) errors.push('Description is required');
      if (!item.category) errors.push('Category is required');
      if (!item.brand) errors.push('Brand is required');
      if (!item.sku) errors.push('SKU is required');
      if (!item.color?.hex) errors.push('Color hex is required');
      if (!item.finish) errors.push('Finish is required');
      if (!item.coating_type) errors.push('Coating type is required');

      // Format validation
      if (item.color?.hex && !/^#[0-9A-F]{6}$/i.test(item.color.hex)) {
        errors.push('Invalid hex color format');
      }

      if (item.color?.lrv && (item.color.lrv < 0 || item.color.lrv > 100)) {
        errors.push('LRV must be between 0 and 100');
      }

      if (item.pricing?.per_gallon && item.pricing.per_gallon <= 0) {
        errors.push('Price per gallon must be greater than 0');
      }

      // Warnings
      if (!item.segment_types || item.segment_types.length === 0) {
        warnings.push('No segment types specified');
      }

      if (!item.tags || item.tags.length === 0) {
        warnings.push('No tags specified');
      }

      const status = errors.length > 0 ? 'invalid' : warnings.length > 0 ? 'warning' : 'valid';

      return {
        ...item,
        _status: status,
        _errors: errors,
        _warnings: warnings,
      };
    });

    const result: ValidationResult = {
      valid: validated.filter(item => item._status === 'valid'),
      invalid: validated.filter(item => item._status === 'invalid'),
      warnings: validated.filter(item => item._status === 'warning'),
    };

    setValidationResult(result);
    setImportData(validated);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setImportData(prev => prev.map(item => ({
      ...item,
      _selected: checked && item._status !== 'invalid'
    })));
  };

  const handleSelectItem = (tempId: string, checked: boolean) => {
    setImportData(prev => prev.map(item =>
      item._tempId === tempId ? { ...item, _selected: checked } : item
    ));
  };

  const handleEditItem = (item: ImportSwatch) => {
    setEditingItem({ ...item });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    setImportData(prev => prev.map(item =>
      item._tempId === editingItem._tempId ? editingItem : item
    ));

    // Re-validate the edited item
    validateData(importData.map(item =>
      item._tempId === editingItem._tempId ? editingItem : item
    ));

    setEditingItem(null);
    toast.success('Item updated successfully');
  };

  const handleDeleteItem = (tempId: string) => {
    setImportData(prev => prev.filter(item => item._tempId !== tempId));
    toast.success('Item removed from import list');
  };

  const handleImport = async () => {
    const selectedItems = importData.filter(item => item._selected && item._status !== 'invalid');
    
    if (selectedItems.length === 0) {
      toast.error('No valid items selected for import');
      return;
    }

    setIsImporting(true);

    try {
      // Convert to proper swatch format
      const swatchesToImport = selectedItems.map(item => {
        const { _tempId, _status, _errors, _warnings, _selected, ...swatch } = item;
        return {
          ...swatch,
          created_by: user?.id || 'unknown',
          is_favorite: false,
        };
      });

      const result = await dispatch(bulkImportSwatches(swatchesToImport));
      
      if (bulkImportSwatches.fulfilled.match(result)) {
        toast.success(`Successfully imported ${selectedItems.length} swatches!`);
        
        // Save unfinished uploads to localStorage for recovery
        const unselectedItems = importData.filter(item => !item._selected || item._status === 'invalid');
        if (unselectedItems.length > 0) {
          localStorage.setItem('swatch_import_draft', JSON.stringify(unselectedItems));
        } else {
          localStorage.removeItem('swatch_import_draft');
        }
        
        navigate('/swatchbook');
      }
    } catch (error) {
      toast.error('Failed to import swatches');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = (format: 'csv' | 'json') => {
    const template = {
      title: 'Arctic White',
      description: 'A crisp, clean white with subtle cool undertones',
      category: 'Interior',
      brand: 'Premium Paints',
      style: 'Modern',
      sku: 'PP-AW-001',
      'color.hex': '#F8F9FA',
      'color.rgb': 'rgb(248, 249, 250)',
      'color.lrv': 92,
      finish: 'Eggshell',
      coating_type: 'Latex',
      dry_time_touch: '2 hours',
      dry_time_recoat: '4 hours',
      'application.recommended_substrates[]': 'Drywall|Plaster|Wood',
      'application.coverage_sqft_per_gal': 400,
      'pricing.per_gallon': 65.99,
      'pricing.per_sqft': 0.16,
      'container_sizes[]': '1 Quart|1 Gallon|5 Gallon',
      'certifications[]': 'Low VOC|GREENGUARD Gold',
      'tags[]': 'neutral|bright|clean',
      'segment_types[]': 'walls|ceiling|trim',
    };

    if (format === 'csv') {
      const headers = Object.keys(template).join(',');
      const values = Object.values(template).join(',');
      const csv = `${headers}\n${values}`;
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'swatch_template.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const jsonTemplate = [{
        title: 'Arctic White',
        description: 'A crisp, clean white with subtle cool undertones',
        category: 'Interior',
        brand: 'Premium Paints',
        style: 'Modern',
        sku: 'PP-AW-001',
        color: {
          hex: '#F8F9FA',
          rgb: 'rgb(248, 249, 250)',
          lrv: 92,
        },
        finish: 'Eggshell',
        coating_type: 'Latex',
        dry_time_touch: '2 hours',
        dry_time_recoat: '4 hours',
        application: {
          recommended_substrates: ['Drywall', 'Plaster', 'Wood'],
          coverage_sqft_per_gal: 400,
        },
        pricing: {
          per_gallon: 65.99,
          per_sqft: 0.16,
        },
        container_sizes: ['1 Quart', '1 Gallon', '5 Gallon'],
        certifications: ['Low VOC', 'GREENGUARD Gold'],
        tags: ['neutral', 'bright', 'clean'],
        segment_types: ['walls', 'ceiling', 'trim'],
      }];
      
      const blob = new Blob([JSON.stringify(jsonTemplate, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'swatch_template.json';
      a.click();
      URL.revokeObjectURL(url);
    }
    
    toast.success(`${format.toUpperCase()} template downloaded`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'invalid':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const paginatedData = importData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(importData.length / itemsPerPage);
  const selectedCount = importData.filter(item => item._selected).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/swatchbook')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to SwatchBook</span>
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Import Swatches</h1>
            <p className="text-muted-foreground">
              Upload multiple swatches via CSV or JSON file
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadTemplate('csv')}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadTemplate('json')}
          >
            <FileJson className="h-4 w-4 mr-2" />
            JSON Template
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      {!uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload File
            </CardTitle>
            <CardDescription>
              Upload a CSV or JSON file containing swatch data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <motion.div
                animate={{ scale: dragActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                    <div>
                      <h3 className="text-lg font-semibold">Processing file...</h3>
                      <p className="text-muted-foreground">
                        Please wait while we parse your data
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center space-x-4">
                      <div className="p-3 rounded-full bg-blue-100">
                        <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="p-3 rounded-full bg-green-100">
                        <FileJson className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Drop your file here or click to browse
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Supports CSV and JSON formats
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <span>Max file size: 10MB</span>
                        <span>•</span>
                        <span>Supported: .csv, .json</span>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,text/csv,application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Validation Results
            </CardTitle>
            <CardDescription>
              Review the validation status of your imported data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-3 p-4 border rounded-lg bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {validationResult.valid.length}
                  </p>
                  <p className="text-sm text-green-700">Valid Items</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg bg-yellow-50">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {validationResult.warnings.length}
                  </p>
                  <p className="text-sm text-yellow-700">Warnings</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg bg-red-50">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {validationResult.invalid.length}
                  </p>
                  <p className="text-sm text-red-700">Invalid Items</p>
                </div>
              </div>
            </div>

            {validationResult.invalid.length > 0 && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {validationResult.invalid.length} items have validation errors and cannot be imported.
                  Please fix the errors or remove these items before proceeding.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Data Preview */}
      {importData.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Data Preview
                </CardTitle>
                <CardDescription>
                  Review and edit your swatch data before importing
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Preview
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Selection Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label className="text-sm">Select All Valid Items</Label>
                </div>
                <Badge variant="secondary">
                  {selectedCount} of {importData.length} selected
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            </div>

            {/* Data Table */}
            <div className="border rounded-lg">
              <ScrollArea className="h-96">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Segment Types</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {paginatedData.map((item, index) => (
                        <motion.tr
                          key={item._tempId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.2, delay: index * 0.02 }}
                          className={cn(
                            'border-b',
                            item._status === 'invalid' && 'bg-red-50',
                            item._status === 'warning' && 'bg-yellow-50'
                          )}
                        >
                          <TableCell>
                            <Checkbox
                              checked={item._selected}
                              onCheckedChange={(checked) => 
                                handleSelectItem(item._tempId, checked as boolean)
                              }
                              disabled={item._status === 'invalid'}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(item._status)}
                              <Badge className={getStatusColor(item._status)} variant="outline">
                                {item._status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.title || <span className="text-red-500">Missing</span>}
                          </TableCell>
                          <TableCell>
                            {item.brand || <span className="text-red-500">Missing</span>}
                          </TableCell>
                          <TableCell>
                            {item.category || <span className="text-red-500">Missing</span>}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {item.color?.hex ? (
                                <>
                                  <div
                                    className="w-6 h-6 rounded border"
                                    style={{ backgroundColor: item.color.hex }}
                                  />
                                  <code className="text-xs">{item.color.hex}</code>
                                </>
                              ) : (
                                <span className="text-red-500">Missing</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.segment_types?.slice(0, 2).map((type) => (
                                <Badge key={type} variant="secondary" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                              {item.segment_types?.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{item.segment_types.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditItem(item)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteItem(item._tempId)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Actions */}
      {importData.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Ready to import {selectedCount} swatches
                </p>
                <p className="text-xs text-muted-foreground">
                  Invalid items will be skipped automatically
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedFile(null);
                    setImportData([]);
                    setValidationResult(null);
                  }}
                  disabled={isImporting}
                >
                  Start Over
                </Button>
                
                <Button
                  onClick={handleImport}
                  disabled={selectedCount === 0 || isImporting}
                  className="min-w-32"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import {selectedCount} Swatches
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Swatch</DialogTitle>
            <DialogDescription>
              Make changes to the swatch data before importing
            </DialogDescription>
          </DialogHeader>
          
          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, title: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Input
                    id="edit-brand"
                    value={editingItem.brand}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, brand: e.target.value } : null)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem(prev => prev ? { ...prev, category: e.target.value } : null)}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-hex">Hex Color</Label>
                  <Input
                    id="edit-hex"
                    value={editingItem.color?.hex || ''}
                    onChange={(e) => setEditingItem(prev => prev ? { 
                      ...prev, 
                      color: { ...prev.color, hex: e.target.value } 
                    } : null)}
                  />
                </div>
              </div>

              {/* Show validation errors for this item */}
              {editingItem._errors.length > 0 && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {editingItem._errors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}