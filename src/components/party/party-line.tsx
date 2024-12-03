export interface LineData {
  partyId: number;
  location: string;
  date: string;
  budget: string;
  dialogRef: React.MutableRefObject<HTMLDialogElement | null>;
  setActiveId: (id: number) => void;
  setActiveDate: (date: string) => void;
  setActiveLocation: (location: string) => void;
  setActiveBudget: (budget: string) => void;
}

export default function PartyLine({
  partyId,
  location,
  date,
  budget,
  dialogRef,
  setActiveId,
  setActiveDate,
  setActiveLocation,
  setActiveBudget,
}: LineData) {
  const handleClick = () => {
    dialogRef.current?.showModal();
    setActiveId(partyId);
    setActiveDate(date);
    setActiveLocation(location);
    setActiveBudget(budget);
  };

  return (
    <>
      <tr>
        <th>{partyId}</th>
        <td>{location}</td>
        <td>{date}</td>
        <td className="text-right">{budget}</td>
        <th>
          <button onClick={handleClick} className="btn btn-ghost text-lg">
            Edit
          </button>
        </th>
      </tr>
    </>
  );
}
