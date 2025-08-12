import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Project, Payment } from "@/types/entities";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface PaymentSectionProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

const PaymentSection = ({ project, onUpdate }: PaymentSectionProps) => {
  const { toast } = useToast();
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [method, setMethod] = useState<Payment["method"]>("Cash");
  const [showCalendar, setShowCalendar] = useState(false);

  const addPayment = () => {
    const paymentAmount = Number(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    const newPayment: Payment = {
      id: crypto.randomUUID(),
      projectId: project.id,
      amount: paymentAmount,
      date: paymentDate.toISOString(),
      method,
    };

    const updatedProject: Project = {
      ...project,
      payments: [newPayment, ...project.payments],
      totalPaid: project.totalPaid + paymentAmount,
    };

    onUpdate(updatedProject);
    toast({
      title: "Payment recorded",
      description: `Added ${paymentAmount.toLocaleString()} MAD payment`,
    });

    // Reset form
    setAmount("");
    setPaymentDate(new Date());
    setMethod("Cash");
    setShowAddPayment(false);
  };

  const deletePayment = (paymentId: string) => {
    const payment = project.payments.find(p => p.id === paymentId);
    if (!payment) return;

    const updatedProject: Project = {
      ...project,
      payments: project.payments.filter(p => p.id !== paymentId),
      totalPaid: project.totalPaid - payment.amount,
    };

    onUpdate(updatedProject);
    toast({
      title: "Payment removed",
      description: `Removed ${payment.amount.toLocaleString()} MAD payment`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Payment History</h3>
        <Button onClick={() => setShowAddPayment(true)} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Record Payment
        </Button>
      </div>

      {project.payments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <div className="text-4xl mb-2">💰</div>
          <p>No payments yet</p>
          <p className="text-sm">Add your first project payment to track progress</p>
        </div>
      ) : (
        <div className="space-y-3">
          {project.payments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <div className="font-medium">{payment.amount.toLocaleString()} MAD</div>
                  <div className="text-sm text-muted-foreground">
                    📅 {formatDate(payment.date)} • {payment.method}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => deletePayment(payment.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
            <p className="text-sm text-muted-foreground">Add a payment to this project</p>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount (MAD) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <Label>Payment Date *</Label>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(paymentDate, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={paymentDate}
                    onSelect={(date) => {
                      if (date) {
                        setPaymentDate(date);
                        setShowCalendar(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Payment Method</Label>
              <Select value={method} onValueChange={(v: Payment["method"]) => setMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Check">Check</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddPayment(false)}>
                Cancel
              </Button>
              <Button onClick={addPayment}>
                Record Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentSection;