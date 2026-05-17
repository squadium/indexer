/**
 * CCRI on-chain push — submits a signed reputation to AgentReputationOracle.
 *
 * Anyone can relay the signed payload; the contract verifies the signature.
 * We read the current nonce on-chain and submit nonce+1 (the contract's
 * sequential-nonce replay guard).
 */
import {createPublicClient, createWalletClient, http, type Hex} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {mantleSepoliaTestnet} from "viem/chains";

import {AgentReputationOracleAbi} from "../abis/AgentReputationOracle";
import type {Reputation} from "./types";

const RPC = process.env.PONDER_RPC_URL_5003 ?? "https://rpc.sepolia.mantle.xyz";
const ORACLE = (process.env.AGENT_REPUTATION_ORACLE_ADDRESS ?? "") as `0x${string}`;

function clients() {
  const pk = process.env.ORACLE_SIGNER_KEY;
  if (!pk) throw new Error("ORACLE_SIGNER_KEY not set");
  if (!ORACLE) throw new Error("AGENT_REPUTATION_ORACLE_ADDRESS not set");
  const account = privateKeyToAccount((pk.startsWith("0x") ? pk : `0x${pk}`) as Hex);
  const transport = http(RPC);
  return {
    account,
    pub: createPublicClient({chain: mantleSepoliaTestnet, transport}),
    wallet: createWalletClient({account, chain: mantleSepoliaTestnet, transport}),
  };
}

export async function currentNonce(agentId: bigint): Promise<bigint> {
  const {pub} = clients();
  return pub.readContract({
    address: ORACLE,
    abi: AgentReputationOracleAbi,
    functionName: "nonces",
    args: [agentId],
  }) as Promise<bigint>;
}

export async function pushReputation(
  agentId: bigint,
  rep: Reputation,
  nonce: bigint,
  sig: Hex,
): Promise<Hex> {
  const {wallet} = clients();
  return wallet.writeContract({
    address: ORACLE,
    abi: AgentReputationOracleAbi,
    functionName: "pushReputation",
    args: [
      agentId,
      {
        score: rep.score,
        confidence: rep.confidence,
        tier: rep.tier,
        asOf: rep.asOf,
        horizon: rep.horizon,
      },
      nonce,
      sig,
    ],
  });
}

export const oracleAddress = ORACLE;
