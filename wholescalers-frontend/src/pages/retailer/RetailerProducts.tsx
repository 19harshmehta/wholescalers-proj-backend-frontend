import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function RetailerProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.retailer.getProducts(token!);
        if (data.error) {
          toast.error(data.error);
        } else {
          setProducts(data.products || []);
        }
      } catch (error) {
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const handleOrder = async () => {
    if (!selectedProduct) return;

    try {
      const response = await api.retailer.createOrder(token!, {
        wholesalerId: selectedProduct.wholesaler,
        items: [
          {
            product: selectedProduct._id,
            quantity: parseInt(quantity),
            price: selectedProduct.price,
          },
        ],
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Order placed successfully!');
        setDialogOpen(false);
        setQuantity('1');
      }
    } catch (error) {
      toast.error('Failed to place order');
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Products</h1>
          <p className="text-muted-foreground">Explore wholesale products and place orders</p>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <p className="text-center text-muted-foreground">No products available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground mb-4">{product.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Stock:</span>
                      <span className="text-sm font-medium">{product.stock}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">MOQ:</span>
                      <span className="text-sm font-medium">{product.moq}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">₹{product.price}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog open={dialogOpen && selectedProduct?._id === product._id} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (open) setSelectedProduct(product);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2">
                        <ShoppingCart size={18} />
                        Place Order
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Place Order</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">₹{product.price} per unit</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total:</span>
                            <span className="text-primary">
                              ₹{(product.price * parseInt(quantity || '0')).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button onClick={handleOrder} className="w-full">
                          Confirm Order
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
