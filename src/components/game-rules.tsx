import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GameRulesVisual } from '@/components/game-rules-visual';

interface GameRulesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameRules({ open, onOpenChange }: GameRulesProps) {
  const [activeTab, setActiveTab] = useState('visual');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='bottom' className='h-[90vh] sm:h-[85vh] p-0'>
        <SheetHeader className='p-6 pb-2'>
          <SheetTitle className='text-center'>Game Rules</SheetTitle>
          <SheetDescription className='text-center'>
            Learn how to play and win in our lottery games
          </SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue='visual'
          className='w-full'
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <div className='px-6'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='visual'>Visual Guide</TabsTrigger>
              <TabsTrigger value='text'>Text Rules</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className='h-[calc(90vh-140px)] sm:h-[calc(85vh-140px)] px-6 py-4'>
            <TabsContent
              value='visual'
              className='mt-0 focus-visible:outline-none focus-visible:ring-0'
            >
              <GameRulesVisual />
            </TabsContent>

            <TabsContent
              value='text'
              className='mt-0 space-y-6 focus-visible:outline-none focus-visible:ring-0'
            >
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Game Overview</h3>
                <p>
                  This 4 & 3 digit game is based on the daily result of Kerela &
                  Dear lottery first prize results with the last four & 3 digits
                  based.
                </p>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Kerela [Upto 4 digits game]:</h4>
                  <p>Draw Time: 03:00 PM</p>
                  <p>An example of a first price ticket is 5635</p>
                  <p>
                    X=5, A=6, B=3, C=5, AB=63, BC=35, AC=65, ABC = 635, XABC =
                    5635
                  </p>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Dear [Upto 3 digits game]:</h4>
                  <p>Draw Times: 01:00 PM, 06:00 PM & 08:00 PM</p>
                  <p>An example of a first price ticket is 062</p>
                  <p>A=0, B=6, C=2, AB=06, BC=62, AC=02, ABC = 062</p>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Jackpot [Upto 3 digits game]:</h4>
                  <p>
                    Draw Times: 10:30 AM, 11:30 AM, 12:30 PM, 01:30 PM, 03:30
                    PM, 05:30 PM, 06:30 PM & 07:30 PM
                  </p>
                  <p>An example of a first price ticket is 620</p>
                  <p>A=6, B=2, C=0, AB=62, BC=20, AC=60, ABC = 620</p>
                  <p className='text-sm text-gray-600'>
                    Every lot result is announced after 30 minutes (example:
                    10:30 AM lot result announced at 11:00 AM. So Buyers can buy
                    this Jackpot lot up to x:45 time for example 10:30 AM lot
                    you can buy up to 10:45 AM).
                  </p>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Game Types & Prizes</h3>

                <div className='space-y-2'>
                  <h4 className='font-medium'>
                    Single Digit Game - A, B, C Board
                  </h4>
                  <p>
                    Single digit games can be played on any board between A, B
                    and C.
                  </p>
                  <p>Ticket Price: ₹11</p>
                  <p>Winning Amount: ₹100</p>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Two Digit Game - AB, BC, AC</h4>
                  <p>
                    In a two digit game, players can pick two numbers in the
                    last three digits of the result in the combination of AB, BC
                    and AC.
                  </p>
                  <p>Ticket Price: ₹11</p>
                  <p>Winning Amount: ₹1,000</p>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Three Digit Game - ABC</h4>
                  <p>
                    If a player places a bet on an ABC 3 digit game in a
                    particular lottery there is a three chance of winning. (ABC
                    Matching or BC Matching or C Matching)
                  </p>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price: ₹12</p>
                    <p>Winning Amount: ₹6,250, ₹250, ₹25</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price (only available in Jackpot Lot): ₹22</p>
                    <p>Winning Amount: ₹10,000, ₹1,000</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price: ₹28</p>
                    <p>Winning Amount: ₹15,000, ₹500, ₹50</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price: ₹30</p>
                    <p>Winning Amount: ₹17,500, ₹500, ₹50</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price (only available in kerela lottery): ₹33</p>
                    <p>Winning Amount: ₹20,000, ₹500, ₹50</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price: ₹55</p>
                    <p>Winning Amount: ₹30,000, ₹1,000, ₹100</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price: ₹60</p>
                    <p>Winning Amount: ₹35,000, ₹1,000, ₹100</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price (only available in kerela lottery): ₹65</p>
                    <p>Winning Amount: ₹40,000, ₹1,000, ₹100</p>
                  </div>
                </div>

                <div className='space-y-2'>
                  <h4 className='font-medium'>Four Digit Game - XABC</h4>
                  <p>This one is available only in Kerela Lottery.</p>
                  <p>
                    If a player places a bet on an XABC 4 digit game in a
                    particular lottery there is a chance of winning up to 4
                    chances. (XABC Matching or ABC Matching or BC Matching or C
                    Matching)
                  </p>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price: ₹20</p>
                    <p>This one has one chance of winning!</p>
                    <p>Winning Amount: ₹100,000</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price: ₹50</p>
                    <p>Winning Amount: ₹250,000, ₹5,000, ₹500, ₹50</p>
                  </div>

                  <div className='space-y-1 ml-4'>
                    <p>Ticket Price: ₹100</p>
                    <p>Winning Amount: ₹500,000, ₹10,000, ₹1,000, ₹100</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
