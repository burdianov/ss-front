import { ChangeEvent, FormEvent, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import ParticipantLine from "./participant-line.tsx";
import { useSsProgram } from "../parties/parties-data-access.tsx";

interface FormData {
  serialNumber: string;
  id: string;
  name: string;
  email: string;
}

const participantInfo: FormData[] = [
  {
    serialNumber: "",
    id: "asdfi2934909",
    name: "John Doe",
    email: "john@doe.com",
  },
  {
    serialNumber: "",
    id: "93ksdfo234",
    name: "Peter Pan",
    email: "peter@pan.com",
  },
  {
    serialNumber: "",
    id: "g23f0923",
    name: "Michael Black",
    email: "michael@black.com",
  },
];

export function ParticipantCreate() {
  const { publicKey } = useWallet();
  const { initialize } = useSsProgram();

  const [formData, setFormData] = useState<FormData>({
    serialNumber: "",
    id: "",
    name: "",
    email: "",
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
    // initialize.mutateAsync(publicKey as PublicKey);
  };

  return (
    <>
      <div className="mb-6">
        <div className="card w-auto bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="grid gap-4 gap-y-2 grid-cols-3 md:grid-cols-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input name="name" type="text" className="grow" value={formData.name} onChange={handleInputChange} />
                </label>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    name="email"
                    type="email"
                    className="grow"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className="form-control flex gap-2 mt-auto">
                <div className="text-center">
                  <button className="btn btn-xs lg:btn-md btn-primary w-full" disabled={initialize.isPending}>
                    Create {initialize.isPending && "..."}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function ParticipantsList() {
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
  return (
    <>
      <h2 className="card-title text-2xl font-bold mb-6">Participants</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>SN</th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {participantInfo.map((info, index) => {
              return (
                <ParticipantLine
                  key={index}
                  serialNumber={(index + 1).toString()}
                  id={info.id}
                  name={info.name}
                  email={info.email}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
