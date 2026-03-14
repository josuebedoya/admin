const formattedMoney = (value: number) => {
  if (!value) return '$0';

  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
  });
};

type DateFormat = 'short' | 'medium' | 'long' | 'numeric' | 'input';
const formattedDate = (date: string | Date, format?: DateFormat) => {
  if(!date) return '';

  const newDate = date instanceof Date
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : (() => {
      const datePart = date?.split('T')[0] || date?.split(' ')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      return new Date(year, month - 1, day);
    })();

  if (format === 'input') {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const op: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (format === 'short') {
    op.month = 'short';
  } else if (format === 'medium') {
    op.month = 'short';
    op.day = '2-digit';
  } else if (format === 'numeric') {
    op.year = 'numeric';
    op.month = '2-digit';
    op.day = '2-digit';
  }

  return newDate.toLocaleDateString('es-CO', op);
};

const calculateProfit = (max: number, min: number, q: number) => {
  const profit = Number(max) - Number(min);
  return Number((profit * q));
};

function calculateProfitPercent(max: number, min: number) {
  if (min === 0) return 100;
  return Number((((max - min) / min) * 100).toFixed(2));
}

type Item = {
  price: number;
  quantity: number;
  price_sale: number;
}

const getTotalAmount = (items: Item[], key: 'price' | 'price_sale') => {
  const total = items.reduce((acc, p) => acc + p[key], 0);
  return total;
};

const getTotalProfit = (items: Item[]) => {
  return items.reduce((acc, p) => acc + calculateProfit(p.price, p.price_sale, p.quantity), 0);
};

const getPromedioProfitPercent = (items: Item[]) => {
  const totalProfitPercent = items.reduce((acc, p) => acc + calculateProfitPercent(p.price, p.price_sale), 0);
  return Number((totalProfitPercent / items.length).toFixed(2));
}

const getTotalAmountProduct = (items: Item[]) => {
  const total = items.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  return total;
}

export {
  formattedMoney,
  formattedDate,
  calculateProfit,
  calculateProfitPercent,
  getTotalAmount,
  getTotalProfit,
  getPromedioProfitPercent,
  getTotalAmountProduct
}