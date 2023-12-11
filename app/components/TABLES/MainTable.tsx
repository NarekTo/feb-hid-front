import { FC } from "react";
import { extractKeys, formatDate } from "../../utils/constants";

interface MainTableProps<T> {
  tableItems: T[];
  onBatchClick: (item: T) => void;
  clickableColumn: string;
}

const MainTable: FC<MainTableProps<any>> = ({
  tableItems,
  onBatchClick,
  clickableColumn,
}) => {
  const keys = tableItems && extractKeys(tableItems);

  return (
    <div className="h-full w-full overflow-y-auto bg-slate-100 p-2 rounded-md ">
      <table className="text-left text-sm font-light table-auto w-full">
        <thead className="bg-dark-blue text-white sticky top-0 w-full rounded-md">
          <tr>
            {keys.map((key) => (
              <th
                scope="col"
                className="px-2 py-1 font-medium tracking-wide whitespace-nowrap"
                key={key}
              >
                {key
                  .replace(/_/g, " ")
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="max-h-full overflow-y-auto overflow-scroll w-full">
          {tableItems.map((item, index) => (
            <tr
              className="border-b dark:border-neutral-500 cursor-pointer"
              key={index}
            >
              {keys.map((key) => (
                <td
                  className={`px-2 py-1 font-normal ${
                    key === clickableColumn ? "text-blue-700 " : ""
                  }`}
                  key={key}
                  onClick={
                    key === clickableColumn
                      ? () => onBatchClick(item)
                      : undefined
                  }
                >
                  {item[key] === item.image ? (
                    <img
                      src={item.image}
                      style={{ width: "80px" }}
                      alt="Item"
                    />
                  ) : key.toLowerCase().includes("date") ? (
                    formatDate(new Date(item[key]), "dd/MM/yyyy")
                  ) : (
                    item[key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainTable;
