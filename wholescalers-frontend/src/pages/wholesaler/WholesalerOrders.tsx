import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WholesalerOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await api.wholesaler.getOrders(token!);
      console.log(data);
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

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      const response = await api.wholesaler.updateOrderStatus(token!, orderId, status);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Order status updated!');
        fetchOrders();
      }
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-warning';
      case 'confirmed': return 'bg-primary';
      case 'shipped': return 'bg-accent';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-destructive';
      default: return 'bg-muted';
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Orders</h1>
          <p className="text-muted-foreground">Manage and fulfill customer orders</p>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead> {/* changed header */}
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">#{order._id}</TableCell>
                      <TableCell>{order.retailer?.name || order.customer?.name || 'N/A'}</TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 max-w-xs">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((it: any) => (
                              <div key={it._id} className="flex items-baseline justify-between">
                                <div className="min-w-0">
                                  <div className="text-sm font-medium truncate">{it.product?.name || 'Product'}</div>
                                  <div className="text-xs text-muted-foreground">
                                    MOQ: {it.product?.moq ?? '-'} • Stock: {it.product?.stock ?? '-'}
                                  </div>
                                </div>
                                <div className="ml-3 text-sm whitespace-nowrap">
                                  <span className="font-semibold">{it.quantity}</span>
                                  <span className="text-muted-foreground text-xs"> × ₹{it.price}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">—</div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>₹{order.total}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusUpdate(order._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
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
