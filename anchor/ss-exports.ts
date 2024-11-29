// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import SsIdl from "./idl/ss_back.json";
import type { SsBack } from "./types/ss_back";

// Re-export the generated IDL and type
export { SsBack, SsIdl };

// The programId is imported from the program IDL.
export const SS_PROGRAM_ID = new PublicKey(SsIdl.address);

// This is a helper function to get the SecretSanta Anchor program.
export function getSsProgram(provider: AnchorProvider) {
  return new Program(SsIdl as SsBack, provider);
}

// This is a helper function to get the program ID for the SecretSanta program depending on the cluster.
// For the sake of simplicity, the default cluster is set to "devnet"
export function getSsProgramId(cluster: Cluster = "devnet") {
  switch (cluster) {
    case "devnet":
    case "testnet":
      // This is the program ID for the SecretSanta program on devnet and testnet.
      return new PublicKey("46s1CHb7PQHHJJ7F3MetxcEriy9aBYD4PVb93GBe8ig2");
    case "mainnet-beta":
    default:
      return SS_PROGRAM_ID;
  }
}
