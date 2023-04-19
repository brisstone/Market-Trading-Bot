import { calcBuyOrders } from "../../src/utils/calcBuyOrders";
import { calcSellOrders } from "../../src/utils/calcSellOrders";
import { calcOrderTriggers } from "../../src/utils/calcOrderTriggers";

describe("Orders Calculations", () => {
  const bottomSell = 20;
  const spread = 1;
  const orderline = 10;
  const topBuy = 10;

  it("calculate sell orders", (done) => {
    const sellOrders = calcSellOrders(bottomSell, spread, orderline);

    expect(sellOrders).toEqual([
      18, 18.2, 18.4, 18.6, 18.8, 19, 19.2, 19.4, 19.6, 19.8,
    ]);

    done();
  });

  it("calculate buy orders", (done) => {
    const buyOrders = calcBuyOrders(topBuy, spread, orderline);

    expect(buyOrders).toEqual([
      10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11,
    ]);
    done();
  });

  it("calculate buy and sell Trigger Prices", (done) => {
    const spread = 10;
    const price = 10;
    const triggerPrices = calcOrderTriggers(spread, price);

    expect(triggerPrices).toEqual({
      buyTriggerPrice: 9.5,
      sellTriggerPrice: 10.5,
    });
    done();
  });
});
