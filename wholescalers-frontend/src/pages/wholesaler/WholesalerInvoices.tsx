import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function WholesalerInvoices() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.wholesaler.getOrders(token!);
        if (data.error) {
          toast.error(data.error);
        } else {
          setOrders(data.orders || []);
        }
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleCreateInvoice = async (orderId: string) => {
    try {
      const response = await api.wholesaler.createInvoice(token!, orderId);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Invoice created successfully!');
        // Update local state to reflect invoice creation
        setOrders(orders.map(order => 
          order._id === orderId 
            ? { ...order, invoiced: true, invoiceId: response.invoice?._id || response.invoiceId }
            : order
        ));
      }
    } catch (error) {
      toast.error('Failed to create invoice');
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const blob = await api.wholesaler.downloadInvoicePDF(token!, invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Invoices</h1>
          <p className="text-muted-foreground">Create and manage invoices for orders</p>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No orders available for invoicing
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">#{order._id}</TableCell>
                      <TableCell>{order.retailer?.name || 'N/A'}</TableCell>
                      <TableCell>₹{order.total}</TableCell>
                      <TableCell>
                        <Badge variant={order.invoiced ? 'default' : 'secondary'}>
                          {order.invoiced ? 'Created' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!order.invoiced ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCreateInvoice(order._id)}
                              className="gap-2"
                            >
                              <FileText size={16} />
                              Create Invoice
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownloadInvoice(order.invoiceId)}
                              className="gap-2"
                            >
                              <Download size={16} />
                              Download Invoice
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
