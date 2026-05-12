import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin-layout';
import { GamesTab } from '@/components/game-management/GamesTab';
import { HolidaysTab } from '@/components/game-management/HolidaysTab';

export default function GameManagement() {
  const [activeTab, setActiveTab] = useState('games');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AdminLayout>
      <Card className='mb-6'>
        <CardHeader className='pb-3'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <CardTitle>Game Management</CardTitle>
              <CardDescription>
                Enable or disable games and update game settings
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <div className='relative flex-1 md:w-64'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search...'
                  className='pl-8'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue='games'
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='games'>Games</TabsTrigger>
              <TabsTrigger value='holidays'>Holidays</TabsTrigger>
            </TabsList>
            <TabsContent value='games' className='mt-4'>
              <GamesTab searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value='holidays' className='mt-4'>
              <HolidaysTab searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
