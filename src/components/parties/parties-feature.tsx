import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";

import { PartiesList, PartyCreate } from "./parties-ui";

export default function PartiesFeature() {
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (!publicKey) {
        navigate("/");
      }
    };
  }, [publicKey, navigate]);

  return (
    <>
      <PartyCreate />
      <PartiesList />
    </>
  );
}
