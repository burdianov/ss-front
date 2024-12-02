export interface LineData {
  partyId: number;
  location: string;
  date: string;
  budget: string;
}

export default function PartyLine({ partyId, location, date, budget }: LineData) {
  return (
    <tr>
      <th>{partyId}</th>
      <td>{location}</td>
      <td>{date}</td>
      <td>{budget}</td>
      <th>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </th>
    </tr>
  );
}
