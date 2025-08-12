import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faFolderOpen } from "@fortawesome/free-solid-svg-icons";

const activities = [
  { id: 1, icon: faFolderOpen, text: "Project Alpha marked as completed", time: "2h ago" },
  { id: 2, icon: faCreditCard, text: "Payment received from Acme Corp - $2,400", time: "5h ago" },
  { id: 3, icon: faFolderOpen, text: "New project created: Website Redesign", time: "1d ago" },
];

export const ActivityFeed = () => {
  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <FontAwesomeIcon icon={a.icon} className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
