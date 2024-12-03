import { useEffect, useRef, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";

import { useSsProgram } from "../data-access/ss-data-access.tsx";
import PartyLine from "../party/party-line.tsx";
import { ProgramAccount } from "@coral-xyz/anchor";
import { format, parse } from "date-fns";
import { UpdatePartyModal } from "../modal/update-party-modal.tsx";
import { CreatePartyModal } from "../modal/create-party-modal.tsx";

interface FormData {
  partyId?: number;
  location: string;
  date: string;
  budget: number;
}

export function Parties() {
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

  const dialogRef = useRef<HTMLDialogElement | null>(null);

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

  // const form = (
  //   <div className="mb-6">
  //     <div className="card w-auto bg-base-100 shadow-xl">
  //       <div className="card-body">
  //         <form onSubmit={handleSubmit} className="grid gap-4 gap-y-2 grid-cols-4 md:grid-cols-4">
  //           <div className="form-control">
  //             <label className="label">
  //               <span className="label-text">Location</span>
  //             </label>
  //             <label className="input input-bordered flex items-center gap-2">
  //               <input
  //                 name="location"
  //                 type="text"
  //                 className="grow"
  //                 value={formData.location}
  //                 onChange={handleInputChange}
  //               />
  //             </label>
  //           </div>
  //           <div className="form-control">
  //             <label className="label">
  //               <span className="label-text">Date</span>
  //             </label>
  //             <label className="input input-bordered flex items-center gap-2">
  //               <input name="date" type="date" className="grow" value={formData.date} onChange={handleInputChange} />
  //             </label>
  //           </div>
  //           <div className="form-control">
  //             <label className="label">
  //               <span className="label-text">Budget (USD)</span>
  //             </label>
  //             <label className="input input-bordered flex items-center gap-2">
  //               <input
  //                 name="budget"
  //                 type="number"
  //                 className="grow"
  //                 value={formData.budget}
  //                 onChange={handleInputChange}
  //               />
  //             </label>
  //           </div>
  //           <div className="form-control flex gap-2 mt-auto">
  //             <div className="text-center">
  //               <button className="btn btn-md btn-primary w-full" disabled={createPartyMutation.isPending}>
  //                 Create {createPartyMutation.isPending && "..."}
  //               </button>
  //             </div>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );

  if (partiesAccount.data) {
    return (
      <>
        <CreatePartyModal
          partyId={currentPartyId}
          dialogRef={dialogRef}
          partiesPublicKey={partiesAccount.data[0].publicKey}
        />
        <h2 className="card-title text-2xl font-bold mb-6">
          <label>My Parties</label>
          <button onClick={() => dialogRef.current?.showModal()} className="btn btn-primary ml-auto text-lg">
            Create New Party
          </button>
        </h2>
        <PartiesList parties={parties}></PartiesList>
      </>
    );
  } else {
    return <></>;
  }
}

export interface LineData {
  partyId: number;
  location: string;
  date: string;
  budget: string;
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
      dialogRef: React.MutableRefObject<HTMLDialogElement | null>;
    };
  }[];
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [activeId, setActiveId] = useState<number>(1);
  const [activeDate, setActiveDate] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState<string>("");
  const [activeBudget, setActiveBudget] = useState<string>("");

  const { getProgramAccount } = useSsProgram();

  parties.sort((a, b) => b.account.date.toNumber() - a.account.date.toNumber());

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

  return (
    <>
      <UpdatePartyModal
        dialogRef={dialogRef}
        partyId={activeId}
        date={activeDate ? format(parse(activeDate, "dd-MMM-yyyy", new Date()), "yyyy-MM-dd") : ""}
        location={activeLocation}
        budget={activeBudget}
      />
      <div>
        <div className="overflow-x-auto min-w-3.5">
          <table className="table text-lg">
            <thead>
              <tr className="text-lg grid-cols-12">
                <th className="col-span-1">ID</th>
                <th className="col-span-4">Location</th>
                <th className="col-span-3">Date</th>
                <th className="col-span-2">Budget (USD)</th>
                <th className="col-span-2">Action</th>
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
                    dialogRef={dialogRef}
                    setActiveId={setActiveId}
                    setActiveLocation={setActiveLocation}
                    setActiveDate={setActiveDate}
                    setActiveBudget={setActiveBudget}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
