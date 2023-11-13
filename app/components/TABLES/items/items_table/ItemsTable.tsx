import {
  getCoreRowModel,
  useReactTable,
  flexRender,
  ColumnDef,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  ColumnMeta,
  TableOptions,
  Table,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  customCellRenderer,
  down,
  fuzzySort,
  getHighestGroupSeq,
  highestId,
  idCellRenderer,
  lockCellRenderer,
  newRow,
  onDragStart,
  onDrop,
  up,
  useSkipper,
} from "./functions/items_table_fns";
import React, { useMemo, useRef, useState, useEffect, useReducer } from "react";
import { ProjectItems, Session } from "../../../../types";
import { useOptionStore } from "../../../../store/store";
import {
  IconWithDescription,
  IconWithDescriptionDD,
} from "../../../UI_ATOMS/IconWithDescription";
import { MdDelete, MdAdd, MdArrowOutward } from "react-icons/md";
import { HiOutlineDuplicate } from "react-icons/hi";
import { BiExport, BiHide } from "react-icons/bi";
import { ContextMenu } from "./components/ContextMenu";
import { fuzzyFilter } from "./components/Filter";
import { Filter } from "./components/Filter";
import { IndeterminateCheckbox } from "./components/IndeterminateCheckBox";
import FilterIcon from "./components/FilterIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { io } from "socket.io-client";
//------------------------------------interfaces
export interface ItemsTableProps<T> {
  data: T[];
  project: string;
  batchNum: string;
  setTableItems: React.Dispatch<React.SetStateAction<T[]>>;
}
interface ExtendedColumnMeta extends ColumnMeta<ProjectItems, unknown> {
  getCellContext?: (cellContext: any) => any; // replace 'any' with the actual types if known
}
type useReactTable = <TData extends ProjectItems>(
  options: TableOptions<TData>
) => Table<TData>;

//------------------------------------MAIN COMPONENT
export const ItemsTable = React.memo(function ItemsTable({
  data,
  project,
  batchNum,
}: ItemsTableProps<ProjectItems>) {
  const searchParams = useSearchParams();
  const { data: session } = useSession() as { data: Session | null };

  const router = useRouter();
  const job_id = searchParams.get("job_id") as string;
  const [tableData, setTableData] = useState(useMemo(() => data, []));

  //------------------------------------COLUMNS
  const [isFiltering, setIsFiltering] = useState(false);

  const columns: ColumnDef<ProjectItems>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex flex-col items-center">
            <FilterIcon
              clearAllFilters={clearAllFilters}
              isFiltering={isFiltering}
            />
            <IndeterminateCheckbox
              className="items-center flex my-2"
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="items-center flex ml-[3px]">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        id: "lock",
        header: "",
        cell: lockCellRenderer,
      },
      {
        id: "Item_id",
        accessorKey: "Item_id",
        header: "Item id",
        cell: (cellInfo) =>
          idCellRenderer({
            getValue: () => cellInfo.row.original.Item_id,
            fun: () => handleItemClick(Number(cellInfo.row.original.Item_id)),
          }),
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
      },
      {
        id: "job_id",
        header: "Job id",
        accessorKey: "job_id",
        cell: customCellRenderer,
      },
      {
        id: "batch_number",
        header: "Batch number",
        accessorKey: "batch_number",
        cell: customCellRenderer,
      },
      {
        id: "location_code",
        header: "Location code",
        accessorKey: "location_code",
        cell: customCellRenderer,
      },
      {
        id: "item_ref",
        header: "Item ref",
        accessorKey: "item_ref",
        cell: customCellRenderer,
      },
      {
        id: "design_ref",
        header: "Design ref",
        accessorKey: "design_ref",
        cell: customCellRenderer,
      },
      {
        id: "item_status",
        header: "Item status",
        accessorKey: "item_status",
        cell: customCellRenderer,
      },
      {
        id: "item_code",
        header: "Item code",
        accessorKey: "item_code",
        cell: customCellRenderer,
      },
      {
        id: "additional_description",
        header: "Additional description",
        accessorKey: "additional_description",
        cell: customCellRenderer,
      },
      {
        id: "quantity",
        header: "Quantity",
        accessorKey: "quantity",
        cell: customCellRenderer,
      },
      {
        id: "spares",
        header: "Spares",
        accessorKey: "spares",
        cell: customCellRenderer,
      },
      {
        id: "uom_code",
        header: "UOM Code",
        accessorKey: "uom_code",
        cell: customCellRenderer,
      },
      {
        id: "supplier_code",
        header: "Supplier code",
        accessorKey: "supplier_code",
        cell: customCellRenderer,
      },
      {
        id: "manufacturer_id",
        header: "Manufacturer id",
        accessorKey: "manufacturer_id",
        cell: customCellRenderer,
      },
      {
        id: "part_number",
        header: "Part number",
        accessorKey: "part_number",
        cell: customCellRenderer,
      },
      {
        id: "actual_currency",
        header: "Actual currency",
        accessorKey: "actual_currency",
        cell: customCellRenderer,
      },
      {
        id: "actual_exchange_rate",
        header: "Actual exchange rate",
        accessorKey: "actual_exchange_rate",
        cell: customCellRenderer,
      },
      {
        id: "actual_value",
        header: "Actual value",
        accessorKey: "actual_value",
        cell: customCellRenderer,
      },
      {
        id: "budget_currency",
        header: "Budget currency",
        accessorKey: "budget_currency",
        cell: customCellRenderer,
      },
      {
        id: "budget_exchange_rate",
        header: "Budget exchange rate",
        accessorKey: "budget_exchange_rate",
        cell: customCellRenderer,
      },
      {
        id: "budget_value",
        header: "Budget value",
        accessorKey: "budget_value",
        cell: customCellRenderer,
      },
      {
        id: "client_markup",
        header: "Client markup",
        accessorKey: "client_markup",
        cell: customCellRenderer,
      },
      {
        id: "client_currency",
        header: "Client currency",
        accessorKey: "client_currency",
        cell: customCellRenderer,
      },
      {
        id: "client_exchange_rate",
        header: "Client exchange rate",
        accessorKey: "client_exchange_rate",
        cell: customCellRenderer,
      },
      {
        id: "client_value",
        header: "Client value",
        accessorKey: "client_value",
        cell: customCellRenderer,
      },
      {
        id: "group_number",
        header: "Group number",
        accessorKey: "group_number",
        cell: customCellRenderer,
      },
      {
        id: "group_sequence",
        header: "Group sequence",
        accessorKey: "group_sequence",
        cell: customCellRenderer,
      },
      {
        id: "package_code",
        header: "Package code",
        accessorKey: "package_code",
        cell: customCellRenderer,
      },
      {
        id: "supplier_address_id",
        header: "Supplier address id",
        accessorKey: "supplier_address_id",
        cell: customCellRenderer,
      },
      {
        id: "del_address_id",
        header: "Del address id",
        accessorKey: "del_address_id",
        cell: customCellRenderer,
      },
      {
        id: "delivery_date",
        header: "Delivery date",
        accessorKey: "delivery_date",
        cell: customCellRenderer,
      },
      {
        id: "drawing_revision",
        header: "Drawing revision",
        accessorKey: "drawing_revision",
        cell: customCellRenderer,
      },
      {
        id: "drawing_issue_date",
        header: "Drawing issue date",
        accessorKey: "drawing_issue_date",
        cell: customCellRenderer,
      },
      {
        id: "Inquiry_id",
        header: "Inquiry id",
        accessorKey: "Inquiry_id",
        cell: customCellRenderer,
      },
      {
        id: "order_id",
        header: "Order id",
        accessorKey: "order_id",
        cell: customCellRenderer,
      },
      {
        id: "order_number",
        header: "Order number",
        accessorKey: "order_number",
        cell: customCellRenderer,
      },
      {
        id: "country_of_origin",
        header: "Country of origin",
        accessorKey: "country_of_origin",
        cell: customCellRenderer,
      },
      {
        id: "quote_ref",
        header: "Quote ref",
        accessorKey: "quote_ref",
        cell: customCellRenderer,
      },
      {
        id: "quote_date",
        header: "Quote date",
        accessorKey: "quote_date",
        cell: customCellRenderer,
      },
      {
        id: "shop_drawing",
        header: "Shop drawing",
        accessorKey: "shop_drawing",
        cell: customCellRenderer,
      },
      {
        id: "sample",
        header: "Sample",
        accessorKey: "sample",
        cell: customCellRenderer,
      },
      {
        id: "inspection",
        header: "Inspection",
        accessorKey: "inspection",
        cell: customCellRenderer,
      },
      {
        id: "photograph",
        header: "Photograph",
        accessorKey: "photograph",
        cell: customCellRenderer,
      },
      {
        id: "reservation_number",
        header: "Reservation number",
        accessorKey: "reservation_number",
        cell: customCellRenderer,
      },
      {
        id: "reservation_date",
        header: "Reservation date",
        accessorKey: "reservation_date",
        cell: customCellRenderer,
      },
      {
        id: "specifier_id",
        header: "Specifier id",
        accessorKey: "specifier_id",
        cell: customCellRenderer,
      },
      {
        id: "design_notes",
        header: "Design notes",
        accessorKey: "design_notes",
        cell: customCellRenderer,
      },
      {
        id: "user_notes",
        header: "User notes",
        accessorKey: "user_notes",
        cell: customCellRenderer,
      },
      {
        id: "supplier_notes",
        header: "Supplier notes",
        accessorKey: "supplier_notes",
        cell: customCellRenderer,
      },
      {
        id: "created_date",
        header: "Created date",
        accessorKey: "created_date",
        cell: customCellRenderer,
      },
      {
        id: "modified_date",
        header: "Modified date",
        accessorKey: "modified_date",
        cell: customCellRenderer,
      },
    ],
    [isFiltering]
  );

  //------------------------------------zustand store
  const rerender = useReducer(() => ({}), {})[1];
  const selectedRow = useOptionStore((state) => state.selectedRow);
  const setSelectedRow = useOptionStore((state) => state.setSelectedRow);
  const groupNumber = useOptionStore((state) => state.groupNumber);
  const setGroupNumber = useOptionStore((state) => state.setGroupNumber);
  const groupSequence = useOptionStore((state) => state.groupSequence);
  const setGroupSequence = useOptionStore((state) => state.setGroupSequence);
  const primaryRow = useOptionStore((state) => state.primaryRow);
  const setPrimaryRow = useOptionStore((state) => state.setPrimaryRow);

  //------------------------------------state
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [primaryRows, setPrimaryRows] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterInputKey, setFilterInputKey] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState({});

  const [openingMenu, setOpeningMenu] = useState(false);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [clicked, setClicked] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const tableRef = useRef(null);
  const virtualRef = useRef(null);

  const clearAllFilters = () => {
    const toggleFiltering = () => setIsFiltering((prevState) => !prevState);
    table.resetColumnFilters(true);
    table.resetGlobalFilter(true);
    toggleFiltering();
    setFilterInputKey((prevKey) => prevKey + 1);
  };

  //----------------------------------------TABLE
  const table = useReactTable({
    data: tableData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },

    state: {
      columnFilters,
      sorting,
      columnVisibility,
      rowSelection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    // debugTable: true,
    // debugHeaders: true,
    // debugColumns: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    autoResetPageIndex,
    enableRowSelection: true, //enable row selection for all rows
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    // Add this line

    meta: {
      updateData: (rowIndex: number, columnId: string, value: any) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setTableData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    // debugTable: true,
  });

  //----------------------------------------functions

  //this is to open the single item page
  const handleItemClick = (itemId: number) => {
    const item = itemId.toString();
    const jobId = job_id.trim();
    router.push(
      `/items/batches/${batchNum}/${item}?job_id=${jobId}&project_name=${project.replace(
        / /g,
        "_"
      )}`
    );
  };

  const handleOpening = () => {
    setOpeningMenu(!openingMenu);
  };

  //this is to update the row with sockets
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTableCellElement>,
    itemId: string,
    key: string
  ) => {
    if (event.key === "Tab") {
      event.preventDefault(); // Prevent the default action (moving to the next cell)
      const updatedValue = (event.target as HTMLElement).innerText;
      const updatedItems = tableData.map((item) => {
        if (item.Item_id === itemId) {
          return { ...item, [key]: updatedValue };
        }
        return item;
      });
      setTableData(updatedItems);

      // Call your API to update the item in the database
      const response = await fetch(`http://localhost:3000/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(
          updatedItems.find((item) => item.Item_id === itemId)
        ),
      });
      if (response.ok) {
        console.log("Item updated successfully");

        // Emit the 'itemUpdated' event with the updated item
        const socket = io("ws://localhost:3002");
        socket.emit(
          "itemUpdated",
          updatedItems.find((item) => item.Item_id === itemId)
        );
      } else {
        console.log("Failed to update item");
      }

      // Move the focus to the next cell
      const targetElement = event.target as HTMLElement;
      const nextCell = targetElement.nextElementSibling;
      if (nextCell instanceof HTMLElement) {
        nextCell.focus();
      }
    }
  };

  const handleAdd = (kind: "primary" | "secondary" | "tertiary"): void => {
    const { setGroupNumber, setGroupSequence, setPrimaryRow, setSelectedRow } =
      useOptionStore();
    const newTableRow = { ...newRow };
    const highest = (highestId(data) + 1).toString();

    if (kind === "primary") {
      newTableRow.Item_id = highest;
      newTableRow.group_number = highest;
      newTableRow.group_sequence = "1";
      setGroupNumber(highest);
      setGroupSequence([1]);
      setPrimaryRow(newTableRow); // Set the primary row in Recoil
      setPrimaryRows((prevPrimaryRows) => [newTableRow, ...prevPrimaryRows]);
      setTableData((prevData) => [newTableRow, ...prevData]); // Add the new primary row to the table data
    } else if (kind === "secondary") {
      // Check if a primary row is selected
      if (selectedRow) {
        const primaryRow = data.find(
          (row) => row.Item_id === selectedRow.original.itemId
        );
        if (primaryRow) {
          newTableRow.Item_id = highest;
          newTableRow.group_number = primaryRow.group_number;
          // Calculate the highest group sequence for the selected group number
          const groupNumRows = data.filter(
            (row) => row.group_number === primaryRow.group_number
          );
          const highestGroupSeq =
            groupNumRows.length > 0
              ? Math.max(
                  ...groupNumRows.map((row) => Number(row.group_sequence))
                )
              : 0;

          newTableRow.group_sequence = (highestGroupSeq + 1).toString();
          // Insert the secondary row below the primary row
          const newData = [...data];
          const primaryIndex = newData.findIndex(
            (row) => row.Item_id === primaryRow.Item_id
          );
          newData.splice(primaryIndex + 1, 0, newTableRow);
          // Sort the rows by group number and group sequence
          newData.sort((a, b) => {
            if (a.group_number === b.group_number) {
              return Number(a.group_sequence) - Number(b.group_sequence);
            } else {
              return a.group_number.localeCompare(b.group_number);
            }
          });
          setTableData(newData);
        }
      }
    } else if (kind === "tertiary") {
      // Check if a primary row is selected
      if (selectedRow) {
        const primaryRow = data.find(
          (row) => row.Inquiry_id === selectedRow.original.itemId
        );
        if (primaryRow) {
          newTableRow.Item_id = highest;
          newTableRow.group_number = primaryRow.group_number;

          // Calculate the highest group sequence for the selected group number
          const groupNumRows = data.filter(
            (row) => row.group_number === primaryRow.group_number
          );
          const highestGroupSeq =
            groupNumRows.length > 0
              ? Math.max(
                  ...groupNumRows.map((row) => Number(row.group_sequence))
                )
              : 0;

          newTableRow.group_sequence = (
            highestGroupSeq >= 100 ? highestGroupSeq + 1 : 101
          ).toString();
          // Insert the tertiary row below the primary row
          const newData = [...data];
          const primaryIndex = newData.findIndex(
            (row) => row.Item_id === primaryRow.Item_id
          );
          newData.splice(primaryIndex + 1, 0, newTableRow);

          // Sort the rows by group number and group sequence
          newData.sort((a, b) => {
            if (a.group_number === b.group_number) {
              return Number(a.group_sequence) - Number(b.group_sequence);
            } else {
              return a.group_number.localeCompare(b.group_number);
            }
          });

          setTableData(newData);
        }
      }
    }
  };

  const handleDelete = async () => {
    if (rowSelection) {
      const filteredData = data.filter((item, index) => !rowSelection[index]);
      const updatedRowSelection = { ...rowSelection };
      Object.keys(updatedRowSelection).forEach((index) => {
        if (updatedRowSelection[index]) {
          delete updatedRowSelection[index];
        }
      });
      setTableData(filteredData);
      setRowSelection(updatedRowSelection);
    }
  };
  const onRowClick = (row) => {
    setPrimaryRow(row);
    setSelectedRow(row);
    setGroupNumber(row.original.group_number);
    const highestGroupSeq = getHighestGroupSeq(data, row.original.group_number);
  };

  //----------------------------------------useEffects
  useEffect(() => {
    const columnFilters = table.getState().columnFilters;
    columnFilters.forEach((filter) => {
      const { id } = filter;
      // Check if the column is being filtered
      if (id) {
        const sorting = table.getState().sorting;
        // Check if the column is not already sorted
      }
    });
    setIsFiltering(Object.keys(table.getState().columnFilters).length > 0);
  }, [table.getState().columnFilters]);

  useEffect(() => {
    const handleClick = () => setClicked(false);
    // Handle outside click
    const handleOutsideClick = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedRow(null);
      }
    };
    const socket = io("ws://localhost:3002");

    socket.on("connect", () => {
      console.log("WebSocket connection opened");
    });

    socket.on("error", (error: Error | string) => {
      console.log("WebSocket error: ", error);
    });

    socket.on("itemUpdated", (updatedItem) => {
      setTableData((prevItems) =>
        prevItems.map((item) =>
          item.Item_id === updatedItem.Item_id ? updatedItem : item
        )
      );
    });
    // Add event listeners
    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("click", handleClick);
    // Cleanup function
    return () => {
      socket.close();
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  //----------------------------------------FILTEEEEEEER

  return (
    <div ref={tableRef}>
      {clicked && (
        <ContextMenu
          top={points.y}
          left={points.x}
          row={selectedRow}
          onclick={handleAdd}
        />
      )}
      <div
        style={{ height: openingMenu ? "80px" : "40px" }}
        className="flex items-start duration-500 ease-in-out"
      >
        <div className="absolute flex">
          <IconWithDescription
            icon={BiHide}
            description="Hide Columns"
            onclick={handleOpening}
          />
          <IconWithDescription
            icon={MdDelete}
            description="Delete"
            onclick={handleDelete}
          />
          <IconWithDescriptionDD
            icon={MdAdd}
            description="Add"
            onclick={handleAdd}
            row={selectedRow}
          />
          <IconWithDescription
            icon={MdArrowOutward}
            description="Move"
            onclick={() => console.log("moving")}
          />
          <IconWithDescription
            icon={HiOutlineDuplicate}
            description="Duplicate"
            onclick={() => console.log("duplicate")}
          />
          <IconWithDescription
            icon={BiExport}
            description="Export"
            onclick={() => console.log("export")}
          />
        </div>
        {openingMenu && (
          <div className="flex bg-white w-full p-2 text-xs shadow-lg mt-9 rounded-md">
            {table.getAllLeafColumns().map((column) => {
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
            })}
          </div>
        )}
      </div>
      <div ref={virtualRef} style={{ height: "800px", overflowY: "auto" }}>
        <table
          className="w-full text-left text-sm font-light"
          onContextMenu={(e) => {
            e.preventDefault();
            setClicked(true);
            setPoints({
              x: e.pageX + 10,
              y: e.pageY - 80,
            });
          }}
        >
          <thead className="bg-dark-blue text-white sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    colSpan={header.colSpan}
                    key={header.id}
                    className={`font-medium whitespace-no-wrap  ${
                      index === 1 ? "px-0 " : "px-2"
                    } py-1 pt-2 cursor-pointer h-full  `}
                    draggable={
                      !table.getState().columnSizingInfo.isResizingColumn
                    }
                    data-column-index={header.index}
                    onDragStart={onDragStart}
                    onDragOver={(e) => {
                      e.preventDefault();
                    }}
                    onDrop={(e) => onDrop(e, table)}
                  >
                    {header.column.getCanFilter() ? (
                      <div className="pb-2">
                        <Filter
                          key={filterInputKey}
                          column={header.column}
                          table={table}
                        />
                      </div>
                    ) : null}

                    <div
                      className="flex items-center "
                      onClick={header.column.getToggleSortingHandler()} // Moved sorting handler here
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: up,
                        desc: down,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              const isRowSelected = selectedRow && selectedRow.id === row.id;
              const rowStyles = isRowSelected
                ? { backgroundColor: "#BDCCE5" }
                : {};
              return (
                <tr
                  onClick={() => onRowClick(row)}
                  key={row.id}
                  className="font-normal border-b even:bg-gray-100 odd:bg-white"
                >
                  {row.getVisibleCells().map((cell, index) => {
                    const cellContext = cell.getContext();
                    const cellMeta: ExtendedColumnMeta =
                      cellContext.column.columnDef.meta;
                    const cellContextProps =
                      cellMeta &&
                      cellMeta.getCellContext &&
                      cellMeta.getCellContext(cellContext);
                    return (
                      <td
                        onClick={
                          cell.column.id === "Item_id"
                            ? () =>
                                handleItemClick(
                                  Number(cell.row.original.Item_id)
                                )
                            : undefined
                        }
                        style={rowStyles}
                        key={cell.id}
                        className={`py-2 ${index === 1 ? "px-0 " : "px-2"}`}
                        {...cellContextProps}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
