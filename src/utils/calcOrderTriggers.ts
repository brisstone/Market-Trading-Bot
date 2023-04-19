var Big = require("big.js");

export const calcOrderTriggers = (triggerSpread: number, price: number) => {
  let spreadT = new Big(triggerSpread);
  let priceT = new Big(price);

  const diffPrice = spreadT.div(2).div(100).times(priceT);

  const buyTriggerPrice = priceT.minus(diffPrice).toNumber();

  const sellTriggerPrice = priceT.add(diffPrice).toNumber();

  return { buyTriggerPrice, sellTriggerPrice };
};
