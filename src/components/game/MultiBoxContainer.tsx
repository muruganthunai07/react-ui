import React, { useRef } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface MultiBoxContainerProps {
  digit: string;
  value: string[];
  lotName: string;
  gameKey: string;
  handleQuantityChange: (
    lotName: string,
    gameKey: string,
    quantity: number
  ) => void;
  quantities: { [key: string]: { [key: string]: number } };
  handleNumberChange: (
    lotName: string,
    gameKey: string,
    value: string,
    index: number
  ) => void;
  position: number;
  handleAddBet: (lotName: string, gameKey: string, position: number) => void;
  handleBoxBet: (lotName: string, gameKey: string) => void;
  disabled?: boolean;
}

function MultiBoxContainer({
  digit,
  value,
  lotName,
  gameKey,
  handleQuantityChange,
  quantities,
  handleNumberChange,
  position,
  handleAddBet,
  handleBoxBet,
  disabled = false,
}: MultiBoxContainerProps) {
  const colors = ['red', 'orange', 'blue', 'green'];
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, ind: number) => {
    const val = e.target.value;
    handleNumberChange(lotName, gameKey, val, ind);
    // Only auto-move if value is a single digit
    if (/^[0-9]$/.test(val) && inputRefs.current[ind + 1]) {
      inputRefs.current[ind + 1]?.focus();
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-1 justify-center'>
        {digit &&
          digit
            .split('')
            .map((num, ind) => (
              <div
                className={`w-10 h-10 rounded-full bg-${colors[ind]}-500 flex items-center justify-center text-white font-bold`}
              >
                {num}
              </div>
            ))}
      </div>

      <div className='flex flex-wrap justify-between items-center gap-3'>
        <div className='flex items-center'>
          <Button
            variant='outline'
            size='icon'
            className='w-8 h-8 rounded-full'
            disabled={quantities[lotName]?.[gameKey] === 1}
            onClick={() =>
              handleQuantityChange(
                lotName,
                gameKey,
                quantities[lotName]?.[gameKey] - 1
              )
            }
          >
            -
          </Button>
          <span className='mx-2 sm:mx-4 w-6 text-center'>
            {quantities[lotName]?.[gameKey] || 1}
          </span>
          <Button
            variant='outline'
            size='icon'
            className='w-8 h-8 rounded-full'
            onClick={() =>
              handleQuantityChange(
                lotName,
                gameKey,
                quantities[lotName]?.[gameKey] + 1
              )
            }
          >
            +
          </Button>
        </div>

        <div className='flex gap-2'>
          {digit &&
            digit?.split('')?.map((_, ind) => (
              <Input
                type='text'
                value={value[ind]}
                onChange={(e) => handleInputChange(e, ind)}
                className='w-12 h-10 text-center'
                maxLength={1}
                inputMode='numeric'
                pattern='[0-9]*'
                ref={(ref) => {
                  inputRefs.current[ind] = ref;
                }}
              />
            ))}
        </div>
      </div>

      <div className='flex justify-end gap-2'>
        <Button
          className='bg-purple-500/10 hover:bg-purple-500/20 text-purple-500'
          onClick={() => handleBoxBet(lotName, gameKey)}
          disabled={disabled}
        >
          BOX
        </Button>
        <Button
          className='bg-primary/10 hover:bg-primary/20 text-primary'
          onClick={() => handleAddBet(lotName, gameKey, position)}
          disabled={disabled}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default React.memo(MultiBoxContainer);
