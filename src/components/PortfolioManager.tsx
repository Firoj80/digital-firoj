
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, ExternalLink, Github, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  project_url?: string;
  github_url?: string;
  technologies: string[];
  category: string;
  featured: boolean;
  display_order: number;
  enabled?: boolean;
}

export const PortfolioManager = () => {
  const { toast } = useToast();
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    github_url: '',
    technologies: '',
    category: '',
    featured: false,
    display_order: 0,
    enabled: true
  });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios' as any)
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      toast({
        title: "Error loading portfolios",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const portfolioData = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        project_url: formData.project_url || null,
        github_url: formData.github_url || null,
        technologies: formData.technologies.split(',').map(t => t.trim()),
        category: formData.category,
        featured: formData.featured,
        display_order: formData.display_order,
        enabled: formData.enabled
      };

      if (editingItem) {
        const { error } = await supabase
          .from('portfolios' as any)
          .update(portfolioData)
          .eq('id', editingItem.id);

        if (error) throw error;
        toast({ title: "Portfolio updated successfully" });
      } else {
        const { error } = await supabase
          .from('portfolios' as any)
          .insert([portfolioData]);

        if (error) throw error;
        toast({ title: "Portfolio created successfully" });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchPortfolios();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: "Error saving portfolio",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      const { error } = await supabase
        .from('portfolios' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: "Portfolio deleted successfully" });
      fetchPortfolios();
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast({
        title: "Error deleting portfolio",
        variant: "destructive"
      });
    }
  };

  const toggleEnabled = async (id: string, currentEnabled: boolean) => {
    try {
      const { error } = await supabase
        .from('portfolios' as any)
        .update({ enabled: !currentEnabled })
        .eq('id', id);

      if (error) throw error;
      
      toast({ title: `Portfolio ${!currentEnabled ? 'enabled' : 'disabled'} successfully` });
      fetchPortfolios();
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast({
        title: "Error updating portfolio",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      project_url: '',
      github_url: '',
      technologies: '',
      category: '',
      featured: false,
      display_order: 0,
      enabled: true
    });
  };

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      project_url: item.project_url || '',
      github_url: item.github_url || '',
      technologies: item.technologies.join(', '),
      category: item.category,
      featured: item.featured,
      display_order: item.display_order,
      enabled: item.enabled ?? true
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingItem(null);
    resetForm();
    setFormData(prev => ({ ...prev, display_order: portfolios.length + 1 }));
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading portfolios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Portfolio Management</h3>
          <p className="text-muted-foreground">Manage your portfolio items</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Portfolio Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit' : 'Create'} Portfolio Item</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update' : 'Add'} the portfolio item details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Development">Web Development</SelectItem>
                      <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                      <SelectItem value="AI/ML">AI/ML</SelectItem>
                      <SelectItem value="E-commerce">E-commerce</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project_url">Project URL</Label>
                  <Input
                    id="project_url"
                    value={formData.project_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enabled"
                    checked={formData.enabled}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
                  />
                  <Label htmlFor="enabled">Enabled</Label>
                </div>
                <div>
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {portfolios.map((item) => (
          <Card key={item.id} className={item.enabled === false ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {item.featured && <Badge>Featured</Badge>}
                    <Badge variant="outline">{item.category}</Badge>
                    {item.enabled === false && <Badge variant="destructive">Disabled</Badge>}
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toggleEnabled(item.id, item.enabled ?? true)}
                  >
                    {item.enabled === false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <img src={item.image_url} alt={item.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {item.project_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.project_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Live
                        </a>
                      </Button>
                    )}
                    {item.github_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={item.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3 h-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
