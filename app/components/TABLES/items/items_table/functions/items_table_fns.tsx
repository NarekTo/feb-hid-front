import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ProjectItems,
  ProjectItemsWithSelect,
  Session,
} from "../../../../../types";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdLock } from "react-icons/md";
import { SortingFn, sortingFns } from "@tanstack/react-table";
import { compareItems } from "@tanstack/match-sorter-utils";
import { useSession } from "next-auth/react";

// --
interface LockCellRendererProps {
  getValue: () => any; // replace 'any' with the actual type
  row: { index: number; original: { item_status: string } };
  column: { id: string };
  table: any; // replace 'any' with the actual type of 'table'
}
interface idCellRendererProps {
  getValue: () => any; // replace 'any' with the actual type

  fun: () => any; // replace 'any' with the actual type of 'table'
}
interface Column {
  id: string;
  getIsVisible: () => boolean;
  getToggleVisibilityHandler: () => () => void;
}

export interface Table {
  getAllLeafColumns: () => Column[];
}
interface CustomCellRendererProps {
  getValue: () => any; // replace 'any' with the actual type
  row: { index: number; original: ProjectItems };
  column: { id: string };
  table: any; // replace 'any' with the actual type of 'table'
}

interface TableItem {
  group_number: string;
  group_sequence: string;
}

//-------------------------------------------------------------Top Menu Functions-------------------------------------------------------------

export const getHighestGroupSeq = (
  table: TableItem[],
  groupNum: string
): number => {
  let highestGroupSeq = 0;
  for (const item of table) {
    if (item.group_number === groupNum) {
      const groupSeq = parseInt(item.group_sequence);
      if (groupSeq > highestGroupSeq) {
        highestGroupSeq = groupSeq;
      }
    }
  }
  return highestGroupSeq + 1;
};

export const fetchTableData = async (
  id: number,
  batchNumber: string,
  session: Session | null
) => {
  try {
    const response = await fetch(
      `http://localhost:3000/items/tabledata/${id}/${batchNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const { project, batch, items } = data;
      // Now you can use project, batch, and items
      return { project, batch, items };
    } else {
      console.error("Failed to fetch table data");
    }
  } catch (error) {
    console.error("Error fetching table data:", error);
  }
};

export const addRow = async (
  newRow: ProjectItemsWithSelect,
  session: Session | null
) => {
  const { select, ...restOfNewRow } = newRow;

  try {
    const response = await fetch(`http://localhost:3000/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(restOfNewRow),
    });

    if (response.ok) {
      console.log("Row added successfully");
    } else {
      console.error("Failed to add row");
    }
  } catch (error) {
    console.error("Error adding row:", error);
  }
};

export const deleteRow = async (itemId: string, session: Session | null) => {
  console.log("calling endpoint");
  try {
    const response = await fetch(`http://localhost:3000/items/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (response.ok) {
      console.log("Row deleted successfully");
    } else {
      console.error("Failed to delete row");
    }
  } catch (error) {
    console.error("Error deleting row:", error);
  }
};

export const getHighestItemId = (items) => {
  let highest = 0;
  if (Array.isArray(items)) {
    items.forEach((item) => {
      if (parseInt(item.Item_id) > highest) {
        highest = parseInt(item.Item_id);
      }
    });
  } else {
    console.error("Error: items is not an array", items);
  }
  return highest;
};

//-------------------------------------------------------------Cell Functions-------------------------------------------------------------

export const customCellRenderer = ({
  row: { index, original },
  column: { id },
  table,
}: CustomCellRendererProps) => {
  const { data: session } = useSession() as { data: Session | null };
  const initialValue = original[id];
  const [value, setValue] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);
  const Item_id = original.Item_id;
  const onBlur = async () => {
    if (value !== initialValue) {
      try {
        // Send a PUT request to your backend to update the item
        const response = await fetch(`http://localhost:3000/items/${Item_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ [id]: value }), // Update the field with the new value
        });

        if (response.ok) {
          console.log("Item updated successfully");
          setValue(value);
        } else {
          console.error("Failed to update item");
        }
      } catch (error) {
        // Handle error if the update fails
        console.error("Error updating data:", error);
      }
    }
    setIsEditable(false);
  };
  const onFoc = (e) => {
    setIsEditable(true);
  };

  useEffect(() => {
    setValue(original[id]);
  }, [original[id]]);

  return (
    <input
      style={{
        outline: "none",
        borderRadius: "2px",
        border: isEditable ? "1px solid #4f85e1" : "1px solid transparent",
      }}
      type="text"
      placeholder={`insert ${
        initialValue === "" ? table.getColumn(id).id : ""
      }`}
      className={`focus:outline-none focus:ring focus:border-blue-500`}
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onFocus={onFoc}
      readOnly={!isEditable}
    />
  );
};
export const idCellRenderer = ({ getValue, fun }: idCellRendererProps) => {
  const initialValue = getValue();
  return (
    <div className={`text-blue-600 cursor-pointer `} onClick={() => fun()}>
      {initialValue}
    </div>
  );
};

export const lockCellRenderer = ({
  row: { original },
}: LockCellRendererProps) => {
  const [color, setColor] = useState<string>("");

  const getColorFromStatus = (item_status: string) => {
    switch (item_status) {
      case "IDS":
        return "yellow";
      case "IDR":
        return "red";
      case "IDA":
        return "green";
      case "IOP":
        return "blue";
      case "IDT":
        return "black";
      case "ID":
        return "white";
      case "IB":
        return "white"; // Changed this to return a color string instead of JSX
      default:
        return "orange";
    }
  };

  useEffect(() => {
    setColor(getColorFromStatus(original.item_status));
  }, [original.item_status]);

  return <MdLock size={14} color={color} />;
};

//-------------------------------------------------------------Column Functions-------------------------------------------------------------

// `columnList` is a function component that renders a list of columns.
export const columnList = (currTable) => {
  return currTable.getAllLeafColumns().map((column: Column) => {
    console.log("column", column.getIsVisible);
    return (
      <div key={column.id} className="px-1">
        <label>
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            onChange={column.getToggleVisibilityHandler()}
          />
          {column.id}
        </label>
      </div>
    );
  });
};

// `columnBeingDragged` is a variable that holds the index of the column being dragged.
let columnBeingDragged: number;

// It sets `columnBeingDragged` to the index of the column being dragged.
export const onDragStart = (e) => {
  columnBeingDragged = Number(e.currentTarget.dataset.columnIndex);
};

// It updates the column order based on the drop position.
export const onDrop = (e: React.DragEvent, table: any) => {
  e.preventDefault();
  e.preventDefault();
  const target = e.currentTarget as HTMLElement;
  const newPosition: number = Number(target.dataset.columnIndex);
  const currentCols: string[] = table
    .getVisibleLeafColumns()
    .map((c: { id: string }) => c.id);
  const colToBeMoved: string[] = currentCols.splice(columnBeingDragged, 1);
  currentCols.splice(newPosition, 0, colToBeMoved[0]);
  table.setColumnOrder(currentCols); // <------------------------here you save the column ordering state
};

// `useSkipper` is a custom hook that provides a way to skip a pagination reset temporarily.
export const useSkipper = (): [boolean, () => void] => {
  const shouldSkipRef = useRef<boolean>(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip];
};

// `countKeys` is a function that counts the unique keys in an array of objects.
export const countKeys = (arr: Record<string, unknown>[]): number => {
  const temp = arr.reduce((count: string[], item: Record<string, unknown>) => {
    Object.keys(item).forEach((key: string) => {
      if (!count.includes(key)) {
        count.push(key);
      }
    });
    return count;
  }, []).length;
  return temp;
};
// fuzzySort is a sorting function that sorts by rank first, then alphanumeric
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export const up = (
  <MdKeyboardArrowDown className="text-white cursor-pointer z-40" size={18} />
);
export const down = (
  <MdKeyboardArrowUp className="text-white cursor-pointer z-40" size={18} />
);
//create a new items row
export const newRow: ProjectItemsWithSelect = {
  select: false,
  Item_id: "",
  job_id: "",
  batch_number: "",
  location_code: "",
  item_ref: "",
  design_ref: "",
  item_status: "",
  item_code: "",
  additional_description: "",
  quantity: 0,
  spares: 0,
  uom_code: "",
  supplier_code: "",
  manufacturer_id: "",
  part_number: "",
  actual_currency: "",
  actual_exchange_rate: 0,
  actual_value: 0,
  budget_currency: "",
  budget_exchange_rate: 0,
  budget_value: 0,
  client_markup: 0,
  client_currency: "",
  client_exchange_rate: 0,
  client_value: 0,
  group_number: "",
  group_sequence: "",
  package_code: "",
  supplier_address_id: "",
  del_address_id: "",
  delivery_date: null,
  drawing_revision: "",
  drawing_issue_date: null,
  Inquiry_id: "",
  order_id: "",
  order_number: "",
  country_of_origin: "",
  quote_ref: "",
  quote_date: null,
  shop_drawing: "",
  sample: "",
  inspection: "",
  photograph: "",
  reservation_number: "",
  reservation_date: null,
  specifier_id: "",
  design_notes: "",
  user_notes: "",
  supplier_notes: "",
  created_date: null,
  modified_date: null,
};
