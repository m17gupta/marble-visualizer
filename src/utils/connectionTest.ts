import { supabase, checkConnection } from '@/lib/supabase';
import { AuthError } from '@/models';

export class ConnectionTest {
  /**
   * Test basic Supabase connection
   */
  static async testBasicConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('Testing Supabase connection...');
      
      const result = await checkConnection();
      
      console.log('Connection test result:', result);
      if (result.connected) {
        return {
          success: true,
          message: `Connection successful! Latency: ${result.latency}ms`,
          details: result
        };
      } else {
        return {
          success: false,
          message: `Connection failed: ${result.error}`,
          details: result
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      };
    }
  }

  /**
   * Test database schema
   */
  static async testDatabaseSchema(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('Testing database schema...');
      
      // Test if required tables exist
      const tables = ['users', 'user_profiles', 'projects', 'project_access'];
      const results = [];
      
      for (const table of tables) {
        try {
          const { error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
            .limit(1);
          
          results.push({
            table,
            exists: !error,
            error: error?.message
          });
        } catch (err) {
          results.push({
            table,
            exists: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }
      
      const allTablesExist = results.every(r => r.exists);
      
      return {
        success: allTablesExist,
        message: allTablesExist 
          ? 'All required tables exist' 
          : 'Some required tables are missing',
        details: results
      };
    } catch (error) {
      return {
        success: false,
        message: `Schema test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      };
    }
  }

  /**
   * Test authentication
   */
  static async testAuthentication(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('Testing authentication...');
      
      // Test getting current session
      const { data: session, error } = await supabase.auth.getSession();
      
      if (error) {
        return {
          success: false,
          message: `Auth test failed: ${error.message}`,
          details: { error }
        };
      }
      
      return {
        success: true,
        message: session?.session 
          ? `Authenticated as: ${session.session.user.email}` 
          : 'No active session (this is normal if not logged in)',
        details: { 
          hasSession: !!session?.session,
          userId: session?.session?.user?.id,
          email: session?.session?.user?.email
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Auth test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      };
    }
  }

  /**
   * Test Row Level Security (RLS)
   */
  static async testRLS(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('Testing Row Level Security...');
      
      // Test accessing users table without authentication (should fail)
      const { error } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (error && error.message.includes('row-level security')) {
        return {
          success: true,
          message: 'RLS is properly configured (access denied as expected)',
          details: { error: error.message }
        };
      } else if (!error) {
        return {
          success: false,
          message: 'RLS might not be properly configured (unexpected access granted)',
          details: { warning: 'This could be a security issue' }
        };
      } else {
        return {
          success: false,
          message: `RLS test inconclusive: ${error.message}`,
          details: { error: error.message }
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `RLS test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      };
    }
  }

  /**
   * Run all connection tests
   */
  static async runAllTests(): Promise<{
    success: boolean;
    message: string;
    results: any[];
  }> {
    console.log('Running comprehensive connection tests...');
    
    const tests = [
      { name: 'Basic Connection', test: this.testBasicConnection },
      { name: 'Database Schema', test: this.testDatabaseSchema },
      { name: 'Authentication', test: this.testAuthentication },
      { name: 'Row Level Security', test: this.testRLS },
    ];
    
    const results = [];
    let allPassed = true;
    
    for (const { name, test } of tests) {
      console.log(`Running ${name} test...`);
      const result = await test();
      results.push({
        name,
        ...result
      });
      
      if (!result.success) {
        allPassed = false;
      }
    }
    
    return {
      success: allPassed,
      message: allPassed 
        ? 'All connection tests passed!' 
        : 'Some connection tests failed. Check the details.',
      results
    };
  }
}