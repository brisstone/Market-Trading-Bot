var Big = require("big.js");

export const calcSellOrders = (
  bottomSell: number,
  spread: number,
  orderline: number
) => {
  const sells: number[] = [];

  let spreadT = new Big(spread);
  let bottomSellT = new Big(bottomSell);

  const sellingSetPoint = bottomSellT.minus(
    bottomSellT.times(spreadT.div(100))
  );

  const decreament = bottomSellT.minus(sellingSetPoint);
 
  for (let i = 0; i < orderline; i++) {
    bottomSellT = bottomSellT.minus(decreament);
    sells.push(bottomSellT.toNumber());
  }
 
  return sells.sort();
};
