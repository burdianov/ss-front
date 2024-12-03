import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSsProgram } from "../data-access/ss-data-access";
import BN from "bn.js";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  partyId?: number;
  location?: string;
  date?: string;
  budget?: string;
  dialogRef: React.MutableRefObject<HTMLDialogElement | null>;
}

interface FormData {
  partyId?: number;
  location?: string;
  date?: string;
  budget?: string;
}

export const UpdatePartyModal = ({ partyId, location, date, budget, dialogRef }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    partyId: 1,
    location: "",
    date: "",
    budget: "",
  });

  useEffect(() => {
    setFormData({ partyId, location, date, budget });
  }, [partyId, location, date, budget]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { updatePartyMutation } = useSsProgram();
  const { publicKey } = useWallet();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.date) {
      try {
        await updatePartyMutation.mutateAsync({
          organizer: publicKey,
          partyId: formData.partyId,
          location: formData.location,
          timestamp: new BN(new Date(formData.date).getTime()),
          budget: formData.budget,
        });
        dialogRef.current?.close();
      } catch (error) {
        console.error("##### Error updating party:", error);
      }
    }
  };
  return (
    <>
      <dialog className="modal" ref={dialogRef}>
        <div className="card w-96 bg-base-100 shadow-xl my-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-6">Update Party</h2>
            <button
              onClick={() => dialogRef.current?.close()}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ID</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input name="partyId" value={formData.partyId} type="text" className="grow" disabled />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    type="text"
                    className="grow"
                  />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Date</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input name="date" value={formData.date} type="date" onChange={handleInputChange} className="grow" />
                </label>
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Budget (USD)</span>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <input
                    name="budget"
                    value={formData.budget}
                    type="number"
                    onChange={handleInputChange}
                    className="grow"
                  />
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={updatePartyMutation.isPending}>
                  Save {updatePartyMutation.isPending && "..."}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
