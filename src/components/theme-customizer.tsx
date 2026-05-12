import {
  useTheme,
  type ThemeColor,
} from '@/components/theme-provider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ColorOption {
  name: ThemeColor;
  color: string;
}

const colorOptions: ColorOption[] = [
  {
    name: 'default',
    color: 'bg-zinc-400 dark:bg-zinc-800',
  },
  {
    name: 'red',
    color: 'bg-red-300 dark:bg-red-600',
  },
  {
    name: 'rose',
    color: 'bg-rose-300 dark:bg-rose-600',
  },
  {
    name: 'orange',
    color: 'bg-orange-300 dark:bg-orange-600',
  },
  {
    name: 'yellow',
    color: 'bg-yellow-300 dark:bg-yellow-600',
  },
  {
    name: 'green',
    color: 'bg-green-300 dark:bg-green-600',
  },
  {
    name: 'blue',
    color: 'bg-blue-300 dark:bg-blue-600',
  },
  {
    name: 'violet',
    color: 'bg-violet-300 dark:bg-violet-600',
  },
  {
    name: 'pink',
    color: 'bg-pink-300 dark:bg-pink-600',
  },
  {
    name: 'indigo',
    color: 'bg-indigo-300 dark:bg-indigo-600',
  },
  {
    name: 'cyan',
    color: 'bg-cyan-300 dark:bg-cyan-600',
  },
  {
    name: 'emerald',
    color: 'bg-emerald-300 dark:bg-emerald-600',
  },
];

// const opacityOptions: ThemeOpacity[] = [0, 0.3, 0.5, 0.75, 1.0]
export function ThemeCustomizer() {
  const {
    theme,
    color,
    // opacity,
    setTheme,
    setColor,
    // setOpacity,
  } = useTheme();

  return (
    <Tabs defaultValue='theme'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='theme'>Theme</TabsTrigger>
        <TabsTrigger value='color'>Color</TabsTrigger>
      </TabsList>

      <TabsContent value='theme' className='space-y-4 py-4'>
        <div className='space-y-2'>
          <RadioGroup
            defaultValue={theme}
            onValueChange={(value) =>
              setTheme(value as 'light' | 'dark' | 'system')
            }
            className='flex flex-col space-y-2'
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='light' id='light' />
              <Label
                htmlFor='light'
                className='flex items-center gap-2 cursor-pointer'
              >
                <Sun className='h-4 w-4' />
                Light
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='dark' id='dark' />
              <Label
                htmlFor='dark'
                className='flex items-center gap-2 cursor-pointer'
              >
                <Moon className='h-4 w-4' />
                Dark
              </Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='system' id='system' />
              <Label
                htmlFor='system'
                className='flex items-center gap-2 cursor-pointer'
              >
                <Monitor className='h-4 w-4' />
                System
              </Label>
            </div>
          </RadioGroup>
        </div>
      </TabsContent>

      <TabsContent value='color' className='py-4'>
        <div className='grid grid-cols-4 gap-3'>
          {colorOptions.map((option) => (
            <div key={option.name} className='text-center'>
              <button
                onClick={() => setColor(option.name)}
                className={cn(
                  'w-12 h-12 rounded-full mx-auto flex items-center justify-center transition-all duration-200 hover:scale-105',
                  option.color,
                  color === option.name && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                )}
                aria-label={`Set color theme to ${option.name}`}
              >
                {color === option.name && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='h-5 w-5 text-white drop-shadow-sm'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                )}
              </button>
              <p className='mt-1 text-xs capitalize font-medium'>{option.name}</p>
            </div>
          ))}
        </div>
      </TabsContent>

    </Tabs>
  );
}
