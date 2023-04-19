export interface IJobQueue {
  listingId?: number;
  name?: string;
  spread?: number;
  triggerSpread?: number;
  volumePerOrder?: number;
  orderline?: number;
  interval: number;
  quantityPerOrder?: number;
  repeatJobKey?: string;
}

export interface IJobOrders {
  bottomSell: number;
  topBuy: number;
  listingId: number;
}

export interface IListingId {
  listingId: string;
}

export declare module namespace {
  export interface Action {
    _id: string;
    timestamp: Date;
    actor: string;
    action: string;
  }

  export interface Id {
    offer_type: string;
  }

  export interface TradeData {
    _id: Id;
    amount: number;
  }

  export interface RootListingObject {
    _id: string;
    auction_enabled: boolean;
    trading_enabled: boolean;
    previous_price: number;
    reserved_units: number;
    insurance_value: number;
    insurance_per_unit: number;
    user_id: string;
    listing_charge: number;
    artwork_id: string;
    trade_mode: string;
    total_units: number;
    status: string;
    actions: Action[];
    subscribed_units: number;
    listing_payment: any[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    insurance_rate: number;
    price: number;
    trade_data: TradeData[];
    artwork_data: any[];
  }
}
export interface OrderTypeI {
  amount: number;
  quantity: number;
  _id: string;
}

