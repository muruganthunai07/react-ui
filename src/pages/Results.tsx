import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar, Filter, Search, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AdminLayout } from '@/components/admin-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAdminContext } from '@/contexts/AdminContext';
import type { AdminResultsItems } from '@/types/api';
import moment from 'moment-timezone';
import { toast } from 'sonner';
import { getPaginationRange } from '@/utils/PaginationFunctions';

export default function ResultsPage() {
  const [filteredResults, setFilteredResults] = useState<AdminResultsItems[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [gameTypeFilter, setGameTypeFilter] = useState('1');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] =
    useState<AdminResultsItems | null>(null);
  const [winningNumbers, setWinningNumbers] = useState(['', '', '']);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReannounceDialogOpen, setIsReannounceDialogOpen] = useState(false);
  const [reannounceResult, setReannounceResult] = useState<AdminResultsItems | null>(null);
  const [newWinningNumbers, setNewWinningNumbers] = useState(['', '', '', '']);
  const { getAdminResults, publishResults, adminResults } = useAdminContext();
  const resultsPerPage = 10;

  const GAME_MODES = [
    { id: '1', name: 'Kerala' },
    { id: '2', name: 'Dear' },
  ];

  useEffect(() => {
    //For First Time render & Page Changes
    fetchResults();
  }, [currentPage]);

  useEffect(() => {
    fetchResults();
    // Only reset page on filter change, don't call fetchResults twice
    setCurrentPage(1);
  }, [gameTypeFilter]);
  const fetchResults = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const payload = {
        pageNumber: currentPage,
        pageSize: resultsPerPage,
        gameModeId: Number(gameTypeFilter),
        startDate: null,
        endDate: null,
        searchString: searchQuery,
      };
      const data = await getAdminResults(payload);
      console.log(data, 'data');
      if (data) {
        setFilteredResults(data.items);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load results'
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleNumberChange = (index: number, value: string) => {
    // Only allow numbers 0-9
    if (!/^[0-9]$/.test(value) && value !== '') return;

    const newNumbers = [...winningNumbers];
    newNumbers[index] = value;
    setWinningNumbers(newNumbers);

    // Auto focus next input if a valid number was entered
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`number-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  const handleSubmitResult = async () => {
    if (!selectedResult) return;

    try {
      const body = {
        drawId: selectedResult.drawId,
        digitX: Number(winningNumbers[0]),
        digitA: Number(winningNumbers[1]),
        digitB: Number(winningNumbers[2]),
        digitC: Number(winningNumbers[3]),
      };
      await publishResults(body);
      const updatedResults = filteredResults.map((result) => {
        if (result.drawId === selectedResult.drawId) {
          return {
            ...result,
            status: 'Completed',
            drawState: 'Completed',
            digitX: body.digitX,
            digitA: body.digitA,
            digitB: body.digitB,
            digitC: body.digitC,
          };
        }
        return result;
      });
      setFilteredResults(JSON.parse(JSON.stringify([...updatedResults])));
      setSelectedResult(null);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update result'
      );
    }
  };
  const handleReannounceNumberChange = (index: number, value: string) => {
    if (!/^[0-9]$/.test(value) && value !== '') return;
    const newNumbers = [...newWinningNumbers];
    newNumbers[index] = value;
    setNewWinningNumbers(newNumbers);
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`reannounce-number-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  const handleReannounceSubmit = async () => {
    if (!reannounceResult) return;
    try {
      const body = {
        drawId: reannounceResult.drawId,
        digitX: Number(newWinningNumbers[0]),
        digitA: Number(newWinningNumbers[1]),
        digitB: Number(newWinningNumbers[2]),
        digitC: Number(newWinningNumbers[3]),
      };
      await publishResults(body);
      const updatedResults = filteredResults.map((result) => {
        if (result.drawId === reannounceResult.drawId) {
          return {
            ...result,
            status: 'Completed',
            drawState: 'Completed',
            digitX: body.digitX,
            digitA: body.digitA,
            digitB: body.digitB,
            digitC: body.digitC,
          };
        }
        return result;
      });
      setFilteredResults(JSON.parse(JSON.stringify([...updatedResults])));
      setReannounceResult(null);
      setIsReannounceDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to re-announce result'
      );
    }
  };
  console.log(filteredResults, 'filteredResults');
  if (isLoading) {
    return (
      <AdminLayout>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-center h-40'>
              <p>Loading results...</p>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {error && (
        <Alert variant='destructive' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card className='mb-6'>
        <CardHeader className='pb-3'>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter results by game type or search for specific draws
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row gap-3 items-start'>
            <div className='flex-1 w-full'>
              <div className='flex w-full items-center space-x-2'>
                <div className='relative flex-1'>
                  <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                  <Input
                    type='search'
                    placeholder='Search by lot name or draw number...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-8 w-full'
                  />
                </div>
                <Button
                  type='submit'
                  size='icon'
                  variant='secondary'
                  className='shrink-0'
                  onClick={fetchResults}
                >
                  <Search className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='w-full md:w-auto'>
              <Select value={gameTypeFilter} onValueChange={setGameTypeFilter}>
                <SelectTrigger className='w-full md:w-[180px]'>
                  <div className='flex items-center gap-2'>
                    <Filter className='h-4 w-4' />
                    <SelectValue placeholder='Game Type' />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {GAME_MODES.map((mode) => (
                    <SelectItem key={mode.id} value={mode.id}>{mode.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='pb-3'>
          <CardTitle>Lottery Results</CardTitle>
          <CardDescription>Manage and announce lottery results</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>
                No results found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className='rounded-md border overflow-hidden'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='hidden md:table-cell'>
                        Date
                      </TableHead>
                      <TableHead>Lottery</TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Draw No.
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='hidden md:table-cell'>
                        Result
                      </TableHead>
                      <TableHead className='text-right'>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.drawId}>
                        <TableCell className='hidden md:table-cell'>
                          <div className='flex flex-col'>
                            <span>
                              {moment(result.drawDateTime).format(
                                'DD MMM YYYY'
                              )}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {moment(result.drawDateTime)
                                .tz('Asia/Kolkata')
                                .format('hh:mm A')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='font-medium'>
                            {result.gameModeName}
                          </div>
                          <div className='md:hidden text-xs text-muted-foreground'>
                            {format(parseISO(result.drawDateTime), 'dd MMM')} |{' '}
                            {result.drawId}
                          </div>
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {result.drawId}
                        </TableCell>
                        <TableCell>
                          {result.drawState !== 'Pending' ? (
                            <Badge className='bg-green-500 hover:bg-green-600'>
                              Completed
                            </Badge>
                          ) : (
                            <Badge
                              variant='outline'
                              className='text-yellow-600 border-yellow-600'
                            >
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className='hidden md:table-cell'>
                          {
                            result.drawState !== 'Pending' && (
                              // result.winningNumbers &&
                              // result.winningNumbers.length > 0 ? (
                              <div className='flex flex-col gap-1'>
                                {/* XABC Labels */}
                                <div className='flex gap-1 justify-center'>
                                  <span className='w-6 h-6 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                                    X
                                  </span>
                                  <span className='w-6 h-6 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                                    A
                                  </span>
                                  <span className='w-6 h-6 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                                    B
                                  </span>
                                  <span className='w-6 h-6 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                                    C
                                  </span>
                                </div>
                                {/* Result Numbers */}
                                <div className='flex gap-1 justify-center'>
                                  {Object.keys(result)
                                    ?.filter((key) => key.startsWith('digit'))
                                    ?.map((num: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className='w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full text-xs font-bold'
                                      >
                                        {result[num as keyof typeof result]}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            )
                            // ) : (
                            //   <span className='text-sm text-muted-foreground'>
                            //     Not announced
                            //   </span>
                            // )
                          }
                        </TableCell>
                        <TableCell className='text-right'>
                          {result.drawState === 'Pending' ? (
                            <Button
                              variant='default'
                              size='sm'
                              onClick={() => {
                                setSelectedResult(result);
                                setWinningNumbers(['', '', '', '']);
                                setIsDialogOpen(true);
                              }}
                            >
                              Announce
                            </Button>
                          ) : (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => {
                                setReannounceResult(result);
                                setNewWinningNumbers(['', '', '', '']); // Do not prefill with old numbers
                                setIsReannounceDialogOpen(true);
                              }}
                            >
                              Re-Announce
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>

              {adminResults && adminResults.totalCount
                ? getPaginationRange(
                    currentPage,
                    Math.ceil(adminResults.totalCount / 10)
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
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Announce Result</DialogTitle>
            <DialogDescription>
              Enter the winning numbers for {selectedResult?.gameModeName} (
              {selectedResult?.drawId})
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label>Date & Time</Label>
              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4' />
                {selectedResult &&
                  moment(selectedResult.drawDateTime).format(
                    'DD MMM YYYY'
                  )}{' '}
                at{' '}
                {moment(selectedResult?.drawDateTime)
                  .tz('Asia/Kolkata')
                  .format('hh:mm A')}
              </div>
            </div>

            <div className='grid gap-2'>
              <Label htmlFor='winning-numbers'>Winning Numbers</Label>
              <div className='flex flex-col gap-1'>
                {/* XABC Labels */}
                <div className='flex gap-2 justify-center'>
                  <span className='w-16 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    X
                  </span>
                  <span className='w-16 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    A
                  </span>
                  <span className='w-16 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    B
                  </span>
                  <span className='w-16 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    C
                  </span>
                </div>
                {/* Input Fields */}
                <div className='flex gap-2 justify-center'>
                  {[0, 1, 2, 3].map((idx) => (
                    <Input
                      key={idx}
                      id={`number-${idx}`}
                      className='w-16 text-center text-lg font-bold'
                      value={winningNumbers[idx]}
                      onChange={(e) => handleNumberChange(idx, e.target.value)}
                      maxLength={1}
                      pattern='[0-9]'
                      inputMode='numeric'
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type='submit'
              onClick={handleSubmitResult}
              disabled={winningNumbers.some((num) => num === '')}
            >
              Announce Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isReannounceDialogOpen} onOpenChange={setIsReannounceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Re-Announce Result</DialogTitle>
            <DialogDescription>
              Update the winning numbers for {reannounceResult?.gameModeName} ({reannounceResult?.drawId})
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label>Date & Time</Label>
              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4' />
                {reannounceResult &&
                  moment(reannounceResult.drawDateTime).format('DD MMM YYYY')}{' '}
                at{' '}
                {moment(reannounceResult?.drawDateTime)
                  .tz('Asia/Kolkata')
                  .format('hh:mm A')}
              </div>
            </div>
            <div className='grid gap-2'>
              <Label>Old Result</Label>
              <div className='flex flex-col gap-1'>
                {/* XABC Labels */}
                <div className='flex gap-2 justify-center'>
                  <span className='w-10 h-10 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    X
                  </span>
                  <span className='w-10 h-10 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    A
                  </span>
                  <span className='w-10 h-10 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    B
                  </span>
                  <span className='w-10 h-10 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    C
                  </span>
                </div>
                {/* Result Numbers */}
                <div className='flex gap-2 justify-center'>
                  <span className='w-10 h-10 flex items-center justify-center bg-muted rounded-full font-bold'>
                    {reannounceResult?.digitX ?? '-'}
                  </span>
                  <span className='w-10 h-10 flex items-center justify-center bg-muted rounded-full font-bold'>
                    {reannounceResult?.digitA ?? '-'}
                  </span>
                  <span className='w-10 h-10 flex items-center justify-center bg-muted rounded-full font-bold'>
                    {reannounceResult?.digitB ?? '-'}
                  </span>
                  <span className='w-10 h-10 flex items-center justify-center bg-muted rounded-full font-bold'>
                    {reannounceResult?.digitC ?? '-'}
                  </span>
                </div>
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='reannounce-numbers'>New Result</Label>
              <div className='flex flex-col gap-1'>
                {/* XABC Labels */}
                <div className='flex gap-2 justify-center'>
                  <span className='w-16 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    X
                  </span>
                  <span className='w-16 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    A
                  </span>
                  <span className='w-16 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    B
                  </span>
                  <span className='w-16 flex items-center justify-center text-xs font-bold text-muted-foreground'>
                    C
                  </span>
                </div>
                {/* Input Fields */}
                <div className='flex gap-2 justify-center'>
                  {[0, 1, 2, 3].map((idx) => (
                    <Input
                      key={idx}
                      id={`reannounce-number-${idx}`}
                      className='w-16 text-center text-lg font-bold'
                      value={newWinningNumbers[idx]}
                      onChange={(e) => handleReannounceNumberChange(idx, e.target.value)}
                      maxLength={1}
                      pattern='[0-9]'
                      inputMode='numeric'
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='submit'
              onClick={handleReannounceSubmit}
              disabled={newWinningNumbers.some((num) => num === '')}
            >
              Re-Announce Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
