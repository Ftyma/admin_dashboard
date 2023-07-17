function Currency(price: number) {
  return price.toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
  });
}

export { Currency };
