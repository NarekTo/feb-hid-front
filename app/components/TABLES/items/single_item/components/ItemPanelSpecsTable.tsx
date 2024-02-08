import React from "react";

interface ItemPanelSpecsTableProps {
  headers: string[];
  data: any[];
  renderRow: (item: any, index: number) => JSX.Element;
}

const ItemPanelSpecsTable: React.FC<ItemPanelSpecsTableProps> = ({
  headers,
  data,
  renderRow,
}) => {
  return (
    <div className="w-full overflow-x-auto">
      {" "}
      {/* Ensure the div takes the full width and handles overflow */}
      <table className="min-w-full ">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left ">
      {/* <span className="text-2xl font-bold">Specifications</span> */}
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className=" py-2 text-left">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ItemPanelSpecsTable;
