import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useRef } from 'react';

interface BiBoxContainerProps {
  digit: string;
  value: string[];
  lotName: string;
  gameKey: 'single' | 'doubleAB' | 'doubleAC' | 'doubleBC';
  handleQuantityChange: (
    lotName: string,
    gameKey: 'single' | 'doubleAB' | 'doubleAC' | 'doubleBC',
    quantity: number,
    position?: number
  ) => void;
  quantities: Record<string, { single: number[]; doubleAB?: number; doubleAC?: number; doubleBC?: number }>;
  handleNumberChange: (
    lotName: string,
    gameKey: 'single' | 'doubleAB' | 'doubleAC' | 'doubleBC',
    value: string,
    position?: number
  ) => void;
  position: number;
  handleAddBet: (
    lotName: string,
    gameKey: 'single' | 'doubleAB' | 'doubleAC' | 'doubleBC',
    position: number
  ) => void;
  disabled?: boolean;
}

function BiBoxContainer({
  digit,
  value,
  lotName,
  gameKey,
  handleQuantityChange,
  quantities,
  handleNumberChange,
  position,
  handleAddBet,
  disabled = false,
}: BiBoxContainerProps) {
  const colors = ['red', 'orange', 'blue', 'green'];
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const getValue = (value: string[], index: number) => {
    if (gameKey === 'single') {
      return value[0];
    } else {
      return value[index];
    }
  };
  const isSingle = gameKey === 'single';
  const quantity = isSingle
    ? quantities[lotName]?.single?.[position] ?? 1
    : quantities[lotName]?.[gameKey] ?? 1;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, ind: number) => {
    const val = e.target.value;
    handleNumberChange(
      lotName,
      gameKey,
      val,
      isSingle ? position : ind
    );
    // Only auto-move if value is a single digit
    if (/^[0-9]$/.test(val) && inputRefs.current[ind + 1]) {
      inputRefs.current[ind + 1]?.focus();
    }
  };

  return (
    <div className='flex items-center justify-between mb-3 flex-wrap gap-2 sm:flex-nowrap'>
      <div className='flex gap-1'>
        {digit &&
          digit
            .split('')
            .map((num) => (
              <div
                className={`w-10 h-10 rounded-full bg-${colors[position]}-500 flex items-center justify-center text-white font-bold`}
              >
                {num}
              </div>
            ))}
      </div>

      <div className='flex gap-1'>
        {digit &&
          digit?.split('')?.map((_, ind) => (
            <Input
              type='text'
              value={getValue(value, ind)}
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
      <div className='flex items-center'>
        <Button
          variant='outline'
          size='icon'
          className='w-8 h-8 rounded-full'
          disabled={quantity === 1}
          onClick={() =>
            handleQuantityChange(
              lotName,
              gameKey,
              quantity - 1,
              position
            )
          }
        >
          -
        </Button>
        <span className='mx-2 sm:mx-4 w-6 text-center'>
          {quantity}
        </span>
        <Button
          variant='outline'
          size='icon'
          className='w-8 h-8 rounded-full'
          onClick={() =>
            handleQuantityChange(
              lotName,
              gameKey,
              quantity + 1,
              position
            )
          }
        >
          +
        </Button>
      </div>
      <Button
        className='bg-primary/10 hover:bg-primary/20 text-primary'
        onClick={() => handleAddBet(lotName, gameKey, position)}
        disabled={disabled}
      >
        Add
      </Button>
    </div>
  );
}

export default BiBoxContainer;
