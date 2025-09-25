
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminSidebar } from "./AdminSidebar";
import { AdminDashboard } from "./AdminDashboard";
import { PortfolioManager } from "./PortfolioManager";
import { AdminUserManager } from "./AdminUserManager";

export const LeadDashboard = () => {
  const { toast } = useToast();
  const [quizLeads, setQuizLeads] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<any[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching dashboard data...');
      
      const [quizResponse, contactResponse, emailResponse, portfolioResponse] = await Promise.all([
        supabase.from('quiz_leads').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('email_notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('portfolios').select('*', { count: 'exact' })
      ]);

      console.log('Quiz leads response:', quizResponse);
      console.log('Contact messages response:', contactResponse);
      console.log('Email notifications response:', emailResponse);
      console.log('Portfolio response:', portfolioResponse);

      if (quizResponse.data) {
        console.log('Setting quiz leads:', quizResponse.data);
        setQuizLeads(quizResponse.data);
      }
      if (contactResponse.data) {
        console.log('Setting contact messages:', contactResponse.data);
        setContactMessages(contactResponse.data);
      }
      if (emailResponse.data) setEmailNotifications(emailResponse.data);
      if (portfolioResponse.count !== null) setPortfolioCount(portfolioResponse.count);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error loading data",
        description: "Please check your connection and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, status: string, type: 'quiz' | 'contact') => {
    try {
      const table = type === 'quiz' ? 'quiz_leads' : 'contact_messages';
      const { error } = await supabase
        .from(table)
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status updated successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error updating status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': case 'replied': return 'bg-green-100 text-green-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    // Clear any local storage or session data if needed
    localStorage.removeItem('admin_user');
    // Redirect to login page
    window.location.href = '/admin';
  };

  const stats = {
    quizLeads: quizLeads.length,
    contactMessages: contactMessages.length,
    portfolioCount,
    newLeads: quizLeads.filter(l => l.status === 'new').length,
    unreadMessages: contactMessages.filter(m => m.status === 'new').length,
    conversionRate: quizLeads.length > 0 ? Math.round((quizLeads.filter(l => l.status === 'converted').length / quizLeads.length) * 100) : 0,
    convertedLeads: quizLeads.filter(l => l.status === 'converted').length
  };

  const filteredQuizLeads = quizLeads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.project_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContactMessages = contactMessages.filter(message => 
    `${message.first_name} ${message.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard stats={stats} />;
      
      case 'quiz-leads':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Quiz Leads ({quizLeads.length})</h2>
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {filteredQuizLeads.length === 0 ? (
              <Card className="border-2 border-blue-500/40">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No quiz leads found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredQuizLeads.map((lead) => (
                  <Card key={lead.id} className="border-2 border-blue-500/40 hover:border-blue-400/60 transition-all duration-300">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg truncate">{lead.name}</CardTitle>
                          <CardDescription className="truncate">{lead.email}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                          <Select
                            value={lead.status}
                            onValueChange={(value) => updateLeadStatus(lead.id, value, 'quiz')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="qualified">Qualified</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Project:</span>
                          <p className="truncate">{lead.project_type}</p>
                        </div>
                        <div>
                          <span className="font-medium">Budget:</span>
                          <p className="truncate">{lead.budget}</p>
                        </div>
                        <div>
                          <span className="font-medium">Timeline:</span>
                          <p className="truncate">{lead.timeline}</p>
                        </div>
                        <div>
                          <span className="font-medium">Features:</span>
                          <p className="truncate">{lead.features}</p>
                        </div>
                      </div>
                      {lead.company && (
                        <div className="mt-2">
                          <span className="font-medium text-sm">Company:</span>
                          <p className="text-sm truncate">{lead.company}</p>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`mailto:${lead.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`https://wa.me/919279066553?text=Hi ${lead.name}, thank you for your interest in our services!`} target="_blank">
                            <Phone className="w-4 h-4 mr-2" />
                            WhatsApp
                          </a>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(lead.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'contact-messages':
        return (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">Contact Messages ({contactMessages.length})</h2>
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            {filteredContactMessages.length === 0 ? (
              <Card className="border-2 border-blue-500/40">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No contact messages found.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredContactMessages.map((message) => (
                  <Card key={message.id} className="border-2 border-blue-500/40 hover:border-blue-400/60 transition-all duration-300">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-lg truncate">{message.first_name} {message.last_name}</CardTitle>
                          <CardDescription className="truncate">{message.email}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                          <Select
                            value={message.status}
                            onValueChange={(value) => updateLeadStatus(message.id, value, 'contact')}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="read">Read</SelectItem>
                              <SelectItem value="replied">Replied</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {message.company && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Company:</span>
                          <p className="text-sm truncate">{message.company}</p>
                        </div>
                      )}
                      {message.project_type && (
                        <div className="mb-2">
                          <span className="font-medium text-sm">Project Type:</span>
                          <p className="text-sm truncate">{message.project_type}</p>
                        </div>
                      )}
                      <div className="mb-4">
                        <span className="font-medium text-sm">Message:</span>
                        <p className="text-sm mt-1 p-3 bg-secondary/50 rounded break-words">{message.message}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`mailto:${message.email}`}>
                            <Mail className="w-4 h-4 mr-2" />
                            Reply
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`https://wa.me/919279066553?text=Hi ${message.first_name}, thank you for reaching out!`} target="_blank">
                            <Phone className="w-4 h-4 mr-2" />
                            WhatsApp
                          </a>
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(message.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'portfolio':
        return <PortfolioManager />;

      case 'admin-users':
        return <AdminUserManager />;

      default:
        return <AdminDashboard stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        stats={stats}
      />
      
      <main className="lg:ml-72 transition-all duration-300">
        <div className="p-6 pt-24 lg:p-8 lg:pt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
