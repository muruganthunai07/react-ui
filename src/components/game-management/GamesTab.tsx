import { useEffect, useState } from 'react';
import { Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/contexts/GameContext';
import { gameService } from '@/services/game.service';
import { toast } from 'sonner';
import { EditLotsDialog } from './EditLotsDialog';
import type { GameModeDto, AllLots } from '@/types/api';
import { EditGameModeDialog } from './EditGameModeDialog';

interface GamesTabProps {
  searchQuery: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export function GamesTab({ searchQuery }: GamesTabProps) {
  const [gameModes, setGameModes] = useState<GameModeDto[]>([]);
  const [editLotsOpen, setEditLotsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedGameMode, setSelectedGameMode] = useState<GameModeDto | null>(null);
  const { fetchGameModesAndLots } = useGameContext();
  const [allLots, setAllLots] = useState<AllLots[]>([]);
  const [gameModesFull, setGameModesFull] = useState<GameModeDto[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    getGameMode();
  }, []);

  const getGameMode = async () => {
    try {
      const data = await fetchGameModesAndLots();
      setAllLots(data?.allLots || []);
      setGameModesFull(data?.gameModes || []);
      setGameModes(data?.gameModes || []);
    } catch  {
      toast.error('Something went wrong!');
    }
  };

  const updateGameMode = async (id: number) => {
    try {
      await gameService.switchGameMode(id);
      toast.success('Game Mode updated successfully');
      getGameMode();
    } catch  {
      toast.error('Something went wrong');
    }
  };

  const handleEditClick = (gameMode: GameModeDto) => {
    setSelectedGameMode(gameMode);
    setEditDialogOpen(true);
  };

  const filteredGames = gameModes?.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto w-full">
        {!isMobile ? (
          <Table className="min-w-[600px] w-full md:table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead>Game Name</TableHead>
                <TableHead>Bet Close Time (Mins)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGames.map((game) => (
                <TableRow key={game.id} className="md:table-row block md:table-row border-b md:border-0">
                  <TableCell className="font-medium block md:table-cell w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      {game.description}
                      {game.isBot && (
                        <Badge variant="secondary" className="text-xs">
                          Bot
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="block md:table-cell w-full md:w-auto">
                    ({Math.floor(game.betCloseTimeSeconds / 60)} min {game.betCloseTimeSeconds % 60} sec)
                  </TableCell>
                  <TableCell className="block md:table-cell w-full md:w-auto">
                    <div className="flex items-center">
                      <Switch
                        checked={game.isActive}
                        onClick={() => updateGameMode(game.id)}
                      />
                      <span className="ml-2 text-sm">
                        {game.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right block md:table-cell w-full md:w-auto">
                    <Button variant="default" size="sm" className="inline-flex items-center gap-1" onClick={() => handleEditClick(game)}>
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 mt-2 md:mt-0"
                      onClick={() => {
                        const found =
                          gameModesFull.find((g) => g.id === game.id) || null;
                        setSelectedGameMode(found);
                        setEditLotsOpen(true);
                      }}
                    >
                      Edit Lots
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col gap-4 p-2">
            {filteredGames.map((game) => (
                              <div key={game.id} className="rounded-lg border p-4 bg-background">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-base mb-1 flex items-center gap-2">
                      {game.description}
                      {game.isBot && (
                        <Badge variant="secondary" className="text-xs">
                          Bot
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Bet Close Time:</span>({Math.floor(game.betCloseTimeSeconds / 60)} min {game.betCloseTimeSeconds % 60} sec)
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Switch
                      checked={game.isActive}
                      onClick={() => updateGameMode(game.id)}
                    />
                    <span className="ml-2 text-sm mt-1">
                      {game.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="default"
                    size="sm"
                    className="inline-flex items-center gap-1 flex-1"
                    onClick={() => handleEditClick(game)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      const found = gameModesFull.find((g) => g.id === game.id) || null;
                      setSelectedGameMode(found);
                      setEditLotsOpen(true);
                    }}
                  >
                    Edit Lots
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedGameMode && (
        <EditGameModeDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          gameMode={selectedGameMode}
          onSave={getGameMode}
        />
      )}
      {selectedGameMode && (
        <EditLotsDialog
          open={editLotsOpen}
          onOpenChange={setEditLotsOpen}
          gameModeId={selectedGameMode.id}
          allLots={allLots}
          playableLots={selectedGameMode.playableLots}
          onUpdated={getGameMode}
        />
      )}
    </div>
  );
}
