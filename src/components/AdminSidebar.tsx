
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
  X
} from "lucide-react";

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
    }
  ];

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsOpen(false); // Close mobile menu when section changes
  };

  return (
    <>
      {/* Mobile menu button - fixed positioning */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 w-10 p-0 bg-background/95 backdrop-blur-sm shadow-lg"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-background border-r transition-transform duration-300 z-40 w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Digital Firoj</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="lg:hidden h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleSectionChange(item.id)}
            >
              <item.icon className="w-4 h-4 mr-2" />
              <div className="flex items-center justify-between w-full">
                <span>{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>

        {/* Logout button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
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
