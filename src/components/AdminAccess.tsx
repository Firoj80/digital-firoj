
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { LeadDashboard } from "./LeadDashboard";
import { useToast } from "@/hooks/use-toast";

export const AdminAccess = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "Firoj" && password === "Babu@8757") {
      setIsAuthenticated(true);
      toast({
        title: "Login successful",
        description: "Welcome to Digital Firoj Admin Dashboard"
      });
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your username and password",
        variant: "destructive"
      });
    }
  };

  if (isAuthenticated) {
    return <LeadDashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
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
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <Button onClick={handleLogin} className="w-full">
            Access Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
