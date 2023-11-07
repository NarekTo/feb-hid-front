import React, { useEffect, useRef, useState, useCallback } from "react";
import { ProjectItemsWithSelect } from "../../../../../types";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface CustomCellRendererProps {
  getValue: () => any; // replace 'any' with the actual type
  row: { index: number };
  column: { id: string };
  table: any; // replace 'any' with the actual type of 'table'
}

interface Column {
  id: string;
  getIsVisible: () => boolean;
  getToggleVisibilityHandler: () => () => void;
}

export interface Table {
  getAllLeafColumns: () => Column[];
}

// `customCellRenderer` is a function component that renders a custom cell.
// It manages the cell's value and editable state, and handles blur and focus events.
export const customCellRenderer = ({
  getValue,
  row: { index },
  column: { id },
  table,
}: CustomCellRendererProps) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);

  const onBlur = async () => {
    if (value !== initialValue) {
      try {
        //await updateBackendData(index, id, value);
        console.log("update", value);
        setValue(value);
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
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      style={{
        backgroundColor: index % 2 === 0 ? "white" : "#F3F4F6",
        outline: "none",
        borderRadius: "2px",
        border: isEditable ? "1px solid #4f85e1" : "none",
      }}
      type="text"
      placeholder={`insert ${
        initialValue === "" ? table.getColumn(id).id : ""
      }`}
      className={` focus:outline-none focus:ring focus:border-blue-500`}
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onFocus={onFoc}
      readOnly={!isEditable}
    />
  );
};

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
// It's used in the drag and drop handlers to update the column order.
let columnBeingDragged: number;

// `onDragStart` is a handler for the drag start event.
// It sets `columnBeingDragged` to the index of the column being dragged.
export const onDragStart = (e) => {
  columnBeingDragged = Number(e.currentTarget.dataset.columnIndex);
};

// `onDrop` is a handler for the drop event.
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
// It returns a boolean indicating whether to skip and a function to set skip to false.
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
// It uses `reduce` and `forEach` to iterate over the objects and keys.
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

interface TableItem {
  group_number: string;
  group_sequence: string;
}

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

interface DataRow {
  Item_id: string;
}

export const highestId = (data: DataRow[]): number => {
  let highestId = 0;
  data.forEach((row) => {
    const itemId = parseInt(row.Item_id, 10);
    if (!isNaN(itemId) && itemId > highestId) {
      highestId = itemId;
    }
  });
  return highestId;
};

export const up = (
  <MdKeyboardArrowDown className="text-white cursor-pointer z-40" size={18} />
);
export const down = (
  <MdKeyboardArrowUp className="text-white cursor-pointer z-40" size={18} />
);
