
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  Briefcase,
  LogOut,
  BarChart3,
  Menu,
  X,
  Settings
} from "lucide-react";
import { AdminUser } from "@/lib/auth";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  stats: {
    quizLeads: number;
    contactMessages: number;
    portfolioCount: number;
    newLeads: number;
    unreadMessages: number;
  };
}

export const AdminSidebar = ({ 
  activeSection, 
  onSectionChange, 
  onLogout, 
  stats 
}: AdminSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      badge: null
    },
    {
      id: "quiz-leads",
      label: "Quiz Leads",
      icon: Users,
      badge: stats.newLeads > 0 ? stats.newLeads : null
    },
    {
      id: "contact-messages",
      label: "Contact Messages",
      icon: MessageSquare,
      badge: stats.unreadMessages > 0 ? stats.unreadMessages : null
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: Briefcase,
      badge: null
    },
    {
      id: "admin-users",
      label: "Admin Users",
      icon: Settings,
      badge: null
    }
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsOpen(false); // Close mobile menu when section changes
  };

  return (
    <>
      {/* Mobile menu button - fixed positioning */}
      <div className="lg:hidden fixed top-6 left-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 p-0 premium-card border-2 border-blue-500/40 hover:border-blue-500/60 shadow-lg"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full premium-card border-r-2 border-blue-500/40 transition-transform duration-300 z-40 w-72 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">DF</span>
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text">Digital Firoj</h2>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="lg:hidden h-8 w-8 p-0 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 space-y-3">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={`w-full justify-start h-12 text-left transition-all duration-300 ${
                activeSection === item.id 
                  ? "gradient-bg text-white shadow-lg" 
                  : "hover:bg-white/10 hover:scale-105"
              }`}
              onClick={() => handleSectionChange(item.id)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <div className="flex items-center justify-between w-full">
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-2 bg-red-500/20 text-red-400 border-red-500/30">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Logout button */}
        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full justify-start h-12 border-2 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 transition-all duration-300"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
