export interface BetNumbers {
  digitX?: string | number | null;
  digitA?: string | number | null;
  digitB?: string | number | null;
  digitC?: string | number | null;
}

export const BetNumbersDisplay = ({ numbers }: { numbers: BetNumbers }) => {
  const digits = [
    { label: 'X', value: numbers.digitX, color: 'bg-gray-500' },
    { label: 'A', value: numbers.digitA, color: 'bg-red-500' },
    { label: 'B', value: numbers.digitB, color: 'bg-orange-500' },
    { label: 'C', value: numbers.digitC, color: 'bg-blue-500' },
  ];

  const presentDigits = digits.filter(
    (d) => d.value !== null && d.value !== undefined && d.value !== ''
  );

  if (presentDigits.length === 0) {
    return null;
  }

  return (
    <div className='flex items-center gap-3 flex-wrap'>
      <span className='text-sm text-muted-foreground'>Numbers:</span>
      {presentDigits.map((digit) => (
        <div key={digit.label} className='flex items-center gap-1.5'>
          <div
            className={`w-5 h-5 rounded-full ${digit.color} flex items-center justify-center text-white font-bold text-xs`}
          >
            {digit.label}
          </div>
          <span className='font-semibold text-sm'>{digit.value}</span>
        </div>
      ))}
    </div>
  );
}; 