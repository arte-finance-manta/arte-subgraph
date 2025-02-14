import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { Accrued } from "../generated/schema"
import { Accrued as AccruedEvent } from "../generated/MockArtha/MockArtha"
import { handleAccrued } from "../src/mock-artha"
import { createAccruedEvent } from "./mock-artha-utils"
