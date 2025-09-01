import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MessageSquare, Mail, Eye, Phone, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PortfolioManager } from "./PortfolioManager";

export const LeadDashboard = () => {
  const { toast } = useToast();
  const [quizLeads, setQuizLeads] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [emailNotifications, setEmailNotifications] = useState<any[]>([]);
  const [portfolioCount, setPortfolioCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizResponse, contactResponse, emailResponse, portfolioResponse] = await Promise.all([
        supabase.from('quiz_leads').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('email_notifications').select('*').order('created_at', { ascending: false }),
        supabase.from('portfolios').select('*', { count: 'exact' })
      ]);

      if (quizResponse.data) setQuizLeads(quizResponse.data);
      if (contactResponse.data) setContactMessages(contactResponse.data);
      if (emailResponse.data) setEmailNotifications(emailResponse.data);
      if (portfolioResponse.count) setPortfolioCount(portfolioResponse.count);
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

      fetchData(); // Refresh data
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lead Management Dashboard</h1>
        <p className="text-muted-foreground">Manage your leads, contact messages, and portfolio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizLeads.length}</div>
            <p className="text-xs text-muted-foreground">
              {quizLeads.filter(l => l.status === 'new').length} new leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contactMessages.length}</div>
            <p className="text-xs text-muted-foreground">
              {contactMessages.filter(m => m.status === 'new').length} unread messages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Items</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioCount}</div>
            <p className="text-xs text-muted-foreground">
              Total portfolio items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Notifications</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailNotifications.length}</div>
            <p className="text-xs text-muted-foreground">
              {emailNotifications.filter(e => e.status === 'pending').length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quizLeads.length > 0 ? Math.round((quizLeads.filter(l => l.status === 'converted').length / quizLeads.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {quizLeads.filter(l => l.status === 'converted').length} converted
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Search leads by name, email, or project type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="quiz-leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="quiz-leads">Quiz Leads</TabsTrigger>
          <TabsTrigger value="contact-messages">Contact Messages</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="email-logs">Email Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="quiz-leads" className="space-y-4">
          {filteredQuizLeads.map((lead) => (
            <Card key={lead.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                    <CardDescription>{lead.email}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Project:</span>
                    <p>{lead.project_type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Budget:</span>
                    <p>{lead.budget}</p>
                  </div>
                  <div>
                    <span className="font-medium">Timeline:</span>
                    <p>{lead.timeline}</p>
                  </div>
                  <div>
                    <span className="font-medium">Features:</span>
                    <p>{lead.features}</p>
                  </div>
                </div>
                {lead.company && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Company:</span>
                    <p className="text-sm">{lead.company}</p>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${lead.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`https://wa.me/919279066556?text=Hi ${lead.name}, thank you for your interest in our services!`} target="_blank">
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
        </TabsContent>

        <TabsContent value="contact-messages" className="space-y-4">
          {filteredContactMessages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{message.first_name} {message.last_name}</CardTitle>
                    <CardDescription>{message.email}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <p className="text-sm">{message.company}</p>
                  </div>
                )}
                {message.project_type && (
                  <div className="mb-2">
                    <span className="font-medium text-sm">Project Type:</span>
                    <p className="text-sm">{message.project_type}</p>
                  </div>
                )}
                <div className="mb-4">
                  <span className="font-medium text-sm">Message:</span>
                  <p className="text-sm mt-1 p-3 bg-secondary/50 rounded">{message.message}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${message.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Reply
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`https://wa.me/919279066556?text=Hi ${message.first_name}, thank you for reaching out!`} target="_blank">
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
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <PortfolioManager />
        </TabsContent>

        <TabsContent value="email-logs" className="space-y-4">
          {emailNotifications.map((email) => (
            <Card key={email.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{email.subject}</CardTitle>
                    <CardDescription>{email.recipient_email}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(email.status)}>
                    {email.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p><span className="font-medium">Template:</span> {email.template_type}</p>
                  {email.error_message && (
                    <p className="text-red-600 mt-1">
                      <span className="font-medium">Error:</span> {email.error_message}
                    </p>
                  )}
                  <p className="text-muted-foreground mt-2">
                    Created: {new Date(email.created_at).toLocaleString()}
                    {email.sent_at && ` • Sent: ${new Date(email.sent_at).toLocaleString()}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
