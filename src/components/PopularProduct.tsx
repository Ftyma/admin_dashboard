import React from "react";

interface PopularProductProps<T> {
  itemList: T[];
  getProductName: (item: T) => string;
  getProductId: (item: T) => number;
}

const PopularProduct = <T,>({
  itemList,
  getProductName,
  getProductId,
}: PopularProductProps<T>) => {
  const findTop10MostPopularProducts = (): T[] => {
    const productCounts: Record<number, number> = {};

    itemList.forEach((item) => {
      const productId = getProductId(item);
      productCounts[productId] = (productCounts[productId] || 0) + 1;
    });

    const sortedItems = Object.entries(productCounts).sort(
      ([, countA], [, countB]) => countB - countA
    );

    const top10Items = sortedItems
      .slice(0, 10)
      .map(([productId]) =>
        itemList.find((item) => getProductId(item) === Number(productId))
      )
      .filter((item) => item !== undefined) as T[];

    return top10Items;
  };

  const top10Products = findTop10MostPopularProducts();

  return (
    <>
      <ul>
        {top10Products.map((item) => (
          <>
            <h1>Top 10 Most Popular Product</h1>
            <li key={getProductId(item)}>{getProductName(item)}</li>
          </>
        ))}
      </ul>
    </>
  );
};

export default PopularProduct;
