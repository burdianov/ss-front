import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";

import { useSsProgram } from "../data-access/ss-data-access.tsx";
import PartyLine from "../party/party-line.tsx";
import { ProgramAccount } from "@coral-xyz/anchor";
import { format } from "date-fns";

interface FormData {
  location: string;
  date: string;
  budget: number;
}

const partyInfo = [
  {
    location: "Hilton",
    date: "",
    budget: "20",
  },
  {
    location: "Le Meridian",
    date: new Date(),
    budget: "25",
  },
  {
    location: "Millenium",
    date: new Date(Date.UTC(2024, 11, 24, 15, 0, 0)),
    budget: "45",
  },
];

export function PartyCreate() {
  const [currentPartyId, setCurrentPartyId] = useState<number>();
  const [parties, setParties] = useState<
    ProgramAccount<{
      partyId: number;
      organizer: PublicKey;
      location: string;
      date: BN;
      budget: string;
      participants: string[];
    }>[]
  >([]);
  const { publicKey } = useWallet();
  const { createPartyMutation, partiesAccount, partyAccounts } = useSsProgram();

  useEffect(() => {
    if (partiesAccount.data) {
      setCurrentPartyId(partiesAccount.data[0].account.count + 1);
    }
    if (partyAccounts.data) {
      setParties(partyAccounts.data);
      console.log(partyAccounts.data);
    }
  }, [partiesAccount.data, partyAccounts.data]);

  const [formData, setFormData] = useState<FormData>({
    location: "",
    date: "",
    budget: 0,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (partiesAccount.data) {
      createPartyMutation.mutateAsync({
        organizer: publicKey,
        partiesInit: partiesAccount.data[0].publicKey,
        partyId: currentPartyId,
        location: formData.location,
        timestamp: new BN(new Date(formData.date).getTime()),
        budget: formData.budget,
      });
    }
  };

  const form = (
    <div className="mb-6">
      <div className="card w-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="grid gap-4 gap-y-2 grid-cols-4 md:grid-cols-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  name="location"
                  type="text"
                  className="grow"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input name="date" type="date" className="grow" value={formData.date} onChange={handleInputChange} />
              </label>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Budget (USD)</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  name="budget"
                  type="number"
                  className="grow"
                  value={formData.budget}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="form-control flex gap-2 mt-auto">
              <div className="text-center">
                <button className="btn btn-md btn-primary w-full" disabled={createPartyMutation.isPending}>
                  Create {createPartyMutation.isPending && "..."}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (partyAccounts.data) {
    return (
      <>
        {form}
        <PartiesList parties={parties}></PartiesList>
      </>
    );
  } else {
    return <>{form}</>;
  }
}

function PartiesList({
  parties,
}: {
  parties: {
    account: {
      partyId: number;
      organizer: PublicKey;
      location: string;
      date: BN;
      budget: string;
      participants: string[];
    };
  }[];
}) {
  const { getProgramAccount } = useSsProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    );
  }

  parties.sort((a, b) => b.account.date.toNumber() - a.account.date.toNumber());

  return (
    <>
      <h2 className="card-title text-2xl font-bold mb-6">My Parties</h2>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Date</th>
              <th>Budget (USD)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parties.map((info) => {
              return (
                <PartyLine
                  key={info.account.partyId}
                  partyId={info.account.partyId}
                  location={info.account.location}
                  date={format(new Date(Math.floor(info.account.date.toNumber())), "dd-MMM-yyyy")}
                  budget={info.account.budget}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
