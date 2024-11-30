import { ChangeEvent, FormEvent, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { useSsProgram } from "../data-access/ss-data-access.tsx";

interface FormData {
  id: string;
  location: string;
  date: string;
  budget: number;
}

export function PartyEdit() {
  const { publicKey } = useWallet();
  const { initialize } = useSsProgram();

  const [formData, setFormData] = useState<FormData>({
    id: "",
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
    initialize.mutateAsync(publicKey as PublicKey);
  };

  return (
    <>
      <div className="mb-6">
        <div className="card w-auto bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-6">Edit Party</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 gap-y-2 grid-cols-5 md:grid-cols-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ID</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input name="id" type="text" className="grow" value={"predefined"} disabled />
                </label>
              </div>
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
                  <button className="btn btn-xs lg:btn-md btn-primary w-full" disabled={initialize.isPending}>
                    Save {initialize.isPending && "..."}
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
