import { useEffect, useState } from 'react';
import { Search, Edit, DollarSign, List } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { AdminLayout } from '@/components/admin-layout';
import { useUser } from '@/contexts/UserContext';
import { UserEditDialog } from '@/components/UserEditDialog';
import { AdminRechargeDialog } from '@/components/AdminRechargeDialog';
import { Badge } from '@/components/ui/badge';
import { getRoleConfig } from '@/config/roles';
import { TransactionHistory } from '@/components/transaction-history';
import { X } from 'lucide-react';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { users, getAllUsers } = useUser();
  const usersPerPage = 10;
  const [showTransactionsFor, setShowTransactionsFor] = useState<null | { id: string; name: string }>(null);
 
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    await getAllUsers();
  };
  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key='first'>
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key='ellipsis-1'>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i <= 1 || i >= totalPages) continue;
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key='ellipsis-2'>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key='last'>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <AdminLayout>
      {/* Full-page modal for transactions */}
      {showTransactionsFor && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="relative bg-background w-full max-w-2xl h-[90vh] rounded-lg shadow-lg flex flex-col">
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted"
              onClick={() => setShowTransactionsFor(null)}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex-1 overflow-y-auto p-4">
              <h2 className="text-xl font-bold mb-4">Transactions for {showTransactionsFor.name}</h2>
              <TransactionHistory userId={showTransactionsFor.id} />
            </div>
          </div>
        </div>
      )}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </div>
            <div className='relative flex-1 md:w-64'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by name, email, or phone'
                className='pl-8'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentUsers.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>
              <p>No users found</p>
            </div>
          ) : (
            <>
              {/* Desktop view - Table */}
              <div className='hidden md:block rounded-md border overflow-hidden'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <div className='font-medium'>{user.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.mobileNumber}</TableCell>
                        <TableCell>₹{user.totalBalance}</TableCell>
                        <TableCell>
                          {user.isActive === false ? (
                            <span className='text-red-500'>Blocked</span>
                          ) : (
                            <span className='text-green-500'>Active</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline' className={getRoleConfig(user.role).color}>
                            {getRoleConfig(user.role).icon}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <button
                            className="px-3 py-1 rounded bg-muted text-muted-foreground hover:bg-primary/10"
                            onClick={() => setShowTransactionsFor({ id: user.id.toString(), name: user.name })}
                          >
                            View
                          </button>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex justify-end gap-2'>
                            <UserEditDialog
                              user={user}
                              onUserUpdated={fetchData}
                              icon={<Edit className='mr-2 h-4 w-4' />}
                            />
                            <AdminRechargeDialog
                              user={user}
                              onUserUpdated={fetchData}
                              icon={<DollarSign className='mr-2 h-4 w-4' />}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile view - Cards */}
              <div className='md:hidden space-y-4'>
                {currentUsers.map((user) => (
                  <Card key={user.id} className='overflow-hidden'>
                    <CardContent className='p-0'>
                      <div className='flex items-center justify-between p-4 border-b'>
                        <div className='flex items-center gap-3'>
                          <div>
                            <div className='font-medium'>{user.name}</div>
                          </div>
                        </div>                      
                      </div>
                      <div className='p-4 space-y-2 text-sm'>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Phone:</span>
                          <span className='font-medium'>{user.mobileNumber}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Balance:</span>
                          <span className='font-medium'>₹{user.totalBalance}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Status:</span>
                          <span className={`font-medium ${user.isActive === false ? 'text-red-500' : 'text-green-500'}`}>
                            {user.isActive === false ? 'Blocked' : 'Active'}
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-muted-foreground'>Role:</span>
                          <Badge variant='outline' className={getRoleConfig(user.role).color}>
                            {getRoleConfig(user.role).icon}
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <div className='flex gap-2 p-2'>
                        <UserEditDialog
                          user={user}
                          onUserUpdated={fetchData}
                          icon={<Edit className='mr-2 h-4 w-4' />}
                        />
                        <AdminRechargeDialog
                          user={user}
                          onUserUpdated={fetchData}
                          icon={<DollarSign className='mr-2 h-4 w-4' />}
                        />
                      </div>
                      <div className='flex gap-2 p-2'>
                        <button
                          className="flex items-center gap-2 px-3 py-1 rounded bg-muted text-muted-foreground hover:bg-primary/10 w-full justify-center"
                          onClick={() => setShowTransactionsFor({ id: user.id.toString(), name: user.name })}
                        >
                          <List className='w-4 h-4' />
                          Transactions
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {totalPages > 1 && (
            <div className='mt-6'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
