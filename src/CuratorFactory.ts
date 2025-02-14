import { CuratorDeployed as CuratorDeployedEvent } from "../generated/MockCuratorFactory/MockCuratorFactory";
import { CuratorDeployed } from "../generated/schema";

export function handleCuratorDeployed(event: CuratorDeployedEvent): void {
  let entity = new CuratorDeployed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.curator = event.params.curator
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.asset = event.params.asset
  entity.pools = event.params.pools
  entity.allocations = event.params.allocations

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
