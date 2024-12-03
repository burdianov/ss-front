import { getSsProgram, getSsProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import BN from "bn.js";

export function useSsProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(() => getSsProgramId(cluster.network as Cluster), [cluster]);

  const program = getSsProgram(provider);

  const partiesAccount = useQuery({
    queryKey: ["parties-account", "all"],
    queryFn: () => program.account.parties.all(),
  });

  const partyAccounts = useQuery({
    queryKey: ["party-accounts", "all"],
    queryFn: () => program.account.party.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account"],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ["parties", "initialize"],
    mutationFn: (organizer: PublicKey) => program.methods.initialize().accounts({ organizer: organizer }).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return partiesAccount.refetch();
    },
    onError: () => toast.error("Failed to initialize parties"),
  });

  const createPartyMutation = useMutation({
    mutationKey: ["party", "create"],
    mutationFn: ({
      organizer,
      partiesInit,
      partyId,
      location,
      timestamp,
      budget,
    }: {
      organizer: PublicKey;
      partiesInit: PublicKey;
      partyId: number;
      location: string;
      timestamp: BN;
      budget: string;
    }) =>
      program.methods
        .createParty(partyId, location, timestamp, budget)
        .accounts({ organizer: organizer, parties: partiesInit })
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return partiesAccount.refetch();
    },
    onError: () => toast.error("Failed to create party"),
  });

  const updatePartyMutation = useMutation({
    mutationKey: ["party", "edit"],
    mutationFn: ({
      organizer,
      partyId,
      location,
      timestamp,
      budget,
    }: {
      organizer: PublicKey;
      partyId: number;
      location: string;
      timestamp: BN;
      budget: string;
    }) => program.methods.updateParty(partyId, location, timestamp, budget).accounts({ organizer: organizer }).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return partiesAccount.refetch();
    },
    onError: () => toast.error("Failed to update party information"),
  });

  return {
    createPartyMutation,
    updatePartyMutation,
    initialize,
    getProgramAccount,
    partiesAccount,
    programId,
    partyAccounts,
  };
}
