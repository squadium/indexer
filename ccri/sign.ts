/**
 * CCRI signer — produces an ECDSA signature that AgentReputationOracle._recover
 * accepts. The digest layout MUST match the contract exactly:
 *
 *   keccak256(abi.encodePacked(
 *     agentId(uint256), score(uint16), confidence(uint16), tier(uint8),
 *     asOf(uint64), horizon(uint64), nonce(uint256), oracle(address)
 *   ))
 *
 * then the EIP-191 personal-sign prefix (viem applies this for a 32-byte raw
 * message — exactly the contract's "\x19Ethereum Signed Message:\n32" path).
 */
import {encodePacked, keccak256, type Hex} from "viem";
import {privateKeyToAccount} from "viem/accounts";

import type {Reputation} from "./types";

export function signerAccount() {
  const pk = process.env.ORACLE_SIGNER_KEY;
  if (!pk) throw new Error("ORACLE_SIGNER_KEY not set");
  return privateKeyToAccount((pk.startsWith("0x") ? pk : `0x${pk}`) as Hex);
}

export function reputationDigest(
  agentId: bigint,
  rep: Reputation,
  nonce: bigint,
  oracle: `0x${string}`,
): Hex {
  return keccak256(
    encodePacked(
      ["uint256", "uint16", "uint16", "uint8", "uint64", "uint64", "uint256", "address"],
      [agentId, rep.score, rep.confidence, rep.tier, rep.asOf, rep.horizon, nonce, oracle],
    ),
  );
}

/** Sign the digest with the EIP-191 prefix (matches the on-chain _recover). */
export async function signReputation(
  agentId: bigint,
  rep: Reputation,
  nonce: bigint,
  oracle: `0x${string}`,
): Promise<Hex> {
  const account = signerAccount();
  const digest = reputationDigest(agentId, rep, nonce, oracle);
  return account.signMessage({message: {raw: digest}});
}
