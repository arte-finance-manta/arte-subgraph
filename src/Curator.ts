import { BigInt, Bytes, log, store } from "@graphprotocol/graph-ts";
import { Account, Balance, CuratorDeployed } from "../generated/schema";
import { Curator as CuratorTemplate } from "../generated/templates";
import {
  Approval,
  Deposit,
  Transfer,
  Withdraw,
} from "../generated/templates/Curator/Curator";

export function handleApproval(event: Approval): void {
  return;
}

export function handleDeposit(event: Deposit): void {
  log.info("Deposit event owner: {}", [event.params.owner.toHexString()]);
  log.info("Deposit event address: {}", [event.address.toHexString()]);
  log.info("Deposit event assets: {}", [event.params.assets.toString()]);

  let curator = CuratorDeployed.load(Bytes.fromHexString(event.address.toHexString()));
  if (!curator) {
    log.info("CuratorDeployed not found: {}", [event.address.toHexString()]);
    return;
  }

  curator.save();

  let balance = Balance.load(
    `${event.address.toHexString()}-${event.params.sender.toHexString()}`
  );

  if (!balance) {
    balance = new Balance(
      `${event.address.toHexString()}-${event.params.sender.toHexString()}`
    );

    balance.balance = BigInt.fromI32(0);
    balance.account = event.params.owner.toHexString();
    balance.curator = curator.curator;
  }

  balance.balance = balance.balance.plus(event.params.assets);
  balance.save();
}

export function handleTransfer(event: Transfer): void {
  return;
}

export function handleWithdraw(event: Withdraw): void {
  return;
  let curator = CuratorDeployed.load(event.address.toHexString());
  if (!curator) {
    return;
  }

  let account = Account.load(event.params.owner.toHexString());
  if (!account) {
    account = new Account(event.params.owner.toHexString());
    account.positions = [];
    account.lend = [];
  }

  const balance = new Balance(
    `${event.address.toHexString()}-${event.params.owner.toHexString()}`
  );

  balance.balance = balance.balance.minus(event.params.assets);
  // if(balance.balance == null) {
  // }else{
  //   const newBalance = balance.balance.minus(event.params.assets);
  //   balance.balance = newBalance;

  // }

  balance.account = account.id;
  balance.curator = curator.curator;
  balance.save();
}
