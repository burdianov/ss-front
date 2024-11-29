import { useToast } from "../ui/ui-layout";

export interface ParticipantLineData {
  serialNumber: String;
  id: string;
  name: string;
  email: string;
}

export default function ParticipantLine({ serialNumber, id, name, email }: ParticipantLineData) {
  const toast = useToast();

  return (
    <tr>
      <th>{serialNumber}</th>
      <td>{id}</td>
      <td>{name}</td>
      <td>{email}</td>
      <th>
        <button className="btn btn-ghost btn-xs">Edit</button>
      </th>
      <th>
        <button onClick={() => toast("buddy link")} className="btn btn-ghost btn-xs">
          Copy Link
        </button>
      </th>
    </tr>
  );
}
