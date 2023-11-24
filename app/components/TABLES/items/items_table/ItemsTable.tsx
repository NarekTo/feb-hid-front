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
  Row,
} from "@tanstack/react-table";
import {
  addRow,
  calculateHighestGroupSeq,
  changeRowStatus,
  customCellRenderer,
  deleteRow,
  down,
  fetchTableData,
  fuzzySort,
  getHighestItemId,
  idCellRenderer,
  lockCellRenderer,
  newRow,
  onDragStart,
  onDrop,
  sortTableData,
  up,
  useSkipper,
} from "./functions/items_table_fns";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { ProjectItems, Session } from "../../../../types";
import { useOptionStore } from "../../../../store/store";
import { IconWithDescription } from "../../../UI_ATOMS/IconWithDescription";
import { MdDelete, MdArrowOutward } from "react-icons/md";
import { HiOutlineDuplicate } from "react-icons/hi";
import { BiExport, BiHide } from "react-icons/bi";
import { ContextMenu } from "./components/topMenu/ContextMenu";
import { fuzzyFilter } from "./components/Filter";
import { Filter } from "./components/Filter";
import { IndeterminateCheckbox } from "./components/IndeterminateCheckBox";
import FilterIcon from "./components/FilterIcon";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import TopMenuButton from "./components/topMenu/TopMenuButton";
import { AddButton } from "./components/topMenu/AddButton";
import HideCheckBox from "./components/HideCheckBox";
import { DeleteButton } from "./components/topMenu/DeleteButton";
import Modal from "../../../UI_SECTIONS/page/Modal";

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
  const [tableData, setTableData] = useState(useMemo(() => data, []));
  const [isFiltering, setIsFiltering] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({}); //bolleans: selection throu checkbox, can be many rows or one
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filterInputKey, setFilterInputKey] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [openingMenu, setOpeningMenu] = useState(false);
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const tableRef = useRef(null);
  const virtualRef = useRef(null);
  const job_id = searchParams.get("job_id") as string;

  //------------------------------------ZUSTAND store
  const selectedRow = useOptionStore((state) => state.selectedRow); // row selected by click
  const setSelectedRow = useOptionStore((state) => state.setSelectedRow);

  //------------------------------------COLUMNS
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
        id: "item_status",
        header: "Item status",
        accessorKey: "item_status",
        cell: customCellRenderer,
      },
      {
        id: "design_ref",
        header: "Design ref",
        accessorKey: "design_ref",
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

  //------------------------------------TABLE
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

  //------------------------------------CRUD ROW FUNCTIONS

  const handleAdd = async (
    kind: "primary" | "secondary" | "tertiary"
  ): Promise<void> => {
    const { project, batch, items } = await fetchTableData(
      Number(job_id),
      batchNum,
      session
    );
    const highest = (getHighestItemId(items) + 1).toString();
    const newTableRow = {
      ...newRow,
      Item_id: highest,
      job_id: job_id,
      batch_number: batchNum,
      created_date: new Date(),
      budget_currency: project.currency_code,
      budget_exchange_rate: parseFloat("1"),
      actual_value: parseFloat("0"),
      budget_value: parseFloat("0"),
      client_value: parseFloat("0"),
      item_status:
        batch.batch_status === "BB"
          ? "IB"
          : batch.batch_status === "BD"
          ? "ID"
          : "UN",
    };

    if (selectedRow) {
      console.log("selected row in add", selectedRow);
      const groupNumRows = tableData.filter(
        (row) => row.group_number === selectedRow.group_number
      );
      const highestGroupSeq = groupNumRows.length + 1;
      newTableRow.group_number = selectedRow.group_number;
      newTableRow.location_code = selectedRow.location_code;

      if (kind === "secondary") {
        // Find all secondary rows in the same group as the selected row
        const secondaryRows = groupNumRows.filter(
          (row) => Number(row.group_sequence) < 101
        );
        const highestGroupSeq = secondaryRows.length + 1;
        newTableRow.group_sequence = highestGroupSeq.toString();
      } else if (kind === "tertiary") {
        const highestGroupSeq =
          groupNumRows.length > 0
            ? Math.max(...groupNumRows.map((row) => Number(row.group_sequence)))
            : 0;

        newTableRow.group_sequence = (
          highestGroupSeq < 101 ? 101 : highestGroupSeq + 1
        ).toString();
      }
    } else if (kind === "primary") {
      newTableRow.group_number = highest;
      newTableRow.group_sequence = "1";
    }

    addRow(newTableRow, session); //DB POST api call
  };
  const handleDelete = () => {
    if (selectedRow && "Item_id" in selectedRow) {
      setShowModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedRow) {
      try {
        // Change the status to 'IZ'
        await changeRowStatus(selectedRow.Item_id, "IZ", session);
      } catch (error) {
        console.error("Failed to update item status", error);
      }
    }
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    //setSelectedRow(null);
    setShowModal(false);
  };

  //------------------------------------SELECT FILTERS & LINK ROW FUNCTIONS
  const onRowClick = (row: Row<ProjectItems>) => {
    setSelectedRow(null); // Deselect the row
    const actualRow = row.original;
    const isAnyRowSelected = Object.values(rowSelection).some(
      (value) => value === true
    );
    console.log("onCLICK SELECT rowSelection", rowSelection);
    if (!isAnyRowSelected) {
      setSelectedRow(actualRow);
      console.log("onCLICK tableData", tableData);
      console.log(
        "onCLICK highest next row",
        calculateHighestGroupSeq(tableData, actualRow)
      );
    }
  };

  const getRowStyles = (row: Row<ProjectItems>, index: number) => {
    let rowStyles = {};
    // Check if the row is selected by checkbox or by click
    if (rowSelection[index] || row.original.Item_id === selectedRow?.Item_id) {
      rowStyles = { backgroundColor: "#BDCCE5" }; // Color for selected row
    } else {
      rowStyles = {}; // Default styles for deselected row
    }
    return rowStyles;
  };

  const clearAllFilters = () => {
    const toggleFiltering = () => setIsFiltering((prevState) => !prevState);
    table.resetColumnFilters(true);
    table.resetGlobalFilter(true);
    toggleFiltering();
    setFilterInputKey((prevKey) => prevKey + 1);
  };

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

  //----------------------------------USE EFFECTS AND SOCKETS
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
    const handleOutsideClick = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setSelectedRow(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("click", handleClick);

    const socket = io("ws://localhost:3002");
    socket.on("connect", () => {
      console.log("WebSocket connection opened");
    });
    socket.on("error", (error: Error | string) => {
      console.log("WebSocket error: ", error);
    });
    socket.on("itemUpdated", (updatedItem) => {
      // Trim all string values in the updated item
      let trimmedItem = { ...updatedItem };
      for (let key in trimmedItem) {
        if (typeof trimmedItem[key] === "string") {
          trimmedItem[key] = trimmedItem[key].trim();
        }
      }
      console.log("Received updated item: ", trimmedItem);

      setTableData(
        (prevItems) =>
          prevItems
            .map((item) =>
              item.Item_id === trimmedItem.Item_id ? trimmedItem : item
            )
            .filter((item) => item.item_status !== "IZ") // Filter out items with status "IZ"
      );
      // Empty both rowSelection and selectedRow
      setRowSelection([]);
      setSelectedRow(null);
    });

    socket.on("itemDeleted", (deletedItem) => {
      setTableData((prevItems) =>
        prevItems.filter((item) => item.Item_id !== deletedItem.Item_id.trim())
      );
    });
    socket.on("itemAdded", (addedItem) => {
      let trimmedItem = { ...addedItem };
      for (let key in trimmedItem) {
        if (typeof trimmedItem[key] === "string") {
          trimmedItem[key] = trimmedItem[key].trim();
        }
      }

      setTableData((prevItems) => {
        const updatedData = [trimmedItem, ...prevItems];
        return sortTableData(updatedData);
      });
    });

    const sortedData = [...data].sort((a, b) => {
      if (a.group_number < b.group_number) return -1;
      if (a.group_number > b.group_number) return 1;
      return Number(a.group_sequence) - Number(b.group_sequence);
    });

    setTableData(sortedData);
    console.log("sorted data", sortedData);
    // Cleanup function
    return () => {
      socket.close();
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("click", handleClick);
    };
  }, [data]);

  return (
    <div ref={tableRef}>
      <Modal
        isOpen={showModal}
        text={`Are you sure you want to delete the row number ${selectedRow?.Item_id}?`}
        button1Text="Yes"
        button1Action={handleConfirmDelete}
        button2Text="No"
        button2Action={handleCancelDelete}
      />
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
        className="flex items-start duration-500 ease-in-out mb-2"
      >
        <div className="absolute flex gap-2">
          <TopMenuButton description="Hide Columns" onClick={handleOpening} />

          <AddButton description="Add" onclick={handleAdd} row={selectedRow} />
          <DeleteButton description="Delete" onclick={handleDelete} />

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
          <div className="flex w-full p-2 text-xs shadow-lg mt-12 rounded-md bg-slate-100">
            {table.getAllLeafColumns().map((column) => {
              return <HideCheckBox column={column} key={column.id} />;
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
            {table.getRowModel().rows.map((row, index) => {
              const rowStyles = getRowStyles(row, index);

              return (
                <tr
                  onClick={() => onRowClick(row)}
                  key={row.id}
                  className="font-normal border-b "
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

/*

  const handleDelete = async () => {
    console.log("selectedRow from delete", selectedRow);
    console.log("row selection", rowSelection);
    if (selectedRow && "Item_id" in selectedRow) {
      const itemId = selectedRow["Item_id"] as string;
      try {
        await deleteRow(itemId, session);
      } catch (error) {
        console.error("Failed to delete row", error);
      }
    } else if (Object.keys(rowSelection).length > 0) {
      // Get the selected rows
      const selectedRows = Object.entries(rowSelection)
        .filter(([key, value]) => value && tableData[key]) // Ensure the row is selected and exists in tableData
        .map(([key]) => tableData[key]);

      // Delete each selected row
      for (const row of selectedRows) {
        const itemId = row.Item_id;
        try {
          await deleteRow(itemId, session);
        } catch (error) {
          console.error("Failed to delete row", error);
        }
      }
    }
    setRowSelection({});
  };


*/
