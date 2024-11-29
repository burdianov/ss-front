export interface LineData {
  serialNumber: string;
  location: string;
  date: string;
  budget: string;
}

export default function PartyLine({ serialNumber, location, date, budget }: LineData) {
  return (
    <tr>
      <th>{serialNumber}</th>
      <td>{location}</td>
      <td>{date}</td>
      <td>{budget}</td>
      <th>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </th>
    </tr>
  );
}
