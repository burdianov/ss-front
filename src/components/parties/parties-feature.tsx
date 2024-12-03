import { useWallet } from "@solana/wallet-adapter-react";

import { Parties } from "./parties-ui";

export default function PartiesFeature() {
  const { publicKey } = useWallet();

  if (publicKey) {
    return (
      <>
        <Parties />
      </>
    );
  }
  return <h1>You need to log in to view your parties.</h1>;
}
