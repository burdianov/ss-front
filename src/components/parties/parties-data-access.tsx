import { getSsProgram, getSsProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";

import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

export function useSsProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(() => getSsProgramId(cluster.network as Cluster), [cluster]);
  const program = getSsProgram(provider);

  const partiesAccounts = useQuery({
    queryKey: ["parties-accounts", "all"],
    queryFn: () => program.account.parties.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account"],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ["parties", "initialize"],
    mutationFn: (publicKey: PublicKey) => program.methods.initialize().accounts({ organizer: publicKey }).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return partiesAccounts.refetch();
    },
    onError: () => toast.error("Failed to initialize parties"),
  });

  return { initialize, getProgramAccount, partiesAccounts, programId };
}
