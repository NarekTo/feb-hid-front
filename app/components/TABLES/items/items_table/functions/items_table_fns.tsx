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
import { updateRow } from "../../../../../utils/api";
import { useOptionStore } from "../../../../../store/store";

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
interface CustomCellRendererProps {
  getValue: () => any; // replace 'any' with the actual type
  row: { index: number; original: ProjectItems };
  column: { id: string };
  table: any;
  cellRef;
  cellRefs; // replace 'any' with the actual type of 'table'
}

//-----------------------------------------------calculations for adding and sorting rows-------------------------------------------------------------

export const calculateHighestGroupSeq = (
  data: ProjectItems[],
  actualRow: ProjectItems
) => {
  const groupNumRows = data.filter(
    (row) => row.group_number === actualRow.group_number
  );
  console.log("number of rows", groupNumRows.length);
  const highestGroupSeq = groupNumRows.length + 1;
  console.log("highest group seq", highestGroupSeq);
  return highestGroupSeq;
};
export const getHighestItemId = (items: ProjectItems[]) => {
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

export const sortTableData = (data: ProjectItems[]) => {
  return [...data].sort((a, b) => {
    if (a.group_number < b.group_number) return -1;
    if (a.group_number > b.group_number) return 1;
    return Number(a.group_sequence) - Number(b.group_sequence);
  });
};

//-------------------------------------------------------------Cell Functions-------------------------------------------------------------

export const customCellRenderer = ({
  row: { index, original },
  column: { id },
  table,
  cellRef,
  cellRefs,
}: CustomCellRendererProps) => {
  const { data: session } = useSession() as { data: Session | null };
  const initialValue = original[id];
  const [value, setValue] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);
  const [cellAbove, setCellAbove] = useState(null);
  const [clickedCell, setClickedCell] = useState(null);
  const [cellBelow, setCellBelow] = useState(null);
  const Item_id = original.Item_id;
  const [focusedCell, setFocusedCell] = useState<{
    index: number;
    id: string;
  } | null>(null);

  const setSelectedRow = useOptionStore((state) => state.setSelectedRow);

  const setValueWithCallback = (newValue, callback) => {
    setValue(newValue);
    callback();
  };
  const handleControlD = () => {
    console.log("handleControlD called");
    if (focusedCell && focusedCell.index > 0) {
      const cellAboveId = `${focusedCell.index - 1}-${focusedCell.id}`;
      console.log("cellAboveId:", cellAboveId);
      if (cellRefs[cellAboveId]) {
        const aboveCellValue = cellRefs[cellAboveId].current.value;
        console.log("aboveCellValue:", aboveCellValue);
        setValue(aboveCellValue);
        onBlur(); // Save the value

        const cellBelowId = `${focusedCell.index + 1}-${focusedCell.id}`;
        console.log("cellBelowId:", cellBelowId);
        if (cellRefs[cellBelowId]) {
          console.log("Moving focus to cell below");
          cellRefs[cellBelowId]?.current?.focus();
          setFocusedCell({ index: focusedCell.index + 1, id: focusedCell.id });
        }
      }
    }
  };
  const onBlur = async () => {
    if (value !== initialValue) {
      const updated = await updateRow(Item_id, { [id]: value }, session);
      if (updated) {
        setValue(value);
      }
    }
    setIsEditable(false);
  };
  const onFoc = (e) => {
    setIsEditable(true);
  };

  useEffect(() => {
    if (value !== initialValue) {
      onBlur();
    }
  }, [value]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (focusedCell) {
        if (event.ctrlKey && event.key === "d") {
          event.stopPropagation();
          event.preventDefault();
          handleControlD();
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          if (focusedCell.index > 0) {
            const cellAboveId = `${focusedCell.index - 1}-${focusedCell.id}`;
            if (cellRefs[cellAboveId]) {
              cellRefs[cellAboveId]?.current?.focus();
              setFocusedCell({
                index: focusedCell.index - 1,
                id: focusedCell.id,
              });
            }
          }
        } else if (event.key === "ArrowDown") {
          event.preventDefault();
          const cellBelowId = `${focusedCell.index + 1}-${focusedCell.id}`;
          if (cellRefs[cellBelowId]) {
            cellRefs[cellBelowId]?.current?.focus();
            setFocusedCell({
              index: focusedCell.index + 1,
              id: focusedCell.id,
            });
          }
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          const columns = table
            .getAllLeafColumns()
            .filter((column) => column.getIsVisible());
          const columnIndex = columns.findIndex(
            (column) => column.id === focusedCell.id
          );
          if (columnIndex < columns.length - 1) {
            const cellRightId = `${focusedCell.index}-${
              columns[columnIndex + 1].id
            }`;
            if (cellRefs[cellRightId]) {
              cellRefs[cellRightId]?.current?.focus();
              setFocusedCell({
                index: focusedCell.index,
                id: columns[columnIndex + 1].id,
              });
            }
          }
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          const columns = table
            .getAllLeafColumns()
            .filter((column) => column.getIsVisible());
          const columnIndex = columns.findIndex(
            (column) => column.id === focusedCell.id
          );
          if (columnIndex > 0) {
            const cellLeftId = `${focusedCell.index}-${
              columns[columnIndex - 1].id
            }`;
            if (cellRefs[cellLeftId]) {
              cellRefs[cellLeftId]?.current?.focus();
              setFocusedCell({
                index: focusedCell.index,
                id: columns[columnIndex - 1].id,
              });
            }
          }
        }
      } // Add this line
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [focusedCell, cellRefs]);

  const onCellClick = (rowIndex, columnId) => {
    setFocusedCell({ index: rowIndex, id: columnId });
  };
  return (
    <input
      ref={cellRef}
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
      onClick={() => onCellClick(index, id)}
    />
  );
};

export const idCellRenderer = ({ getValue, fun }: idCellRendererProps) => {
  const initialValue = getValue();
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <a
        className="text-blue-600 cursor-pointer underline "
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fun();
        }}
      >
        {initialValue}
      </a>
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
export const columnList = (currTable: {
  getAllLeafColumns: () => Column[];
}) => {
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

// old real delete row function

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

/*

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "d") {
        event.stopPropagation();
        event.preventDefault();

        if (clickedCell && clickedCell.ref === cellRef.current) {
          console.log("ctrld works");
          // console.log("ctrld cell ref", cellRef.current);
          handleControlD();
        }
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (index > 0) {
          const cellAboveId = `${index - 1}-${id}`;
          if (cellRefs[cellAboveId]) {
            cellRefs[cellAboveId]?.current?.focus();
          }
        }
      } else if (event.key === "ArrowDown") {
        ("concole log arrow down");
        event.preventDefault();
        const cellBelowId = `${index + 1}-${id}`;
        if (cellRefs[cellBelowId]) {
          cellRefs[cellBelowId]?.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [table, cellRef, clickedCell, index]);

  const onCellClick = (rowIndex, columnId) => {
    "calling on cell click";
    const cellAboveRowIndex = index - 1;
    const cellAboveCellId = `${cellAboveRowIndex}-${id}`;
    const cellBelowRowIndex = index + 1;
    const cellBelowCellId = `${cellBelowRowIndex}-${id}`;

    setClickedCell({ rowIndex, columnId, ref: cellRef.current });
    console.log("clicked cell", {
      rowIndex,
      columnId,
      ref: cellRef.current,
    });
    // Set cell above if it exists
    if (cellAboveRowIndex >= 0 && cellRefs[cellAboveCellId]) {
      setCellAbove({
        rowIndex: cellAboveRowIndex,
        columnId: id,
        ref: cellRefs[cellAboveCellId].current,
      });
      console.log("cell above", {
        rowIndex: cellAboveRowIndex,
        columnId: id,
        ref: cellRefs[cellAboveCellId].current,
      });
    }

    // Set cell below if it exists
    if (cellRefs[cellBelowCellId]) {
      setCellBelow({
        rowIndex: cellBelowRowIndex,
        columnId: id,
        ref: cellRefs[cellBelowCellId].current,
      });
      console.log("cell below", {
        rowIndex: cellBelowRowIndex,
        columnId: id,
        ref: cellRefs[cellBelowCellId].current,
      });
    }
  };

*/
