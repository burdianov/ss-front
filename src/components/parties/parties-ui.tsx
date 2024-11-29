import { ChangeEvent, FormEvent, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { useSsProgram } from "./parties-data-access.tsx";

interface FormData {
  location: string;
  date: string;
  budget: number;
}

export function PartyCreate() {
  const { publicKey } = useWallet();
  const { initialize } = useSsProgram();

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
    initialize.mutateAsync(publicKey as PublicKey);
  };

  return (
    <>
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

export function PartiesList() {
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
      <h2 className="card-title text-2xl font-bold mb-6">My Parties</h2>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Location</th>
              <th>Date</th>
              <th>Budget (USD)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
              <th>
                <button className="btn btn-ghost btn-xs">View</button>
              </th>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
              <th>
                <button className="btn btn-ghost btn-xs">View</button>
              </th>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
              <th>
                <button className="btn btn-ghost btn-xs">View</button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
