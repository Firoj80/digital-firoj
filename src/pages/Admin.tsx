
import { useEffect, useState } from "react";
import { LeadDashboard } from "@/components/LeadDashboard";
import { AdminAccess } from "@/components/AdminAccess";
import { AdminAuthService } from "@/lib/auth";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      // Check if user data exists in localStorage
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // Verify the user still exists and is active
        const result = await AdminAuthService.authenticate(userData.username, 'dummy_password');
        if (result.success && result.user) {
          setIsAuthenticated(true);
        } else {
          // Clear invalid session
          localStorage.removeItem('admin_user');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Authentication check error:', error);
      localStorage.removeItem('admin_user');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAccess onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <LeadDashboard />;
};

export default Admin;
