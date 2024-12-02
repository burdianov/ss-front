import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { useSsProgram } from "../data-access/ss-data-access";
import { Link } from "react-router";

export default function HomeFeature() {
  const { initialize, partiesAccount } = useSsProgram();
  const { publicKey } = useWallet();

  const displayButton = function () {
    if (!publicKey) {
      return (
        <div className="text-2xl">
          <h2 className="text-red-600">Login to Organize a Party</h2>
        </div>
      );
    }

    if (partiesAccount.isLoading) {
      return <span className="loading loading-spinner loading-lg"></span>;
    }

    return partiesAccount.data?.length ? (
      <div className="form-control flex gap-2 mt-auto">
        <div className="text-center">
          <button className="btn btn-md btn-primary">
            <Link to={"parties"}>Create Party</Link>
          </button>
        </div>
      </div>
    ) : (
      <div className="form-control flex gap-2 mt-auto">
        <div className="text-center">
          <button
            onClick={() => initialize.mutateAsync(publicKey as PublicKey)}
            className="btn btn-md btn-primary w-full"
            disabled={partiesAccount.isPending}
          >
            Initialize Parties {partiesAccount.isPending && "..."}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="hero">
        <div className="hero-content">
          <div className="max-w-5xl">
            <div className="text-left">
              <h1 className="text-5xl font-bold mb-6">What is Secret Santa?</h1>
              <div>
                <p className="py-4">
                  Secret Santa is a fun and free online tool for organizing gift exchanges. Whether you're planning a
                  holiday celebration with friends, family, or coworkers, our platform makes it simple and exciting to
                  set up your Secret Santa event.
                </p>
                <p className="py-6">
                  Every year during the holiday season, people around the world exchange gifts. Secret Santa adds a
                  playful twist by randomly assigning participants a gift recipient, keeping the process mysterious and
                  full of surprises!
                </p>
              </div>
              <h2 className="text-3xl font-bold">How Does It Work?</h2>
              <div className="py-4">
                <ul>
                  <li className="py-1">
                    <b>Create Your Party</b>: Start by creating a Secret Santa party on our homepage.
                  </li>
                  <li className="py-1">
                    <b>Add Participants</b>: Invite between 3 and 50 people to join the fun.
                  </li>
                  <li className="py-1">
                    <b>Randomize Gift Pairings</b>: Let our system assign each participant their gift recipient.
                  </li>
                  <li className="py-1">
                    <b>Share Links</b>: Generate personalized links for each participant, so they can privately discover
                    who they’ll be gifting to.
                  </li>
                </ul>
              </div>
              <p className="py-3">
                Organizing a holiday gift exchange has never been easier or more fun! Get started today and make your
                celebrations unforgettable.
              </p>
            </div>
            <div className="text-center mt-4">{displayButton()}</div>
          </div>
        </div>
      </div>
    </>
  );
}
