import { useEffect, useState } from 'react';
import { Check, Eye, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AdminLayout } from '@/components/admin-layout';
import { useAdminContext } from '@/contexts/AdminContext';
import moment from 'moment';
import type { AllDepositDto, PaginatedResponseOfAllDepositDto } from '@/types/api';
import { getPaginationRange } from '@/utils/PaginationFunctions';
import { AdminService } from '@/services/AdminService';
import { getFileUrl } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { WithdrawalDto, PaginatedResponseOfWithdrawalDto } from '@/types/api';

// WithdrawTab component for admin withdrawals
function WithdrawTab() {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<WithdrawalDto[]>([]);
  const [allWithdrawals, setAllWithdrawals] = useState<Partial<PaginatedResponseOfWithdrawalDto>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalDto>();
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const withdrawalsPerPage = 10;

  // Move fetchData outside useEffect so it can be called after approve/reject
  const fetchData = async () => {
    const res = await AdminService.getAllWithdrawals(currentPage, withdrawalsPerPage);
    setAllWithdrawals(res);
    setWithdrawals(Array.isArray(res.items) ? res.items : []);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const filteredWithdrawals = withdrawals?.filter(
    (withdrawal) =>
      searchQuery === '' ||
      withdrawal?.userId?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );
  const currentWithdrawals = filteredWithdrawals;

  const handleApproveWithdrawal = async (id: number) => {
    const body = { isApproved: true, rejectionReason: undefined };
    try {
      await AdminService.processWithdrawal(id, body);
      await fetchData();
      toast({
        title: 'Withdrawal approved',
        description: "The withdrawal has been approved and funds processed.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Withdrawal approval failed',
        description: 'There was an error processing the withdrawal.',
      });
    }
  };

  const handleRejectWithdrawal = async (id: number) => {
    if (!rejectionReason) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }
    const body = { isApproved: false, rejectionReason };
    try {
      await AdminService.processWithdrawal(id, body);
      await fetchData();
      toast({
        title: 'Withdrawal rejected',
        description: 'The withdrawal has been rejected',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Withdrawal rejection failed',
        description: 'There was an error rejecting the withdrawal.',
      });
    }
    setIsRejecting(false);
    setRejectionReason('');
    setSelectedWithdrawal(undefined);
  };

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <CardTitle>Pending Withdrawals</CardTitle>
            <CardDescription>Review and approve user withdrawal requests</CardDescription>
          </div>
          <div className='flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto'>
            <div className='relative flex-1 md:w-64'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by user ID'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentWithdrawals.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            <p>No withdrawals found for the selected filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop view - Table */}
            <div className='hidden md:block rounded-md border overflow-hidden'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>After 3% Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Account Type</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentWithdrawals.map((withdrawal) => {
                    const isPending = withdrawal?.status === 'Pending';
                    const amountAfterCommission = Math.round((withdrawal?.amount || 0) * 0.97);
                    return (
                      <TableRow key={withdrawal?.id}>
                        <TableCell>{withdrawal?.userId}</TableCell>
                        <TableCell>₹{withdrawal?.amount}</TableCell>
                        <TableCell>₹{amountAfterCommission}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              withdrawal?.status === 'Approved'
                                ? 'default'
                                : withdrawal.status === 'Rejected'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {withdrawal?.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {withdrawal?.requestedAt && moment(withdrawal.requestedAt).tz('Asia/Kolkata').format('lll')}
                        </TableCell>
                        <TableCell>{withdrawal?.accountType}</TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-1'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => setSelectedWithdrawal(withdrawal)}
                            >
                              <Eye className='h-4 w-4' />
                            </Button>
                            {isPending && (
                              <>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='text-green-600 hover:text-green-700 hover:bg-green-50'
                                  onClick={() => handleApproveWithdrawal(withdrawal?.withdrawalId)}
                                  title='Approve'
                                >
                                  <Check className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                  onClick={() => {
                                    setSelectedWithdrawal(withdrawal);
                                    setIsRejecting(true);
                                  }}
                                  title='Reject'
                                >
                                  <X className='h-4 w-4' />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile view - Cards */}
            <div className='md:hidden space-y-4'>
              {currentWithdrawals.map((withdrawal) => {
                const isPending = withdrawal?.status === 'Pending';
                const amountAfterCommission = Math.round((withdrawal?.amount || 0) * 0.97);
                return (
                  <Card key={withdrawal?.id} className='overflow-hidden'>
                    <CardContent className='p-0'>
                      <div className='flex items-center justify-between p-4 border-b bg-muted'>
                        <div>
                          <div className='font-medium'>{withdrawal?.userId}</div>
                          <div className='text-muted-foreground text-xs'>
                            {withdrawal?.requestedAt && moment(withdrawal?.requestedAt).tz('Asia/Kolkata').format('lll')}
                          </div>
                        </div>
                        <Badge
                          variant={
                            withdrawal?.status === 'Approved'
                              ? 'default'
                              : withdrawal?.status === 'Rejected'
                              ? 'destructive'
                              : 'outline'
                          }
                          className='ml-2'
                        >
                          {withdrawal?.status}
                        </Badge>
                      </div>
                      <div className='p-4 space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Amount:</span>
                          <span className='font-bold text-lg'>₹{withdrawal?.amount}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Amount After 3% Commission:</span>
                          <span className='font-bold text-lg'>₹{amountAfterCommission}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Account Type:</span>
                          <span>{withdrawal?.accountType}</span>
                        </div>
                      </div>
                      <div className='flex justify-around gap-2 p-3 border-t bg-muted'>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-primary'
                          onClick={() => setSelectedWithdrawal(withdrawal)}
                        >
                          <Eye className='h-5 w-5' />
                        </Button>
                        {isPending && (
                          <>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='bg-green-600 text-white hover:bg-green-700'
                              onClick={() => handleApproveWithdrawal(withdrawal?.withdrawalId)}
                              title='Approve'
                            >
                              <Check className='h-5 w-5' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='bg-red-600 text-white hover:bg-red-700'
                              onClick={() => {
                                setSelectedWithdrawal(withdrawal);
                                setIsRejecting(true);
                              }}
                              title='Reject'
                            >
                              <X className='h-5 w-5' />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        <div className='mt-6'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(currentPage - 1)} />
              </PaginationItem>
              {allWithdrawals && allWithdrawals.totalCount && allWithdrawals.totalCount > 0
                ? getPaginationRange(
                    currentPage,
                    Math.ceil(allWithdrawals?.totalCount / withdrawalsPerPage)
                  ).map((item, index) => (
                    <PaginationItem key={index}>
                      {item === '...' ? (
                        <span className='px-2 text-muted-foreground'>...</span>
                      ) : (
                        <PaginationLink
                          isActive={item === currentPage}
                          className='w-8 h-8 flex items-center justify-center'
                          size='icon'
                          aria-label={`Page ${item}`}
                          onClick={() => setCurrentPage(Number(item))}
                        >
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))
                : null}
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(currentPage + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Withdrawal Details Dialog */}
        <Dialog
          open={!!selectedWithdrawal && !isRejecting}
          onOpenChange={(open) => !open && setSelectedWithdrawal(undefined)}
        >
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Withdrawal Details</DialogTitle>
              <DialogDescription>Review the withdrawal request information</DialogDescription>
            </DialogHeader>
            {selectedWithdrawal && (
              <div className='space-y-4'>
                <div className='font-medium'>User ID: {selectedWithdrawal.userId}</div>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-muted-foreground'>Amount</p>
                    <p className='font-medium'>₹{selectedWithdrawal.amount}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Status</p>
                    <Badge
                      variant={
                        selectedWithdrawal.status === 'Approved'
                          ? 'default'
                          : selectedWithdrawal.status === 'Rejected'
                          ? 'destructive'
                          : 'outline'
                      }
                    >
                      {selectedWithdrawal.status}
                    </Badge>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Requested At</p>
                    <p className='font-medium'>
                      {selectedWithdrawal.requestedAt &&
                        moment(selectedWithdrawal.requestedAt).tz('Asia/Kolkata').format('lll')}
                    </p>
                  </div>
                  {selectedWithdrawal.approvedAt && (
                    <div>
                      <p className='text-sm text-muted-foreground'>Approved At</p>
                      <p className='font-medium'>
                        {moment(selectedWithdrawal.approvedAt).tz('Asia/Kolkata').format('lll')}
                      </p>
                    </div>
                  )}
                  {selectedWithdrawal.approvedBy && (
                    <div>
                      <p className='text-sm text-muted-foreground'>Approved By</p>
                      <p className='font-medium'>{selectedWithdrawal.approvedBy}</p>
                    </div>
                  )}
                  <div>
                    <p className='text-sm text-muted-foreground'>Account Type</p>
                    <p>{selectedWithdrawal.accountType}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Payment Details</p>
                    <p>{selectedWithdrawal.paymentDetails}</p>
                  </div>
                  <div>
                    <p className='text-sm text-muted-foreground'>Notes</p>
                    <p>{selectedWithdrawal.notes}</p>
                  </div>
                </div>
                {selectedWithdrawal.rejectionReason && (
                  <div>
                    <p className='text-sm text-muted-foreground'>Rejection Reason</p>
                    <p>{selectedWithdrawal.rejectionReason}</p>
                  </div>
                )}
                {selectedWithdrawal.status === 'Pending' && (
                  <div className='flex justify-between gap-2 pt-2'>
                    <Button
                      variant='outline'
                      className='flex-1'
                      onClick={() => setIsRejecting(true)}
                    >
                      Reject
                    </Button>
                    <Button
                      className='flex-1'
                      onClick={() => {
                        handleApproveWithdrawal(selectedWithdrawal.withdrawalId);
                        setSelectedWithdrawal(undefined);
                      }}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Rejection Dialog */}
        <Dialog
          open={isRejecting}
          onOpenChange={(open) => {
            if (!open) {
              setIsRejecting(false);
              setRejectionReason('');
              setSelectedWithdrawal(undefined);
            }
          }}
        >
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>Reject Withdrawal</DialogTitle>
              <DialogDescription>Please provide a reason for rejecting this withdrawal</DialogDescription>
            </DialogHeader>
            <div className='space-y-4 py-4'>
              <div className='space-y-2'>
                <Label htmlFor='rejectionReason'>Reason for Rejection</Label>
                <Textarea
                  id='rejectionReason'
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Invalid account details, suspicious activity"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant='outline'
                onClick={() => {
                  setIsRejecting(false);
                  setRejectionReason('');
                  setSelectedWithdrawal(undefined);
                }}
              >
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={() =>
                  selectedWithdrawal && handleRejectWithdrawal(selectedWithdrawal.withdrawalId)
                }
              >
                Reject Withdrawal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function AdminDepositsPage() {
  const { toast } = useToast();
  const [deposits, setDeposits] = useState<AllDepositDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeposit, setSelectedDeposit] = useState<AllDepositDto>();
  const [allDeposits, setAllDeposits] = useState<Partial<PaginatedResponseOfAllDepositDto>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const { getAllDeposits } = useAdminContext();
  const depositsPerPage = 10;
  // Tabs for Deposit and Withdraw
  const [tab, setTab] = useState('deposit');

  const fetchDeposits = async () => {
    const res = await getAllDeposits(currentPage, depositsPerPage);
    setAllDeposits(res);
    setDeposits(Array.isArray(res.items) ? res.items : []);
  };

  useEffect(() => {
    fetchDeposits();
    // eslint-disable-next-line
  }, [currentPage]);

  // Filter deposits based on search query and transaction type
  const filteredDeposits = deposits?.filter(
    (deposit) =>
      searchQuery === '' ||
      deposit?.userId?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      deposit?.userName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      deposit?.transactionId?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );
  const currentDeposits = filteredDeposits;

  const handleApproveDeposit = async (depositId: number) => {
    const body = { isApproved: true, rejectionReason: null };
    try {
      await AdminService.approveDeposit(depositId, body);
      toast({
        title: 'Deposit approved',
        description: "The deposit has been approved and funds added to user's account",
      });
      fetchDeposits();
      setSelectedDeposit(undefined);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Deposit approval failed',
        description: 'There was an error processing the deposit.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectDeposit = async (depositId: number) => {
    if (!rejectionReason) {
      toast({
        title: 'Reason required',
        description: 'Please provide a reason for rejection',
        variant: 'destructive',
      });
      return;
    }
    const body = { isApproved: false, rejectionReason };
    try {
      await AdminService.approveDeposit(depositId, body);
      toast({
        title: 'Deposit rejected',
        description: 'The deposit has been rejected',
      });
      fetchDeposits();
      setIsRejecting(false);
      setRejectionReason('');
      setSelectedDeposit(undefined);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Deposit rejection failed',
        description: 'There was an error rejecting the deposit.',
        variant: 'destructive',
      });
    }
  };

  const handleViewDeposit = (deposit: AllDepositDto) => {
    setSelectedDeposit(deposit);
  };

  return (
    <AdminLayout>
      <Tabs value={tab} onValueChange={setTab} className='w-full'>
        <TabsList>
          <TabsTrigger value='deposit'>Deposit</TabsTrigger>
          <TabsTrigger value='withdraw'>Withdraw</TabsTrigger>
        </TabsList>
        <TabsContent value='deposit'>
          <Card>
            <CardHeader className='pb-3'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div>
                  <CardTitle>Pending Deposits</CardTitle>
                  <CardDescription>
                    Review and approve user deposit requests
                  </CardDescription>
                </div>
                <div className='flex flex-col md:flex-row gap-2 md:items-center w-full md:w-auto'>
                  <div className='relative flex-1 md:w-64'>
                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                    <Input
                      placeholder='Search by user ID, name, or transaction ID'
                      className='pl-8'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {currentDeposits.length === 0 ? (
                <div className='text-center py-8 text-muted-foreground'>
                  <p>No transactions found for the selected filters.</p>
                </div>
              ) : (
                <>
                  {/* Desktop view - Table */}
                  <div className='hidden md:block rounded-md border overflow-hidden'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDeposits.map((deposit) => {
                          const isPending = deposit.status === 'Pending';
                          return (
                            <TableRow key={deposit?.depositId}>
                              <TableCell>
                                <div className='flex items-center gap-2'>
                                  <Avatar className='h-8 w-8'>
                                    <AvatarImage
                                      alt={`/placeholder.svg?height=32&width=32`}
                                      src={
                                        deposit?.userId ||
                                        `/placeholder.svg?height=40&width=40`
                                      }
                                    />
                                    <AvatarFallback>
                                      {deposit?.userName?.substring(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className='font-medium'>{deposit?.userName}</div>
                                </div>
                              </TableCell>
                              <TableCell>₹{deposit?.amount}</TableCell>
                              <TableCell>{deposit?.transactionId}</TableCell>
                              <TableCell>
                                {moment(deposit?.requestedAt)
                                  .tz('Asia/Kolkata')
                                  .format('lll')}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    deposit?.status === 'Approved'
                                      ? 'default'
                                      : deposit.status === 'Rejected'
                                      ? 'destructive'
                                      : 'outline'
                                  }
                                >
                                  {deposit?.status}
                                </Badge>
                              </TableCell>
                              <TableCell className='text-right'>
                                <div className='flex justify-end gap-1'>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => handleViewDeposit(deposit)}
                                  >
                                    <Eye className='h-4 w-4' />
                                  </Button>
                                  {isPending && (
                                    <>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        className='text-green-600 hover:text-green-700 hover:bg-green-50'
                                        onClick={() => handleApproveDeposit(deposit.depositId)}
                                        title='Approve'
                                      >
                                        <Check className='h-4 w-4' />
                                      </Button>
                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                                        onClick={() => {
                                          setSelectedDeposit(deposit);
                                          setIsRejecting(true);
                                        }}
                                        title='Reject'
                                      >
                                        <X className='h-4 w-4' />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile view - Cards */}
                  <div className='md:hidden space-y-4'>
                    {currentDeposits.map((deposit) => {
                      const isPending = deposit.status === 'Pending';
                      return (
                        <Card key={deposit?.depositId} className='overflow-hidden'>
                          <CardContent className='p-0'>
                            {/* Header: User + Status */}
                            <div className='flex items-center justify-between p-4 border-b bg-muted'>
                              <div className='flex items-center gap-3'>
                                <Avatar className='h-10 w-10'>
                                  <AvatarImage
                                    alt={`/placeholder.svg?height=40&width=40`}
                                    src={
                                      deposit?.userId ||
                                      `/placeholder.svg?height=40&width=40`
                                    }
                                  />
                                  <AvatarFallback>
                                    {deposit?.userName?.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className='font-medium'>{deposit?.userName}</div>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  deposit?.status === 'Approved'
                                    ? 'default'
                                    : deposit?.status === 'Rejected'
                                    ? 'destructive'
                                    : 'outline'
                                }
                                className='ml-2'
                              >
                                {deposit?.status}
                              </Badge>
                            </div>
                            {/* Details */}
                            <div className='p-4 space-y-2 text-sm'>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>Amount:</span>
                                <span className='font-bold text-lg'>₹{deposit?.amount}</span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>Transaction ID:</span>
                                <span className='break-all'>{deposit?.transactionId}</span>
                              </div>
                              <div className='flex justify-between'>
                                <span className='text-muted-foreground'>Time:</span>
                                <span className='font-medium'>
                                  {moment(deposit?.requestedAt)
                                    .tz('Asia/Kolkata')
                                    .format('lll')}
                                </span>
                              </div>
                            </div>
                            {/* Actions */}
                            <div className='flex justify-around gap-2 p-3 border-t bg-muted'>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-primary'
                                onClick={() => handleViewDeposit(deposit)}
                              >
                                <Eye className='h-5 w-5' />
                              </Button>
                              {isPending && (
                                <>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='bg-green-600 text-white hover:bg-green-700'
                                    onClick={() => handleApproveDeposit(deposit.depositId)}
                                    title='Approve'
                                  >
                                    <Check className='h-5 w-5' />
                                  </Button>
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='bg-red-600 text-white hover:bg-red-700'
                                    onClick={() => {
                                      setSelectedDeposit(deposit);
                                      setIsRejecting(true);
                                    }}
                                    title='Reject'
                                  >
                                    <X className='h-5 w-5' />
                                  </Button>
                                </>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}

              <div className='mt-6'>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(currentPage - 1)}
                      />
                    </PaginationItem>

                    {allDeposits &&
                    allDeposits.totalCount &&
                    allDeposits.totalCount > 0
                      ? getPaginationRange(
                          currentPage,
                          Math.ceil(allDeposits?.totalCount / depositsPerPage)
                        ).map((item, index) => (
                          <PaginationItem key={index}>
                            {item === '...' ? (
                              <span className='px-2 text-muted-foreground'>
                                ...
                              </span>
                            ) : (
                              <PaginationLink
                                isActive={item === currentPage}
                                className='w-8 h-8 flex items-center justify-center'
                                size='icon'
                                aria-label={`Page ${item}`}
                                onClick={() => setCurrentPage(Number(item))}
                              >
                                {item}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))
                      : null}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(currentPage + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              {/* Deposit Details Dialog */}
              <Dialog
                open={!!selectedDeposit && Object.keys(selectedDeposit).length > 0}
                onOpenChange={(open) => {
                  if (!open) setSelectedDeposit(undefined);
                  setIsRejecting(false);
                  setRejectionReason('');
                }}
              >
                <DialogContent className='max-w-md'>
                  <DialogHeader>
                    <DialogTitle>Deposit Details</DialogTitle>
                    <DialogDescription>
                      Review the deposit request information
                    </DialogDescription>
                  </DialogHeader>

                  {selectedDeposit && (
                    <div className='space-y-4'>
                      <div className='flex items-center gap-3'>
                        <Avatar>
                          <AvatarImage
                            alt={`/placeholder.svg?height=40&width=40`}
                            src={
                              selectedDeposit?.userId ||
                              `/placeholder.svg?height=40&width=40`
                            }
                          />
                          <AvatarFallback>
                            {selectedDeposit?.userName?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium'>{selectedDeposit?.userName}</p>
                          <p className='text-sm text-muted-foreground'>
                            User ID: {selectedDeposit?.userId}
                          </p>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <p className='text-sm text-muted-foreground'>Amount</p>
                          <p className='font-medium'>₹{selectedDeposit?.amount}</p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>Status</p>
                          <Badge
                            variant={
                              selectedDeposit?.status === 'Approved'
                                ? 'default'
                                : selectedDeposit.status === 'Rejected'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {selectedDeposit.status}
                          </Badge>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Transaction ID
                          </p>
                          <p className='font-medium'>
                            {selectedDeposit.transactionId}
                          </p>
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Requested At
                          </p>
                          <p className='font-medium'>
                            {selectedDeposit.requestedAt &&
                              moment(selectedDeposit.requestedAt)
                                .tz('Asia/Kolkata')
                                .format('lll')}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className='text-sm text-muted-foreground mb-2'>
                          Payment Screenshot
                        </p>
                        {selectedDeposit.paymentScreenshot ? (
                            <div className='border rounded-md overflow-hidden'>
                              <img
                                src={getFileUrl(selectedDeposit.paymentScreenshot)}
                                alt='Payment screenshot'
                                className='w-full h-auto'
                                style={{ maxHeight: 320, objectFit: 'contain' }}
                              />
                            </div>
                          ) : (
                          <div className='text-muted-foreground italic'>No payment screenshot uploaded.</div>
                        )}
                      </div>

                      {selectedDeposit?.status === 'Pending' && (
                        <div className='flex justify-between gap-2 pt-2'>
                          <Button
                            variant='outline'
                            className='flex-1'
                            onClick={() => setIsRejecting(true)}
                          >
                            Reject
                          </Button>
                          <Button
                            className='flex-1'
                            onClick={() => handleApproveDeposit(selectedDeposit.depositId)}
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Rejection Dialog */}
              <Dialog
                open={isRejecting}
                onOpenChange={(open) => {
                  if (!open) {
                    setIsRejecting(false);
                    setRejectionReason('');
                    setSelectedDeposit(undefined);
                  }
                }}
              >
                <DialogContent className='max-w-md'>
                  <DialogHeader>
                    <DialogTitle>Reject Deposit</DialogTitle>
                    <DialogDescription>
                      Please provide a reason for rejecting this deposit
                    </DialogDescription>
                  </DialogHeader>

                  <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='rejectionReason'>Reason for Rejection</Label>
                      <Textarea
                        id='rejectionReason'
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g. Invalid transaction ID, screenshot doesn't match"
                        rows={4}
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setIsRejecting(false);
                        setRejectionReason('');
                        setSelectedDeposit(undefined);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='destructive'
                      onClick={() =>
                        selectedDeposit && handleRejectDeposit(selectedDeposit.depositId)
                      }
                    >
                      Reject Deposit
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='withdraw'>
          <WithdrawTab />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
