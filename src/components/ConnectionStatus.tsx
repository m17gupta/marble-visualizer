import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectionTest } from '@/utils/connectionTest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

interface TestResult {
  name: string;
  success: boolean;
  message: string;
  details?: any;
}

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className }: ConnectionStatusProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);
  const [overallStatus, setOverallStatus] = useState<'unknown' | 'success' | 'error'>('unknown');

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      const testResults = await ConnectionTest.runAllTests();
      setResults(testResults.results);
      setOverallStatus(testResults.success ? 'success' : 'error');
      setLastRunTime(new Date());
    } catch (error) {
      setOverallStatus('error');
      setResults([{
        name: 'Connection Test',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: { error }
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  // Auto-run tests on mount
  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = () => {
    if (isRunning) return <Loader2 className="h-4 w-4 animate-spin" />;
    
    switch (overallStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <WifiOff className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (overallStatus) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getTestIcon = (testName: string) => {
    switch (testName) {
      case 'Basic Connection':
        return <Wifi className="h-4 w-4" />;
      case 'Database Schema':
        return <Database className="h-4 w-4" />;
      case 'Authentication':
        return <Shield className="h-4 w-4" />;
      case 'Row Level Security':
        return <Shield className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className={`cursor-pointer transition-colors hover:bg-muted/50 ${getStatusColor()}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <CardTitle className="text-sm font-medium">
                    Supabase Connection Status
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {isRunning ? 'Running tests...' : 
                     lastRunTime ? `Last checked: ${lastRunTime.toLocaleTimeString()}` : 
                     'Click to test connection'}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={overallStatus === 'success' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {overallStatus === 'success' ? 'Connected' : 
                   overallStatus === 'error' ? 'Error' : 'Unknown'}
                </Badge>
                
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runTests}
                  disabled={isRunning}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Testing...' : 'Run Tests'}</span>
                </Button>
                
                {results.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {results.filter(r => r.success).length}/{results.length} tests passed
                  </div>
                )}
              </div>

              {/* Test Results */}
              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {results.map((result, index) => (
                      <motion.div
                        key={result.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border ${
                          result.success 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded ${
                            result.success ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {getTestIcon(result.name)}
                              <h4 className="text-sm font-medium">{result.name}</h4>
                            </div>
                            
                            <p className={`text-xs ${
                              result.success ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {result.message}
                            </p>
                            
                            {/* Show details for failed tests */}
                            {!result.success && result.details && (
                              <details className="mt-2">
                                <summary className="text-xs cursor-pointer hover:text-red-800">
                                  Show details
                                </summary>
                                <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                                  {JSON.stringify(result.details, null, 2)}
                                </pre>
                              </details>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Environment Info */}
              <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                <div>Environment: {import.meta.env.VITE_APP_ENV || 'development'}</div>
                <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Configured' : '✗ Missing'}</div>
                <div>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing'}</div>
              </div>

              {/* Configuration Alert */}
              {(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Supabase connection not configured. Please update your <code>.env</code> file with the correct values.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}