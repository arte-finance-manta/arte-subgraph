import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Accrued,
  AuctionSettled,
  Bid,
  Borrow,
  InterestRateModelChanged,
  LTVChanged,
  OwnershipTransferred,
  PoolCreated,
  Repay,
  Supply,
  SupplyCollateral,
  Withdraw,
  WithdrawCollateral
} from "../generated/MockArtha/MockArtha"

export function createAccruedEvent(
  id: Bytes,
  borrowRate: BigInt,
  interest: BigInt,
  feeShares: BigInt
): Accrued {
  let accruedEvent = changetype<Accrued>(newMockEvent())

  accruedEvent.parameters = new Array()

  accruedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  accruedEvent.parameters.push(
    new ethereum.EventParam(
      "borrowRate",
      ethereum.Value.fromUnsignedBigInt(borrowRate)
    )
  )
  accruedEvent.parameters.push(
    new ethereum.EventParam(
      "interest",
      ethereum.Value.fromUnsignedBigInt(interest)
    )
  )
  accruedEvent.parameters.push(
    new ethereum.EventParam(
      "feeShares",
      ethereum.Value.fromUnsignedBigInt(feeShares)
    )
  )

  return accruedEvent
}

export function createAuctionSettledEvent(
  id: Bytes,
  tokenId: BigInt,
  bidder: Address,
  amount: BigInt
): AuctionSettled {
  let auctionSettledEvent = changetype<AuctionSettled>(newMockEvent())

  auctionSettledEvent.parameters = new Array()

  auctionSettledEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  auctionSettledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  auctionSettledEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  auctionSettledEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return auctionSettledEvent
}

export function createBidEvent(
  id: Bytes,
  tokenId: BigInt,
  bidder: Address,
  amount: BigInt
): Bid {
  let bidEvent = changetype<Bid>(newMockEvent())

  bidEvent.parameters = new Array()

  bidEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  bidEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  bidEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  bidEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return bidEvent
}

export function createBorrowEvent(
  id: Bytes,
  tokenId: BigInt,
  sender: Address,
  onBehalfOf: Address,
  receiver: Address,
  amount: BigInt,
  shares: BigInt
): Borrow {
  let borrowEvent = changetype<Borrow>(newMockEvent())

  borrowEvent.parameters = new Array()

  borrowEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  borrowEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return borrowEvent
}

export function createInterestRateModelChangedEvent(
  irm: Address,
  enabled: boolean
): InterestRateModelChanged {
  let interestRateModelChangedEvent = changetype<InterestRateModelChanged>(
    newMockEvent()
  )

  interestRateModelChangedEvent.parameters = new Array()

  interestRateModelChangedEvent.parameters.push(
    new ethereum.EventParam("irm", ethereum.Value.fromAddress(irm))
  )
  interestRateModelChangedEvent.parameters.push(
    new ethereum.EventParam("enabled", ethereum.Value.fromBoolean(enabled))
  )

  return interestRateModelChangedEvent
}

export function createLTVChangedEvent(
  ltv: BigInt,
  enabled: boolean
): LTVChanged {
  let ltvChangedEvent = changetype<LTVChanged>(newMockEvent())

  ltvChangedEvent.parameters = new Array()

  ltvChangedEvent.parameters.push(
    new ethereum.EventParam("ltv", ethereum.Value.fromUnsignedBigInt(ltv))
  )
  ltvChangedEvent.parameters.push(
    new ethereum.EventParam("enabled", ethereum.Value.fromBoolean(enabled))
  )

  return ltvChangedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPoolCreatedEvent(
  id: Bytes,
  poolParams: ethereum.Tuple
): PoolCreated {
  let poolCreatedEvent = changetype<PoolCreated>(newMockEvent())

  poolCreatedEvent.parameters = new Array()

  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  poolCreatedEvent.parameters.push(
    new ethereum.EventParam("poolParams", ethereum.Value.fromTuple(poolParams))
  )

  return poolCreatedEvent
}

export function createRepayEvent(
  id: Bytes,
  tokenId: BigInt,
  sender: Address,
  onBehalfOf: Address,
  amount: BigInt,
  shares: BigInt
): Repay {
  let repayEvent = changetype<Repay>(newMockEvent())

  repayEvent.parameters = new Array()

  repayEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  repayEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return repayEvent
}

export function createSupplyEvent(
  id: Bytes,
  sender: Address,
  onBehalfOf: Address,
  amount: BigInt,
  shares: BigInt
): Supply {
  let supplyEvent = changetype<Supply>(newMockEvent())

  supplyEvent.parameters = new Array()

  supplyEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  supplyEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return supplyEvent
}

export function createSupplyCollateralEvent(
  id: Bytes,
  tokenId: BigInt,
  sender: Address,
  onBehalOf: Address
): SupplyCollateral {
  let supplyCollateralEvent = changetype<SupplyCollateral>(newMockEvent())

  supplyCollateralEvent.parameters = new Array()

  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  supplyCollateralEvent.parameters.push(
    new ethereum.EventParam("onBehalOf", ethereum.Value.fromAddress(onBehalOf))
  )

  return supplyCollateralEvent
}

export function createWithdrawEvent(
  id: Bytes,
  sender: Address,
  onBehalfOf: Address,
  receiver: Address,
  amount: BigInt,
  shares: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )

  return withdrawEvent
}

export function createWithdrawCollateralEvent(
  id: Bytes,
  tokenId: BigInt,
  sender: Address,
  onBehalfOf: Address,
  receiver: Address
): WithdrawCollateral {
  let withdrawCollateralEvent = changetype<WithdrawCollateral>(newMockEvent())

  withdrawCollateralEvent.parameters = new Array()

  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam(
      "onBehalfOf",
      ethereum.Value.fromAddress(onBehalfOf)
    )
  )
  withdrawCollateralEvent.parameters.push(
    new ethereum.EventParam("receiver", ethereum.Value.fromAddress(receiver))
  )

  return withdrawCollateralEvent
}
