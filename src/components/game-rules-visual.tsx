import { Card, CardContent } from '@/components/ui/card';

export function GameRulesVisual() {
  return (
    <div className='space-y-8'>
      {/* Single Digit (A, B, C) */}
      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Single Digit Bet (A, B, C)</h3>
          <div className='space-y-4'>
            <div className='flex flex-col items-center'>
              <div className='flex gap-2 mb-2'>
                <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>C</div>
              </div>
              <p className='text-sm text-center'>Choose a single digit (0-9) for position A, B, or C. Win if your chosen digit matches the draw at that position.</p>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              {/* Example for A */}
              <div className='flex flex-col items-center'>
                <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                <div className='mt-2 text-center'>
                  <div className='w-8 h-8 mx-auto rounded-md bg-primary/10 flex items-center justify-center font-bold'>5</div>
                  <p className='text-xs mt-1'>Your bet</p>
                </div>
              </div>
              {/* Example for B */}
              <div className='flex flex-col items-center'>
                <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                <div className='mt-2 text-center'>
                  <div className='w-8 h-8 mx-auto rounded-md bg-primary/10 flex items-center justify-center font-bold'>3</div>
                  <p className='text-xs mt-1'>Your bet</p>
                </div>
              </div>
              {/* Example for C */}
              <div className='flex flex-col items-center'>
                <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>C</div>
                <div className='mt-2 text-center'>
                  <div className='w-8 h-8 mx-auto rounded-md bg-primary/10 flex items-center justify-center font-bold'>7</div>
                  <p className='text-xs mt-1'>Your bet</p>
                </div>
              </div>
            </div>
            <div className='border-t pt-4'>
              <h4 className='font-medium mb-2'>Winning Example (A Bet):</h4>
              <div className='flex justify-center gap-6'>
                <div className='text-center'>
                  <p className='text-xs mb-1'>Draw Result</p>
                  <div className='flex gap-1'>
                    <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold'>5</div>
                    <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold'>8</div>
                    <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>2</div>
                  </div>
                </div>
                <div className='text-center'>
                  <p className='text-xs mb-1'>A Position Match</p>
                  <div className='flex gap-1'>
                    <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>5</div>
                    <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold opacity-30'>8</div>
                    <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold opacity-30'>2</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Double Digit (AB, AC, BC) */}
      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Double Digit Bet (AB, AC, BC)</h3>
          <div className='space-y-4'>
            <div className='flex flex-col items-center'>
              <div className='flex gap-2 mb-2'>
                <div className='flex gap-1'>
                  <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                  <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                </div>
                <div className='flex gap-1'>
                  <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                  <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>C</div>
                </div>
                <div className='flex gap-1'>
                  <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                  <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>C</div>
                </div>
              </div>
              <p className='text-sm text-center'>Choose two digits (0-9) for positions AB, AC, or BC. Win if both digits match the draw at those positions.</p>
            </div>
            <div className='flex justify-center gap-4'>
              {/* Example for AB */}
              <div className='flex flex-col items-center'>
                <div className='flex gap-1'>
                  <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                  <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                </div>
                <div className='mt-2 text-center'>
                  <div className='flex gap-1'>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>2</div>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>7</div>
                  </div>
                  <p className='text-xs mt-1'>Your bet</p>
                </div>
              </div>
            </div>
            <div className='border-t pt-4'>
              <h4 className='font-medium mb-2'>Winning Example (AB Bet):</h4>
              <div className='flex justify-center gap-6'>
                <div className='text-center'>
                  <p className='text-xs mb-1'>Draw Result</p>
                  <div className='flex gap-1'>
                    <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold'>2</div>
                    <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold'>7</div>
                    <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>4</div>
                  </div>
                </div>
                <div className='text-center'>
                  <p className='text-xs mb-1'>AB Position Match</p>
                  <div className='flex gap-1'>
                    <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>2</div>
                    <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>7</div>
                    <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold opacity-30'>4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Triple Digit (ABC) with partial wins */}
      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Triple Digit Bet (ABC)</h3>
          <div className='space-y-4'>
            <div className='flex flex-col items-center'>
              <div className='flex gap-1 mb-2'>
                <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>C</div>
              </div>
              <p className='text-sm text-center'>Choose three digits (0-9) for positions A, B, and C. Win full prize if all match, partial if B & C or only C match.</p>
            </div>
            <div className='flex justify-center'>
              <div className='flex flex-col items-center'>
                <div className='flex gap-1'>
                  <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                  <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                  <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>C</div>
                </div>
                <div className='mt-2 text-center'>
                  <div className='flex gap-1'>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>3</div>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>5</div>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>9</div>
                  </div>
                  <p className='text-xs mt-1'>Your bet</p>
                </div>
              </div>
            </div>
            <div className='border-t pt-4'>
              <h4 className='font-medium mb-2'>Winning Examples:</h4>
              <div className='space-y-2'>
                {/* Full match */}
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>Draw Result</p>
                    <div className='flex gap-1 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold'>3</div>
                      <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>ABC Match (Full Prize)</p>
                    <div className='flex gap-1 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>3</div>
                      <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                </div>
                {/* Partial 2-digit match (B & C) */}
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>Draw Result</p>
                    <div className='flex gap-1 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold'>7</div>
                      <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>BC Match (Partial Prize)</p>
                    <div className='flex gap-1 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold opacity-30'>7</div>
                      <div className='w-8 h-8 rounded-md bg-green-400 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-green-400 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                </div>
                {/* Partial 1-digit match (C) */}
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>Draw Result</p>
                    <div className='flex gap-1 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold'>4</div>
                      <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold'>2</div>
                      <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>C Match (Smallest Prize)</p>
                    <div className='flex gap-1 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold opacity-30'>4</div>
                      <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold opacity-30'>2</div>
                      <div className='w-8 h-8 rounded-md bg-green-200 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* XABC Bet (with X digit and partial wins) */}
      <Card>
        <CardContent className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>XABC Bet (with X digit)</h3>
          <div className='space-y-4'>
            <div className='flex flex-col items-center'>
              <div className='flex gap-2 mb-2'>
                <div className='w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold'>X</div>
                <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>C</div>
              </div>
              <p className='text-sm text-center'>Choose four digits (0-9) for X, A, B, and C. Win full prize if all match, partial if A, B, C match, or smaller if B & C or only C match.</p>
            </div>
            <div className='flex justify-center'>
              <div className='flex flex-col items-center'>
                <div className='flex gap-2'>
                  <div className='w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold'>X</div>
                  <div className='w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>A</div>
                  <div className='w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold'>B</div>
                  <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>C</div>
                </div>
                <div className='mt-2 text-center'>
                  <div className='flex gap-2'>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>1</div>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>3</div>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>5</div>
                    <div className='w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center font-bold'>9</div>
                  </div>
                  <p className='text-xs mt-1'>Your bet</p>
                </div>
              </div>
            </div>
            <div className='border-t pt-4'>
              <h4 className='font-medium mb-2'>Winning Examples:</h4>
              <div className='space-y-2'>
                {/* Full match (X, A, B, C) */}
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>Draw Result</p>
                    <div className='flex gap-2 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white font-bold'>1</div>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold'>3</div>
                      <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>XABC Match (Full Prize)</p>
                    <div className='flex gap-2 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>1</div>
                      <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>3</div>
                      <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                </div>
                {/* Partial 3-digit match (A, B, C) */}
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>Draw Result</p>
                    <div className='flex gap-2 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white font-bold opacity-30'>2</div>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold'>3</div>
                      <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>ABC Match (Partial Prize)</p>
                    <div className='flex gap-2 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-gray-300 flex items-center justify-center text-white font-bold opacity-30'>2</div>
                      <div className='w-8 h-8 rounded-md bg-green-400 flex items-center justify-center text-white font-bold'>3</div>
                      <div className='w-8 h-8 rounded-md bg-green-400 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-green-400 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                </div>
                {/* Partial 2-digit match (B, C) */}
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>Draw Result</p>
                    <div className='flex gap-2 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white font-bold opacity-30'>2</div>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold opacity-30'>7</div>
                      <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>BC Match (Smaller Prize)</p>
                    <div className='flex gap-2 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-gray-300 flex items-center justify-center text-white font-bold opacity-30'>2</div>
                      <div className='w-8 h-8 rounded-md bg-gray-300 flex items-center justify-center text-white font-bold opacity-30'>7</div>
                      <div className='w-8 h-8 rounded-md bg-green-200 flex items-center justify-center text-white font-bold'>5</div>
                      <div className='w-8 h-8 rounded-md bg-green-200 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                </div>
                {/* Partial 1-digit match (C) */}
                <div className='flex items-center gap-4'>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>Draw Result</p>
                    <div className='flex gap-2 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-purple-500 flex items-center justify-center text-white font-bold opacity-30'>2</div>
                      <div className='w-8 h-8 rounded-md bg-red-500 flex items-center justify-center text-white font-bold opacity-30'>7</div>
                      <div className='w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold opacity-30'>4</div>
                      <div className='w-8 h-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                  <div className='text-center'>
                    <p className='text-xs mb-1'>C Match (Smallest Prize)</p>
                    <div className='flex gap-2 justify-center'>
                      <div className='w-8 h-8 rounded-md bg-gray-300 flex items-center justify-center text-white font-bold opacity-30'>2</div>
                      <div className='w-8 h-8 rounded-md bg-gray-300 flex items-center justify-center text-white font-bold opacity-30'>7</div>
                      <div className='w-8 h-8 rounded-md bg-gray-300 flex items-center justify-center text-white font-bold opacity-30'>4</div>
                      <div className='w-8 h-8 rounded-md bg-green-100 flex items-center justify-center text-white font-bold'>9</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
