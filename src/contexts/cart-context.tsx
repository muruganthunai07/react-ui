import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

export interface betNumbers {
  digitX: string;
  digitA: string;
  digitB: string;
  digitC: string;
}
export interface CartItem {
  id: string;
  gameType: string;
  lotName: string;
  drawTime: string;
  drawId: number;
  lotTypeId: number;
  numbers: betNumbers;
  unit: number;
  price: number;
  amount: number;
  expiresAt: Date;
  gameModeName: string;
  lotTypeName: string;
}

interface CartContextType {
  items: CartItem[];
  totalAmount: number;
  totalBets: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemUnit: (id: string, unit: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalBets, setTotalBets] = useState(0);

  // Calculate totals whenever items change
  useEffect(() => {
    const amount = items.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(amount);
    setTotalBets(items.length);
  }, [items]);

  // Check for expired items every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const expired = items.filter((item) => new Date(item.expiresAt) < now);

      if (expired.length > 0) {
        setItems((prev) =>
          prev.filter((item) => new Date(item.expiresAt) >= now)
        );

        if (expired.length === 1) {
          toast({
            title: 'Item Removed',
            description: `${expired[0].lotName} bet has expired and was removed from your cart.`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Items Removed',
            description: `${expired.length} bets have expired and were removed from your cart.`,
            variant: 'destructive',
          });
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [items]);

  const addItem = (item: CartItem) => {
    // Check if item with same game type, lot, and numbers already exists
    const existingItemIndex = items.findIndex(
      (i) =>
        i.gameType === item.gameType &&
        i.lotName === item.lotName &&
        i.numbers === item.numbers &&
        i.drawTime === item.drawTime
    );

    if (existingItemIndex !== -1) {
      // Update unit count instead of adding new item
      const updatedItems = [...items];
      const existingItem = updatedItems[existingItemIndex];
      const newUnit = existingItem.unit + item.unit;
      updatedItems[existingItemIndex] = {
        ...existingItem,
        unit: newUnit,
        amount: newUnit * existingItem.price,
      };
      setItems(updatedItems);

      toast({
        title: 'Bet Updated',
        description: `Added ${item.unit} more unit(s) to your existing bet.`,
      });
    } else {
      setItems((prev) => [...prev, { ...item, id: item.id || uuidv4() }]);

      toast({
        title: 'Bet Added',
        description: `Added ${item.lotName} bet to your cart.`,
      });
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    toast({
      title: 'Bet Removed',
      description: 'Bet removed from your cart.',
    });
  };

  const updateItemUnit = (id: string, unit: number) => {
    if (unit < 1) return;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newAmount = unit * item.price;
          return { ...item, unit, amount: newAmount };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        totalBets,
        addItem,
        removeItem,
        updateItemUnit,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
