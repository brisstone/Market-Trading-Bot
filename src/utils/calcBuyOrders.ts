var Big = require('big.js');


export const calcBuyOrders = (
  topBuy: number,
  spread: number,
  orderline: number
) => {
    
  const buys: number[] = [];

  let spreadT = new Big(spread)
  let topBuyT = new Big(topBuy)
  
  const buySetPoint = topBuyT.add((topBuyT.times((spreadT.div(100))))) ;

  const increament = buySetPoint.minus(topBuyT)

  for (let i = 0; i < orderline; i++) {
    topBuyT = topBuyT.plus(increament)
    buys.push(topBuyT.toNumber());
  }

  return buys;
};
