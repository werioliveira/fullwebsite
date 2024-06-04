export const sortProductsPrice = (filteredProducts, paramsObj) =>{
    return filteredProducts.sort((p1, p2) => {
        switch (paramsObj?.sort?.[0]) {
          case "newest":
            return Date.parse(p2.createdAt) - Date.parse(p1.createdAt);
          case "price high":
            return p2.price - p1.price;
          case "price low":
            return p1.price - p2.price;
          default:
            return 0;
        }
      });
}