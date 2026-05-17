import {createConfig} from "ponder";

import {AgentRegistryAbi} from "./abis/AgentRegistry";
import {AgentReputationOracleAbi} from "./abis/AgentReputationOracle";
import {LiquidReputationAbi} from "./abis/LiquidReputation";
import {RewardDistributorAbi} from "./abis/RewardDistributor";
import {SquadiumAbi} from "./abis/Squadium";

/**
 * Squadium indexer config — Mantle Sepolia first, will add mainnet at W3.
 *
 * Addresses are env-driven so we redeploy → patch .env.local → restart.
 * START_BLOCK should be set to the deployment block to avoid scanning the
 * full chain.
 */
export default createConfig({
  chains: {
    mantleSepolia: {
      id: 5003,
      rpc: process.env.PONDER_RPC_URL_5003 ?? "https://rpc.sepolia.mantle.xyz",
    },
  },
  contracts: {
    AgentRegistry: {
      chain: "mantleSepolia",
      abi: AgentRegistryAbi,
      address: (process.env.AGENT_REGISTRY_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
      startBlock: Number(process.env.START_BLOCK ?? 0),
    },
    Squadium: {
      chain: "mantleSepolia",
      abi: SquadiumAbi,
      address: (process.env.SQUADIUM_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
      startBlock: Number(process.env.START_BLOCK ?? 0),
    },
    LiquidReputation: {
      chain: "mantleSepolia",
      abi: LiquidReputationAbi,
      address: (process.env.LIQUID_REPUTATION_ADDRESS ??
        "0x0000000000000000000000000000000000000000") as `0x${string}`,
      startBlock: Number(process.env.START_BLOCK ?? 0),
    },
    RewardDistributor: {
      chain: "mantleSepolia",
      abi: RewardDistributorAbi,
      address: (process.env.REWARD_DISTRIBUTOR_ADDRESS ??
        "0x0000000000000000000000000000000000000000") as `0x${string}`,
      startBlock: Number(process.env.START_BLOCK ?? 0),
    },
    AgentReputationOracle: {
      chain: "mantleSepolia",
      abi: AgentReputationOracleAbi,
      address: (process.env.AGENT_REPUTATION_ORACLE_ADDRESS ??
        "0x0000000000000000000000000000000000000000") as `0x${string}`,
      startBlock: Number(process.env.START_BLOCK ?? 0),
    },
  },
});
