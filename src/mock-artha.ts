import { BigInt, Bytes, Entity, log, store } from "@graphprotocol/graph-ts";
import {
  Accrued as AccruedEvent,
  AuctionSettled as AuctionSettledEvent,
  Bid as BidEvent,
  Borrow as BorrowEvent,
  InterestRateModelChanged as InterestRateModelChangedEvent,
  LTVChanged as LTVChangedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PoolCreated as PoolCreatedEvent,
  Repay as RepayEvent,
  Supply as SupplyEvent,
  SupplyCollateral as SupplyCollateralEvent,
  Withdraw as WithdrawEvent,
  WithdrawCollateral as WithdrawCollateralEvent,
} from "../generated/MockArtha/MockArtha";
import {
  Account,
  Accrued,
  AuctionSettled,
  Bid,
  Borrow,
  Collateral,
  InterestRateModel,
  LoanToken,
  LTV,
  Pool,
  Position,
  Repay,
  Supply,
  SupplyCollateral,
  Token,
  Withdraw,
  WithdrawCollateral,
} from "../generated/schema";
import {
  BIGINT_18_DECIMAL,
  getOrCreateInterestRateModel,
  getOrCreatePool,
  ZERO_ADDRESS,
} from "./helpers";

export function handleAccrued(event: AccruedEvent): void {
  let pool = Pool.load(event.params.id.toHexString());

  if (pool == null) {
    return;
  }

  pool.totalSupplyAssets = pool.totalSupplyAssets.plus(event.params.interest);
  pool.totalBorrowAssets = pool.totalBorrowAssets.plus(event.params.interest);

  pool.borrowRate = event.params.borrowRate;

  if (pool.totalSupplyAssets.equals(new BigInt(0))) {
    pool.utilizationRate = BigInt.fromI32(0);
  } else {
    pool.utilizationRate = pool.totalBorrowAssets.div(pool.totalSupplyAssets);
  }

  if (pool.utilizationRate.equals(new BigInt(0))) {
    log.info(
      "Masuk utilization rate 0, Pool: {} Borrow Rate: {} Utilization Rate: {}",
      [pool.id, pool.borrowRate.toString(), pool.utilizationRate.toString()]
    );

    pool.lendingRate = BigInt.fromI32(0);
  } else {
    log.info(
      "Masuk utilization rate bukan 0, Pool: {} Borrow Rate: {} Utilization Rate: {}",
      [pool.id, pool.borrowRate.toString(), pool.utilizationRate.toString()]
    );

    pool.lendingRate = pool.borrowRate.div(pool.utilizationRate);
  }

  pool.borrowAPY = event.params.interest;
  pool.supplyAPY = event.params.interest.times(pool.utilizationRate);

  pool.save();
}

export function handleAuctionSettled(event: AuctionSettledEvent): void {
  let entity = new AuctionSettled(`${event.params.id}-${event.params.tokenId}`);

  entity.tokenId = event.params.tokenId;
  entity.bidder = event.params.bidder;
  entity.amount = event.params.amount;
  entity.poolId = event.params.id.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBid(event: BidEvent): void {
  let entity = new Bid(
    `${event.params.tokenId}-${event.transaction.hash.toHexString()}`
  );
  entity.tokenId = event.params.tokenId;
  entity.bidder = event.params.bidder;
  entity.amount = event.params.amount;
  entity.poolId = event.params.id.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleBorrow(event: BorrowEvent): void {
  let entity = new Borrow(
    `${event.params.id}-${
      event.params.tokenId
    }-${event.params.onBehalfOf.toHexString()}`
  );
  entity.tokenId = event.params.tokenId;
  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.receiver = event.params.receiver;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  entity.poolId = event.params.id.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let pool = Pool.load(event.params.id.toHexString());

  if (pool == null) {
    return;
  }

  pool.totalBorrowAssets = pool.totalBorrowAssets.plus(event.params.amount);
  pool.totalBorrowShares = pool.totalBorrowShares.plus(event.params.shares);
  pool.save();

  let position = Position.load(
    `${event.params.id.toHexString()}-${event.params.tokenId.toString()}`
  );

  if (position == null) {
    return;
  }

  position.borrowShares = position.borrowShares.plus(event.params.shares);

  position.save();
}

export function handleInterestRateModelChanged(
  event: InterestRateModelChangedEvent
): void {
  let irmId = event.params.irm.toHexString();
  let irm = getOrCreateInterestRateModel(irmId);

  if (event.params.enabled == false) {
    if (irm != null) {
      store.remove("InterestRateModel", irmId);
    }
    return;
  }

  if (irm == null) {
    irm = new InterestRateModel(irmId);
  }

  irm.irm = event.params.irm;

  irm.blockNumber = event.block.number;
  irm.blockTimestamp = event.block.timestamp;
  irm.transactionHash = event.transaction.hash;

  irm.save();
}

export function handleLTVChanged(event: LTVChangedEvent): void {
  let ltvId = event.params.ltv.toHexString();
  let ltv = LTV.load(ltvId);

  if (event.params.enabled == false) {
    if (ltv != null) {
      store.remove("LTV", ltvId);
    }
    return;
  }

  if (ltv == null) {
    ltv = new LTV(ltvId);
  }

  ltv.ltv = event.params.ltv;
  ltv.blockNumber = event.block.number;
  ltv.blockTimestamp = event.block.timestamp;
  ltv.transactionHash = event.transaction.hash;

  ltv.save();
}

export function handlePoolCreated(event: PoolCreatedEvent): void {
  let collateralToken = event.params.poolParams.collateralToken;
  let loanToken = event.params.poolParams.loanToken;

  let entityCollateral = Collateral.load(collateralToken.toHexString());
  let entityLoan = LoanToken.load(loanToken.toHexString());

  if (entityCollateral == null) {
    entityCollateral = new Collateral(collateralToken.toHexString());
    entityCollateral.collateralToken = collateralToken;

    entityCollateral.save();
  }

  if (entityLoan == null) {
    entityLoan = new LoanToken(loanToken.toHexString());
    entityLoan.loanToken = loanToken;

    entityLoan.save();
  }

  let pool = new Pool(event.params.id.toHexString());
  pool.oracle = event.params.poolParams.oracle;
  pool.irm = event.params.poolParams.irm;
  pool.ltv = event.params.poolParams.ltv;
  pool.lth = event.params.poolParams.lth;

  pool.collateralAddress = event.params.poolParams.collateralToken;
  pool.collateralToken = entityCollateral.id;
  pool.loanAddress = event.params.poolParams.loanToken;
  pool.loanToken = entityLoan.id;

  pool.totalSupplyAssets = new BigInt(0);
  pool.totalBorrowAssets = new BigInt(0);
  pool.borrowRate = new BigInt(0);
  pool.utilizationRate = new BigInt(0);
  pool.lendingRate = new BigInt(0);
  pool.totalSupplyShares = new BigInt(0);
  pool.totalBorrowShares = new BigInt(0);

  pool.blockNumber = event.block.number;
  pool.blockTimestamp = event.block.timestamp;
  pool.transactionHash = event.transaction.hash;

  pool.save();
}

export function handleRepay(event: RepayEvent): void {
  let entity = new Repay(event.params.id);
  entity.tokenId = event.params.tokenId;
  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  entity.poolId = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let pool = Pool.load(event.params.id.toHexString());

  if (pool == null) {
    return;
  }

  pool.totalBorrowAssets = pool.totalBorrowAssets.minus(event.params.amount);
  pool.totalBorrowShares = pool.totalBorrowShares.minus(event.params.shares);

  pool.save();
}

export function handleSupply(event: SupplyEvent): void {
  let entity = Supply.load(
    `${event.params.id.toHexString()}-${event.params.onBehalfOf.toHexString()}`
  );

  if (entity == null) {
    entity = new Supply(
      `${event.params.id.toHexString()}-${event.params.onBehalfOf.toHexString()}`
    );
  }

  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  entity.poolId = event.params.id;
  entity.pool = event.params.id.toHexString();

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let pool = Pool.load(event.params.id.toHexString());

  if (pool == null) {
    return;
  }

  pool.totalSupplyAssets = pool.totalSupplyAssets.plus(event.params.amount);
  pool.totalSupplyShares = pool.totalSupplyShares.plus(event.params.shares);

  pool.save();

  let account = Account.load(event.params.onBehalfOf.toHexString());

  if (account == null) {
    account = new Account(event.params.onBehalfOf.toHexString());
    account.positions = [];
    account.lend = [];
    account.save();
  }

  const lend: Array<string> = account.lend || [];

  lend.push(entity.id);

  account.lend = lend;

  account.save();
}

export function handleSupplyCollateral(event: SupplyCollateralEvent): void {
  let token = new Token(
    `${event.params.id.toHexString()}-${event.params.tokenId.toString()}-${event.params.onBehalOf.toHexString()}`
  );

  token.pool = event.params.id.toHexString();
  token.tokenId = event.params.tokenId;

  token.save();

  let account = Account.load(event.params.onBehalOf.toHexString());

  if (account == null) {
    account = new Account(event.params.onBehalOf.toHexString());
    account.positions = [];
    account.lend = [];
  }

  let position = new Position(
    `${event.params.id.toHexString()}-${event.params.tokenId.toString()}`
  );

  position.pool = event.params.id.toHexString();
  position.token = token.id;
  position.account = account.id;
  position.borrowShares = new BigInt(0);
  position.tokenId = event.params.tokenId;

  const positions: Array<string> = account.positions || [];

  positions.push(position.id);

  account.positions = positions;

  account.save();

  position.save();

  let supplyCollateral = SupplyCollateral.load(
    `${event.params.id.toHexString()}-${event.params.tokenId.toString()}`
  );

  if (supplyCollateral == null) {
    supplyCollateral = new SupplyCollateral(
      `${event.params.id.toHexString()}-${event.params.tokenId.toString()}`
    );
  }

  supplyCollateral.tokenId = event.params.tokenId;
  supplyCollateral.blockNumber = event.block.number;
  supplyCollateral.blockTimestamp = event.block.timestamp;
  supplyCollateral.transactionHash = event.transaction.hash;
  supplyCollateral.onBehalOf = event.params.onBehalOf;
  supplyCollateral.sender = event.params.sender;
  supplyCollateral.poolId = event.params.id;
  supplyCollateral.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(event.params.id);
  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.receiver = event.params.receiver;
  entity.amount = event.params.amount;
  entity.shares = event.params.shares;
  entity.poolId = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let pool = Pool.load(event.params.id.toHexString());

  if (pool == null) {
    return;
  }

  pool.totalSupplyAssets = pool.totalSupplyAssets.minus(event.params.amount);
  pool.totalSupplyShares = pool.totalSupplyShares.minus(event.params.shares);
  pool.save();
}

export function handleWithdrawCollateral(event: WithdrawCollateralEvent): void {
  let entity = new WithdrawCollateral(event.params.id.toHexString());
  entity.tokenId = event.params.tokenId;
  entity.sender = event.params.sender;
  entity.onBehalfOf = event.params.onBehalfOf;
  entity.receiver = event.params.receiver;
  entity.poolId = event.params.id;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {}
