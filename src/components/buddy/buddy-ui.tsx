import { useSsProgram } from "./buddy-data-access.tsx";

export function DisplayBuddy() {
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
      <h2 className="card-title text-2xl font-bold mb-6">
        Your buddy is: <label className="font-bold">{"John Doe"}</label>
      </h2>
    </>
  );
}
