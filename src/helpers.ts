import {
  Address,
  BigInt,
  Bytes,
  crypto,
  ethereum,
} from "@graphprotocol/graph-ts";

import {
  Accrued,
  AuctionSettled,
  Bid,
  Borrow,
  InterestRateModel,
  LTV,
  Pool,
  Repay,
  Supply,
  SupplyCollateral,
  Withdraw,
  WithdrawCollateral,
} from "../generated/schema";

export const BIGINT_18_DECIMAL = new BigInt(10).pow(18);

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export class GetOrCreateResult<T> {
  entity: T | null;
  created: boolean;

  constructor(entity: T | null, created: boolean) {
    this.entity = entity;
    this.created = created;
  }
}

export function getOrCreatePool(id: string): Pool {
  let pool = Pool.load(id);

  if (pool == null) {
    pool = new Pool(id);
    pool.totalSupplyAssets = BigInt.fromI32(0);
    pool.totalBorrowAssets = BigInt.fromI32(0);
    pool.borrowRate = BigInt.fromI32(0);
    pool.utilizationRate = BigInt.fromI32(0);
    pool.lendingRate = BigInt.fromI32(0);

    return pool;
  }

  return pool;
}

export function getOrCreateInterestRateModel(id: string): InterestRateModel {
  let model = InterestRateModel.load(id);

  if (model == null) {
    model = new InterestRateModel(id);

    return model;
  }

  return model;
}

export function getOrCreateLTV(id: string): LTV {
  let ltv = LTV.load(id);

  if (ltv == null) {
    ltv = new LTV(id);

    return ltv;
  }

  return ltv;
}
