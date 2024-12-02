import { useWallet } from "@solana/wallet-adapter-react";

import { PartyCreate } from "./parties-ui";

export default function PartiesFeature() {
  const { publicKey } = useWallet();

  if (publicKey) {
    return (
      <>
        <PartyCreate />
      </>
    );
  }
  return <h1>You need to log in to view your parties.</h1>;
}
