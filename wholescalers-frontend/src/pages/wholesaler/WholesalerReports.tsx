import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type ReportType = 'sales' | 'inventory' | 'customers';

export default function WholesalerReports() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('sales');

  const downloadReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (startDate > endDate) {
      toast.error('Start date must be before end date');
      return;
    }

    setLoading(true);
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const csvData = await api.wholesaler.getReport(
        token!, 
        selectedReportType, 
        formattedStartDate, 
        formattedEndDate
      );
      
      // Create a blob from the CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedReportType}-report-${formattedStartDate}-to-${formattedEndDate}.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const downloadQuickReport = async (reportType: ReportType) => {
    setLoading(true);
    try {
      const csvData = await api.wholesaler.getReport(token!, reportType);
      
      // Create a blob from the CSV data
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-report-all-data.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
          <p className="text-muted-foreground">Download and export your business data</p>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Quick Download Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => downloadQuickReport('sales')}
                disabled={loading}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2"
              >
                <FileText className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Sales Report</div>
                  <div className="text-xs text-muted-foreground">All data till date</div>
                </div>
              </Button>

              <Button
                onClick={() => downloadQuickReport('inventory')}
                disabled={loading}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2"
              >
                <FileText className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Inventory Report</div>
                  <div className="text-xs text-muted-foreground">All data till date</div>
                </div>
              </Button>

              <Button
                onClick={() => downloadQuickReport('customers')}
                disabled={loading}
                variant="outline"
                className="h-auto py-4 flex flex-col gap-2"
              >
                <FileText className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Customers Report</div>
                  <div className="text-xs text-muted-foreground">All data till date</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Generate Custom Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select value={selectedReportType} onValueChange={(value) => setSelectedReportType(value as ReportType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="customers">Customers Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={downloadReport}
              disabled={loading || !startDate || !endDate}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>About Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Sales Report:</strong> Includes order ID, retailer details, total amount, 
                status, item count, and creation date.
              </p>
              <p>
                <strong>Inventory Report:</strong> Contains product name, SKU, category, price, 
                stock quantity, MOQ, and last updated date.
              </p>
              <p>
                <strong>Customers Report:</strong> Lists customer ID, name, email, company, phone, 
                total spend, and order count.
              </p>
              <p className="pt-2 text-xs">
                All reports are generated in CSV format and include current data at the time of download.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
