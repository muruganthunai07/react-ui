import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

export function GameCards() {
  const games = [
    {
      id: 'brilliant-night',
      title: 'Brilliant Night',
      prize: '₹ 40,000',
      bgColor: 'from-purple-500 to-pink-500',
      ticketPrice: '₹10 per Ticket',
    },
    {
      id: 'radiant-lottery',
      title: 'Radiant Lottery',
      prize: '₹ 40,000',
      bgColor: 'from-yellow-500 to-orange-500',
      ticketPrice: '₹10 per Ticket',
    },
  ];

  return (
    <div className='grid grid-cols-2 gap-4'>
      {games.map((game) => (
        <Link key={game.id} to='/3-digit-game'>
          <Card className='overflow-hidden border-0 shadow-lg'>
            <CardContent
              className={`p-0 bg-gradient-to-r ${game.bgColor} text-white`}
            >
              <div className='p-4'>
                <div className='flex justify-between items-start'>
                  <div className='space-y-1'>
                    <h3 className='font-bold text-lg leading-tight'>
                      {game.title}
                    </h3>
                    <p className='text-xs text-white/80'>{game.ticketPrice}</p>
                  </div>
                  <div className='text-right'>
                    <div className='text-xs font-medium'>WIN-PRIZE</div>
                    <div className='text-xl font-bold'>{game.prize}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
