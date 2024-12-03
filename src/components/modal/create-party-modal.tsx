import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSsProgram } from "../data-access/ss-data-access";
import BN from "bn.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

interface Props {
  partyId?: number;
  partiesPublicKey: PublicKey;
  dialogRef: React.MutableRefObject<HTMLDialogElement | null>;
}

interface FormData {
  partyId?: number;
  location?: string;
  date?: string;
  budget?: string;
}

export const CreatePartyModal = ({ partyId, dialogRef, partiesPublicKey }: Props) => {
  const [formData, setFormData] = useState<FormData>({
    partyId: 1,
    location: "",
    date: "",
    budget: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      partyId: partyId ?? prev.partyId,
    }));
  }, [partyId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { createPartyMutation } = useSsProgram();
  const { publicKey } = useWallet();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.partyId && formData.date) {
      try {
        await createPartyMutation.mutateAsync({
          organizer: publicKey,
          partiesInit: partiesPublicKey,
          partyId: formData.partyId,
          location: formData.location,
          timestamp: new BN(new Date(formData.date).getTime()),
          budget: formData.budget,
        });
        dialogRef.current?.close();
      } catch (error) {
        console.log("#### Error creating party", error);
      }
    }
  };

  return (
    <>
      <dialog className="modal" ref={dialogRef}>
        <div className="card w-96 bg-base-100 shadow-xl my-auto">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-6">Create Party</h2>
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
                <button className="btn btn-primary" disabled={createPartyMutation.isPending}>
                  Save {createPartyMutation.isPending && "..."}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
