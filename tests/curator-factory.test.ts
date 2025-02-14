import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from "matchstick-as/assembly/index";
import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Curator } from "../generated/schema";
import { CuratorDeployed as CuratorDeployedEvent } from "../generated/MockCuratorFactory/MockCuratorFactory";
import { handleCuratorDeployed } from "../src/CuratorFactory";
import { createCuratorDeployedEvent } from "./curator-factory-utils";
