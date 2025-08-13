import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
const activities = [
  { id: 1, icon: faFolderOpen, text: "Project Alpha marked as completed", time: "2h ago" },
  { id: 2, icon: faCreditCard, text: "Payment received from Acme Corp - $2,400", time: "5h ago" },
  { id: 3, icon: faFolderOpen, text: "New project created: Website Redesign", time: "1d ago" },
];

export const ActivityFeed = () => {
  return (
    <Card className="hover-scale ">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 p-2">
          {activities.map((a) => (
            <li
              key={a.id}
              className={cn(
                "flex items-start gap-3 p-3",
                "border border-dashed border-green-500 rounded-lg", // Dotted green border with radius
                "hover:bg-green-50 transition-colors" // Optional hover effect
              )}
            >
              <FontAwesomeIcon
                icon={a.icon}
                className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
