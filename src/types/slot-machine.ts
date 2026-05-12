export interface SlotMachineProps {
  /** Number of reels to display */
  reels?: number
  /** Minimum number that can appear on reels */
  minNumber?: number
  /** Maximum number that can appear on reels */
  maxNumber?: number
  /** Duration of the spinning animation in milliseconds */
  spinDuration?: number
  /** Delay between each reel stopping in milliseconds */
  reelStopDelay?: number
  /** Whether to auto-spin on mount */
  autoSpin?: boolean
  /** Callback when spinning starts */
  onSpinStart?: () => void
  /** Callback when spinning ends with the final numbers */
  onSpinEnd?: (numbers: number[]) => void
  /** Optional preset final numbers (for controlled outcomes) */
  finalNumbers?: number[]
  /** Optional className for styling */
  className?: string
  /** Style variant: 'classic', 'modern', or 'balls' */
  variant?: "classic" | "modern" | "balls"
  /** Size of the slot machine */
  size?: "sm" | "md" | "lg"
  /** Whether to show the lever (classic variant only) */
  showLever?: boolean
  /** Ball color scheme (for balls variant) */
  ballColorScheme?: "default" | "rainbow" | "monochrome" | "gradient"
  /** Direction of ball movement (for balls variant) */
  ballDirection?: "alternating" | "all-up" | "all-down"
  /** Number of visible balls per reel */
  visibleBalls?: number
}

export interface UseSlotMachineProps {
  reels: number
  minNumber: number
  maxNumber: number
  spinDuration: number
  reelStopDelay: number
  finalNumbers?: number[]
  onSpinStart?: () => void
  onSpinEnd?: (numbers: number[]) => void
}

export interface UseSlotMachineReturn {
  numbers: number[]
  isSpinning: boolean
  spin: () => void
  spinningReels: boolean[]
}

export interface BallProps {
  number: number
  isActive: boolean
  isSpinning: boolean
  size: "sm" | "md" | "lg"
  colorScheme: "default" | "rainbow" | "monochrome" | "gradient"
  index: number
  direction: "up" | "down"
  speed: number
}
