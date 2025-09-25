
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminAuthService } from "@/lib/auth";

interface AdminAccessProps {
  onLoginSuccess?: () => void;
}

export const AdminAccess = ({ onLoginSuccess }: AdminAccessProps) => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await AdminAuthService.authenticate(username, password);

      if (result.success && result.user) {
        // Store user data in localStorage
        localStorage.setItem('admin_user', JSON.stringify(result.user));

        toast({
          title: "Login successful",
          description: `Welcome back, ${result.user.full_name || result.user.username}!`
        });

        // Call the success callback if provided
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        toast({
          title: "Invalid credentials",
          description: result.error || "Please check your username and password",
          variant: "destructive"
        });

        // Provide helpful debugging information
        console.log('Login failed. Debug info:');
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Error:', result.error);

        // If it's the default admin credentials, provide additional help
        if (username === 'admin' && password === 'Admin@123') {
          toast({
            title: "Database Issue Detected",
            description: "The default admin user may not exist in the database. Please check the diagnostic test at /test-auth.html",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md border-2 border-blue-500/40">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <CardTitle>Digital Firoj Admin Access</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button 
            onClick={handleLogin} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Access Dashboard'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
