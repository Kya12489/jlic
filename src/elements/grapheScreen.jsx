
export default function GrapheScreen({ fileInfo }) {
  return (
    <div>
      {Object.entries(fileInfo).map(([key, value]) => (
        <table key={key}>
          <tbody>
            <tr>
              <th>{key}</th>

              {Array.isArray(value) ? (
                value.map((element, index) => (
                  <td key={index}>{String(element)}</td>
                ))
              ) : (
                <td>
                  {typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : String(value)}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
}
