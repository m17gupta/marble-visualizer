import React, { useState } from 'react';
import { AuthAPI } from '@/services/authService/api/authApi';
import { Button } from '@/components/ui/button';

const DatabaseDebugger: React.FC = () => {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const debugTables = async () => {
    setLoading(true);
    try {
      const result = await AuthAPI.debugDatabaseTables();
      setResult(result);
      console.log('Debug result:', result);
    } catch (error) {
      console.error('Debug error:', error);
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testCurrentUser = async () => {
    setLoading(true);
    try {
      const currentUser = await AuthAPI.getCurrentUser();
      setResult({ currentUser });
      console.log('Current user:', currentUser);
    } catch (error) {
      console.error('Current user error:', error);
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testUserProfile = async () => {
    setLoading(true);
    try {
      const currentUser = await AuthAPI.getCurrentUser();
      if (currentUser?.user.id) {
        const profile = await AuthAPI.getUserProfileByUserId(currentUser.user.id);
        setResult({ profile, userId: currentUser.user.id });
        
      } else {
        setResult({ error: 'No current user found' });
      }
    } catch (error) {
      console.error('User profile error:', error);
      setResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Database Debugger</h3>
      
      <div className="flex gap-2 mb-4">
        <Button onClick={debugTables} disabled={loading}>
          Debug Tables
        </Button>
        <Button onClick={testCurrentUser} disabled={loading}>
          Test Current User
        </Button>
        <Button onClick={testUserProfile} disabled={loading}>
          Test User Profile
        </Button>
      </div>

      {loading && <div>Loading...</div>}
      
      {result && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Result:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DatabaseDebugger;
