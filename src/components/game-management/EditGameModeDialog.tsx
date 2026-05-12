import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gameService } from "@/services/game.service";
import type { GameModeDto, UpdateGameModeDto } from "@/types/api";
import { Label } from "@/components/ui/label";

interface BotConfig {
  targetProfit: number;
}

interface EditGameModeDialogProps {
  open: boolean;
  onClose: () => void;
  gameMode: GameModeDto;
  onSave: () => void;
}

export const EditGameModeDialog: React.FC<EditGameModeDialogProps> = ({
  open,
  onClose,
  gameMode,
  onSave,
}) => {
  const [betCloseMinutes, setBetCloseMinutes] = useState<number>(0);
  const [betCloseSeconds, setBetCloseSeconds] = useState<number>(0);
  const [targetProfit, setTargetProfit] = useState<number>(60);
  const [loading, setLoading] = useState(false);
  const [gameTimes, setGameTimes] = useState<string[]>([]);

  useEffect(() => {
    // Convert seconds to minutes and seconds for UI
    const totalSeconds = gameMode.betCloseTimeSeconds || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    setBetCloseMinutes(minutes);
    setBetCloseSeconds(seconds);
    let parsedBot: BotConfig = { targetProfit: 60 };
    if (gameMode.botDetails) {
      try {
        parsedBot = JSON.parse(gameMode.botDetails);
      } catch {
        // ignore parse error, use defaults
      }
    }
    setTargetProfit(parsedBot.targetProfit);
    setGameTimes(gameMode.gameTimes || []);
  }, [gameMode]);

  const isBot = gameMode.isBot;
  const handleGameTimeChange = (idx: number, value: string) => {
    const updated = [...gameTimes];
    updated[idx] = value;
    setGameTimes(updated);
  };
  const handleAddGameTime = () => {
    setGameTimes([...gameTimes, "10:30:00"]);
  };
  const handleRemoveGameTime = (idx: number) => {
    setGameTimes(gameTimes.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    // Validation for minutes and seconds
    if (
      !Number.isInteger(betCloseMinutes) ||
      betCloseMinutes < 0 ||
      betCloseMinutes > 30
    ) {
      alert("Minutes must be between 0 and 30");
      return;
    }
    if (
      !Number.isInteger(betCloseSeconds) ||
      betCloseSeconds < 0 ||
      betCloseSeconds >= 60
    ) {
      alert("Seconds must be between 0 and 59");
      return;
    }
    const betCloseTime = betCloseMinutes * 60 + betCloseSeconds;
    if (betCloseTime <= 0) {
      alert("Total Bet Close Time must be greater than 0");
      return;
    }
    setLoading(true);
    const update: UpdateGameModeDto = {
      BetCloseTimeSeconds: betCloseTime,
      TargetProfit: targetProfit,
      GameTimes: gameTimes,
    };
    await gameService.updateGameMode(gameMode.id, update);
    setLoading(false);
    onSave();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Game Mode</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Bet Close Time:</label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min={0}
                max={30}
                value={betCloseMinutes}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let val = Number(e.target.value);
                  if (val > 30) val = 30;
                  if (val < 0) val = 0;
                  setBetCloseMinutes(val);
                }}
                className="w-20"
                placeholder="Min"
              />
              <span>min</span>
              <Input
                type="number"
                min={0}
                max={59}
                value={betCloseSeconds}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let val = Number(e.target.value);
                  if (val > 59) val = 59;
                  if (val < 0) val = 0;
                  setBetCloseSeconds(val);
                }}
                className="w-20"
                placeholder="Sec"
              />
              <span>sec</span>
            </div>
            {/* Helper text showing total seconds and min/sec conversion */}
            <div className="text-xs text-muted-foreground mt-1">
              Bet Close Time: {betCloseMinutes * 60 + betCloseSeconds} sec ({betCloseMinutes} min {betCloseSeconds} sec)
            </div>
          </div>
          {isBot ? (
            <>
              <div>
                <label className="block mb-1">Target Profit (%):</label>
                <Input
                  type="number"
                  min={0}
                  value={targetProfit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTargetProfit(Number(e.target.value))
                  }
                />
              </div>
            </>
          ): gameMode.name === "Kerala" ? (
            <div>
              <Label htmlFor="time-picker" className="px-1">
                Time(s)
              </Label>
              <div className="flex flex-col gap-2 mt-2">
                {gameTimes.map((time, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      type="time"
                      id={`time-picker-${idx}`}
                      step="1"
                      value={time}
                      onChange={(e) =>
                        handleGameTimeChange(idx, e.target.value)
                      }
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveGameTime(idx)}
                      disabled={gameTimes.length <= 1}
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddGameTime}
                >
                  + Add Time
                </Button>
              </div>
            </div>
          ): <> </>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
