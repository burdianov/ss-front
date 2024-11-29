export interface ParticipantLineData {
  serialNumber: String;
  id: string;
  name: string;
  email: string;
}

export default function ParticipantLine({ serialNumber, id, name, email }: ParticipantLineData) {
  return (
    <tr>
      <th>{serialNumber}</th>
      <td>{id}</td>
      <td>{name}</td>
      <td>{email}</td>
      <th>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </th>
    </tr>
  );
}
