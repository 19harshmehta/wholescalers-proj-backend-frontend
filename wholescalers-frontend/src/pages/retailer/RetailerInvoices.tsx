import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function RetailerInvoices() {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await api.retailer.getInvoices(token!);
        if (data.error) {
          toast.error(data.error);
        } else {
          setInvoices(data.invoices || []);
        }
      } catch (error) {
        toast.error('Failed to load invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [token]);

  const handlePayment = async (invoiceId: string) => {
    try {
      const response = await api.payments.createPaymentIntent(token!, invoiceId);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      // Configure Razorpay options
      const options = {
        key: response.keyId, // Razorpay Key ID
        amount: response.amount, // Amount in currency subunits
        order_id: response.orderId, // Razorpay order ID
        currency: response.currency,
        name: "B2B Wholesale Portal",
        description: `Payment for Invoice #${invoiceId}`,
        handler: async function (razorpayResponse: any) {
          try {
            // Verify payment on backend
            const verifyResult = await api.payments.verifyPayment(token!, {
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            if (verifyResult.ok) {
              toast.success('Payment successful!');
              // Refresh invoices list
              const data = await api.retailer.getInvoices(token!);
              setInvoices(data.invoices || []);
            } else {
              toast.error(verifyResult.error || 'Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
          }
        },
        theme: {
          color: '#3b82f6'
        }
      };

      // @ts-ignore - Razorpay is loaded via CDN
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/invoices/${invoiceId}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const blob = await response.blob();
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
          <p className="text-muted-foreground">View and pay your invoices</p>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No invoices found
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices.map((invoice) => (
                    <TableRow key={invoice._id}>
                      <TableCell className="font-medium">#{invoice._id}</TableCell>
                      <TableCell>#{invoice.orderId || invoice.order?._id || invoice.order}</TableCell>
                      <TableCell className="font-semibold">₹{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.paid || invoice.status === 'paid' ? 'default' : 'destructive'}>
                          {invoice.paid || invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handlePayment(invoice._id)}
                            disabled={invoice.paid || invoice.status === 'paid'}
                            className="gap-2"
                          >
                            <CreditCard size={16} />
                            {invoice.paid || invoice.status === 'paid' ? 'Paid' : 'Pay Now'}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownloadInvoice(invoice._id)}
                            className="gap-2"
                          >
                            <Download size={16} />
                            Download
                          </Button>
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
