const formattedMoney = (value: number) => {
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
  });
}

export{
  formattedMoney
}