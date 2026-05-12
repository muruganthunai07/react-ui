import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Save, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin-layout';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AdminService } from '@/services/AdminService';
import { formatIndianCurrency } from '@/lib/utils';

// Schema for form validation
const FormSchema = z.object({
  lotGroups: z.array(
    z.object({
      id: z.number(),
      agentPrice: z.coerce.number().min(0),
      clientPrice: z.coerce.number().min(0),
      winningAmount: z.number(),
      type: z.string(),
    })
  ),
});

export default function LotPricingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  // Initialize form with default values
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      lotGroups: [],
    },
  });

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchLotPricing = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use a try-catch to handle potential fetch errors
        try {
          // Correct path to the JSON file in the public directory
          const response = await AdminService.getLotRates();

          // Check if the response is ok
          if (response.status !== 200) {
            throw new Error(
              `Failed to fetch data: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.data;

          // Set the form values
          form.reset({ lotGroups: data });
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);

          // Use default data if fetch fails
          form.reset({ lotGroups: [] });

          // Set a user-friendly error message
          setError(
            'Could not load pricing data from server. Using default values.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLotPricing();
  }, [form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const newData = data?.lotGroups?.map((lot) => {
      return {
        lotTypeId: lot.id,
        agentPrice: lot.agentPrice,
        clientPrice: lot.clientPrice,
      };
    });
    try {
      await AdminService.updateLotRates(newData);
      toast({
        title: 'Success',
        description: 'Pricing updated successfully',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong',
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-center h-40'>
              <p>Loading pricing data...</p>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle>Lot Pricing</CardTitle>
          <CardDescription>
            Update pricing for different lot types
          </CardDescription>
        </CardHeader>

        {error && (
          <CardContent className='pt-0 pb-3'>
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('🛑 Validation errors:', errors);
            })}
          >
            <CardContent>
              {isMobile ? (
                <div className='flex flex-col gap-4'>
                  {form.watch('lotGroups').map((lotGroup, index) => (
                    <div
                      key={lotGroup.id}
                      className='rounded-lg border bg-card p-4 flex flex-col gap-2 shadow-sm'
                    >
                      <div className='flex justify-between items-center'>
                        <span className='font-semibold text-base'>
                          {lotGroup.type}
                        </span>
                        <span className='text-sm font-medium text-right whitespace-nowrap'>
                          {formatIndianCurrency(lotGroup.winningAmount)}
                        </span>
                      </div>
                      <div className='flex flex-col gap-2 mt-2'>
                        <FormField
                          control={form.control}
                          name={`lotGroups.${index}.agentPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type='number'
                                  step='0.01'
                                  min='0'
                                  className='text-center font-medium bg-blue-500 text-white no-spinner'
                                  placeholder='Agent Price'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`lotGroups.${index}.clientPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  type='number'
                                  step='0.01'
                                  min='0'
                                  className='text-center font-medium bg-green-600 text-white no-spinner'
                                  placeholder='Client Price'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='rounded-md border overflow-x-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[250px]'>Lot Type</TableHead>
                        <TableHead>Agent Price</TableHead>
                        <TableHead>Client Price</TableHead>
                        <TableHead>Winning Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form.watch('lotGroups').map((lotGroup, index) => (
                        <TableRow key={lotGroup.id}>
                          <TableCell className='font-medium'>
                            <div className='flex flex-col'>
                              <span className='hidden md:inline'>
                                {lotGroup.type}
                              </span>
                              <span className='md:hidden text-sm'>
                                {lotGroup.type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`lotGroups.${index}.agentPrice`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className='w-24 md:w-32'>
                                      <Input
                                        {...field}
                                        type='number'
                                        step='0.01'
                                        min='0'
                                        className='text-center font-medium bg-blue-500 text-white no-spinner'
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`lotGroups.${index}.clientPrice`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className='w-24 md:w-32'>
                                      <Input
                                        {...field}
                                        type='number'
                                        step='0.01'
                                        min='0'
                                        className='text-center font-medium bg-green-600 text-white no-spinner'
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className='text-right'>
                            <div className='w-32 text-right font-medium whitespace-nowrap'>
                              {formatIndianCurrency(lotGroup.winningAmount)}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter
              className={`border-t pt-6 ${
                isMobile ? 'flex justify-center' : 'flex justify-end'
              }`}
            >
              <Button type='submit' className={isMobile ? 'w-full' : ''}>
                <Save className='mr-2 h-4 w-4' />
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </AdminLayout>
  );
}
