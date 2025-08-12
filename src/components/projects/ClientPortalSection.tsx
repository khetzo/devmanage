import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Project, Client } from "@/types/entities";
import { Link2, Globe, Shield, Clock, FileText, MessageSquare, Monitor } from "lucide-react";

interface ClientPortalSectionProps {
  project: Project;
  client?: Client;
}

const ClientPortalSection = ({ project, client }: ClientPortalSectionProps) => {
  const { toast } = useToast();
  const [portalExpiry, setPortalExpiry] = useState("30 days");
  const [shareUpdates, setShareUpdates] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePortal = async () => {
    setIsGenerating(true);
    
    // Simulate portal generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Client Portal Generated",
        description: "Portal link has been created and copied to clipboard",
      });
    }, 2000);
  };

  const features = [
    {
      icon: <Shield className="w-4 h-4" />,
      text: "Secure 6-digit access code"
    },
    {
      icon: <FileText className="w-4 h-4" />,
      text: "Project details and progress"
    },
    {
      icon: <MessageSquare className="w-4 h-4" />,
      text: "Payment history and status"
    },
    {
      icon: <FileText className="w-4 h-4" />,
      text: "Invoice download (if uploaded)"
    },
    {
      icon: <Clock className="w-4 h-4" />,
      text: "Project updates (if enabled)"
    },
    {
      icon: <Monitor className="w-4 h-4" />,
      text: "Mobile-responsive interface"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-medium">Client Portal</h3>
        <span className="text-xs bg-muted px-2 py-1 rounded">0 translators</span>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Share secure project access with your client
      </p>

      {/* Portal Settings */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="expiry">Portal Expiry (Days)</Label>
          <Select value={portalExpiry} onValueChange={setPortalExpiry}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7 days">7 days</SelectItem>
              <SelectItem value="30 days">30 days</SelectItem>
              <SelectItem value="60 days">60 days</SelectItem>
              <SelectItem value="90 days">90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Portal Content</Label>
          
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">Share Project Updates</div>
              <div className="text-xs text-muted-foreground">Allow client to see all project updates</div>
            </div>
            <Switch 
              checked={shareUpdates}
              onCheckedChange={setShareUpdates}
            />
          </div>
        </div>
      </div>

      {/* Generate Portal Button */}
      <Button 
        onClick={generatePortal} 
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        <Globe className="w-4 h-4 mr-2" />
        {isGenerating ? "Generating Portal..." : "Generate Client Portal"}
      </Button>

      {/* What's Included */}
      <div className="border rounded-lg p-4 bg-muted/30">
        <h4 className="font-medium mb-3">What's included:</h4>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{feature.icon}</span>
              <span>{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Translation Section */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">French Translation</h4>
          <Button variant="outline" size="sm">
            🇫🇷 Translate to French
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Translate project content to French for client portal
        </p>
      </div>
    </div>
  );
};

export default ClientPortalSection;