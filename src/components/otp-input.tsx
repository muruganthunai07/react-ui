import type React from 'react';

import { useRef, useState, useEffect } from 'react';
import type { JSX } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  numInputs: number;
  renderInput: (props: any) => JSX.Element;
}

export function OtpInput({
  value,
  onChange,
  numInputs,
  renderInput,
}: OtpInputProps) {
  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getOtpValue = () => (value ? value.toString().split('') : []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value;
    if (val === '') return;

    const newValue = getOtpValue().slice();
    newValue[index] = val.substring(val.length - 1);
    onChange(newValue.join(''));

    // Move to next input if available
    if (index < numInputs - 1) {
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newValue = getOtpValue().slice();

      // If current input has a value, clear it
      if (newValue[index]) {
        newValue[index] = '';
        onChange(newValue.join(''));
        return;
      }

      // Otherwise, move to previous input
      if (index > 0) {
        setActiveInput(index - 1);
        newValue[index - 1] = '';
        onChange(newValue.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      setActiveInput(index - 1);
    } else if (e.key === 'ArrowRight' && index < numInputs - 1) {
      e.preventDefault();
      setActiveInput(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData('text/plain')
      .trim()
      .slice(0, numInputs);

    if (pastedData) {
      onChange(pastedData);
    }
  };

  // Focus on active input
  useEffect(() => {
    inputRefs.current[activeInput]?.focus();
  }, [activeInput]);

  return (
    <div className='flex justify-center gap-2'>
      {Array(numInputs)
        .fill('')
        .map((_, index) => {
          const otpValue = getOtpValue();
          return (
            <div key={index} className='w-14 h-14'>
              {renderInput({
                ref: (ref: HTMLInputElement) =>
                  (inputRefs.current[index] = ref),
                value: otpValue[index] || '',
                onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(e, index),
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(e, index),
                onPaste: handlePaste,
                maxLength: 1,
                className: 'w-full h-full text-xl font-bold',
              })}
            </div>
          );
        })}
    </div>
  );
}
