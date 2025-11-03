export const priceFormat = (price: number) => {
    return new Intl.NumberFormat("ru-RU").format(price);
  };