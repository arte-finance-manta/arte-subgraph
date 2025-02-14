import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { CuratorDeployed } from "../generated/MockCuratorFactory/MockCuratorFactory"

export function createCuratorDeployedEvent(
  curator: Address,
  pools: Array<Bytes>,
  allocations: Array<BigInt>
): CuratorDeployed {
  let curatorDeployedEvent = changetype<CuratorDeployed>(newMockEvent())

  curatorDeployedEvent.parameters = new Array()

  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam("curator", ethereum.Value.fromAddress(curator))
  )
  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam("pools", ethereum.Value.fromFixedBytesArray(pools))
  )
  curatorDeployedEvent.parameters.push(
    new ethereum.EventParam(
      "allocations",
      ethereum.Value.fromUnsignedBigIntArray(allocations)
    )
  )

  return curatorDeployedEvent
}
