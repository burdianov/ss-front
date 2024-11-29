import { useWallet } from "@solana/wallet-adapter-react";
import { useSsProgram } from "./parties-data-access.tsx";

export default function PartiesFeature() {
  const { publicKey } = useWallet();
  const { programId, initialize } = useSsProgram();

  return publicKey ? (
    <div className="text-center">
      <h2>Public key: {publicKey.toString()}</h2>
      <h2>ProgramId: {programId.toString()}</h2>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={() => initialize.mutateAsync(publicKey)}
        disabled={initialize.isPending}
      >
        Create {initialize.isPending && "..."}
      </button>
    </div>
  ) : (
    <h2>You need to connect your wallet</h2>
  );
}
