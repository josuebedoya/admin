const formattedMoney = (value: number) => {
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
  });
};

type DateFormat = 'short' | 'medium' | 'long';

const formattedDate = (dateString: string, format?: DateFormat) => {
  const datePart = dateString.split('T')[0] || dateString.split(' ')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  
  const date = new Date(year, month - 1, day);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  if (format === 'short') {
    options.month = 'short';
  } else if (format === 'medium') {
    options.month = 'short';
    options.day = '2-digit';
  }

  return date.toLocaleDateString('es-CO', options);
};

export {
  formattedMoney,
  formattedDate
}