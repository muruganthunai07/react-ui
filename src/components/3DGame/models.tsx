// --- Types ---
type SingleArray = (string | null)[]; // [A, B, C]
type DoubleArray = (string | null)[]; // [x, y]
type TripleArray = (string | null)[]; // [A, B, C]
type FourArray = (string | null)[]; // [X, A, B, C]

interface BetSet {
  single?: SingleArray;
  doubleAB?: DoubleArray;
  doubleAC?: DoubleArray;
  doubleBC?: DoubleArray;
  triple?: TripleArray;
  four?: FourArray;
  [key: string]: SingleArray | DoubleArray | TripleArray | FourArray | undefined;
}

export interface BetNumbersMap {
  [key: string]: BetSet;
}

interface QuantitiesSet {
  single?: number[];
  doubleAB?: number;
  doubleAC?: number;
  doubleBC?: number;
  triple?: number;
  four?: number;
  [key: string]: number | number[] | undefined;
}

export interface QuantitiesMap {
  [key: string]: QuantitiesSet;
}

export const ERROR_CODES = {
  '5569': 'Failed to fetch draws. Please try again later.',
  '5568': 'Exceiption in draw',
  '5567' : 'Time zone mismatch'
};