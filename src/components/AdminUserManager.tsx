import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Users, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminAuthService, AdminUser } from "@/lib/auth";

export const AdminUserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    console.log('Fetching admin users...');
    const result = await AdminAuthService.getAllUsers();
    console.log('Fetch users result:', result);

    if (result.success && result.users) {
      console.log('Users loaded successfully:', result.users.length, 'users');
      setUsers(result.users);
    } else {
      console.error('Error loading users:', result.error);
      toast({
        title: "Error loading users",
        description: result.error || "Failed to load admin users",
        variant: "destructive"
      });
    }
    setLoading(false);
  }, [toast]);

  const handleCreateUser = useCallback(async () => {
    console.log('Creating user with form data:', formData);

    if (!formData.username?.trim() || !formData.email?.trim() || !formData.password?.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await AdminAuthService.createUser(formData);
    console.log('Create user result:', result);

    if (result.success) {
      toast({
        title: "User created successfully",
        description: `${formData.username} has been added as an admin user`
      });
      setShowCreateDialog(false);
      setFormData({ username: '', email: '', password: '', full_name: '' });
      fetchUsers();
    } else {
      console.error('User creation failed:', result.error);
      toast({
        title: "Error creating user",
        description: result.error || "Failed to create user",
        variant: "destructive"
      });
    }
  }, [formData, toast, fetchUsers]);

  const handleToggleStatus = useCallback(async (userId: string, currentStatus: boolean) => {
    const result = await AdminAuthService.updateUserStatus(userId, !currentStatus);

    if (result.success) {
      toast({
        title: "Status updated",
        description: `User ${currentStatus ? 'deactivated' : 'activated'} successfully`
      });
      fetchUsers();
    } else {
      toast({
        title: "Error updating status",
        description: result.error || "Failed to update user status",
        variant: "destructive"
      });
    }
  }, [toast, fetchUsers]);

  const handleDeleteUser = useCallback(async (userId: string, username: string) => {
    const result = await AdminAuthService.deleteUser(userId);

    if (result.success) {
      toast({
        title: "User deleted",
        description: `${username} has been removed from admin users`
      });
      fetchUsers();
    } else {
      toast({
        title: "Error deleting user",
        description: result.error || "Failed to delete user",
        variant: "destructive"
      });
    }
  }, [toast, fetchUsers]);

  const resetForm = useCallback(() => {
    setFormData({ username: '', email: '', password: '', full_name: '' });
    setShowPassword(false);
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading admin users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Admin Users ({users.length})</h2>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Admin User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Admin User</DialogTitle>
              <DialogDescription>
                Add a new administrator to the system. They will have full access to the admin dashboard.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter full name (optional)"
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <Card className="border-2 border-blue-500/40">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No admin users found.</p>
            <p className="text-sm text-muted-foreground mt-2">Create your first admin user to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="border-2 border-blue-500/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{user.full_name || user.username}</h3>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                      {user.last_login_at && (
                        <span>Last login: {new Date(user.last_login_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${user.id}`} className="text-sm">
                        Active
                      </Label>
                      <Switch
                        id={`active-${user.id}`}
                        checked={user.is_active}
                        onCheckedChange={() => handleToggleStatus(user.id, user.is_active)}
                      />
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Admin User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {user.username}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
