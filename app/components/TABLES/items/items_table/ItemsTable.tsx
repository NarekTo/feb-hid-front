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
  customCellRenderer,
  imageCellRenderer,
  down,
  fuzzySort,
  getHighestItemId,
  getSelectedRows,
  idCellRenderer,
  lockCellRenderer,
  newRow,
  onDragStart,
  onDrop,
  sortTableData,
  up,
  useSkipper,
} from "./functions/items_table_fns";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  ProjectItems,
  Session,
  ProjectItemImages,
  ManufacturerInfo,
  RowData,
} from "../../../../types";
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
import Modal from "../../../UI_SECTIONS/page/Modal";
import {
  addRow,
  changeRowStatus,
  fetchItemDetails,
  fetchRowData,
  updateItemsDetails,
  updateRow,
} from "../../../../utils/api";
import {
  useClickedCellStore,
  useOptionStore,
  useStoreMark,
} from "../../../../store/store";
import MarkModal from "./components/ModalMark";
import { PasteButton } from "./components/topMenu/PasteButton";
import * as XLSX from "xlsx";
import { ViewGroupButton } from "./components/topMenu/VIewGroupButton";
import EvaluateCostsModal from "./components/evaluateModal";
import SpecDocument from "../../../PDF/ITEMS/ViewSpecs";
import { mockRowData } from "../../../../utils/mock";
import PdfViewerComponent from "../../../PDF/ITEMS/pdfViewer";
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
  const [pdfDoc, setPdfDoc] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [points, setPoints] = useState({
    x: 0,
    y: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    text: "",
    button1Text: "",
    button1Action: () => {},
    button2Text: "",
    button2Action: () => {},
  });
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markedRow, setMarkedRow] = useState(null);
  const isAnyRowSelected = Object.values(rowSelection).some((value) => value);
  const [groupViewActive, setGroupViewActive] = useState(true);
  const [evaluateModalOpen, setEvaluateModalOpen] = useState(false);
  const [evaluateCostsData, setEvaluateCostsData] = useState({
    currency: "SAR",
    itemsCount: 0,
    budget: 0,
    actual: 0,
    clientOffer: 0,
    variance: 0,
  });
  const tableRef = useRef(null);
  const virtualRef = useRef(null);
  const job_id = searchParams.get("job_id") as string;
  const tbodyRef = useRef(null);

  //------------------------------------ZUSTAND store
  const selectedRow = useOptionStore((state) => state.selectedRow); // row selected by click
  const setSelectedRow = useOptionStore((state) => state.setSelectedRow);
  const setSelectedCell = useClickedCellStore((state) => state.setClickedCell);
  const selectedCell = useClickedCellStore((state) => state.clickedCell);
  const { setAction, action, checkboxOptions } = useStoreMark();

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
        id: "item_image",
        header: "Item Image",
        accessorKey: "item_image",
        cell: (cellInfo) =>
          imageCellRenderer({
            itemId: cellInfo.row.original.Item_id,
            imageSequence: 1,
          }),
      },
      {
        id: "job_id",
        header: "Job id",
        accessorKey: "job_id",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "batch_number",
        header: "Batch number",
        accessorKey: "batch_number",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "location_code",
        header: "Location code",
        accessorKey: "location_code",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "item_ref",
        header: "Item ref",
        accessorKey: "item_ref",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },

      {
        id: "group_number",
        header: "Group number",
        accessorKey: "group_number",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "group_sequence",
        header: "Group sequence",
        accessorKey: "group_sequence",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "item_status",
        header: "Item status",
        accessorKey: "item_status",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "design_ref",
        header: "Design ref",
        accessorKey: "design_ref",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "item_code",
        header: "Item code",
        accessorKey: "item_code",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "additional_description",
        header: "Additional description",
        accessorKey: "additional_description",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "quantity",
        header: "Quantity",
        accessorKey: "quantity",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "spares",
        header: "Spares",
        accessorKey: "spares",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "uom_code",
        header: "UOM Code",
        accessorKey: "uom_code",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "supplier_code",
        header: "Supplier code",
        accessorKey: "supplier_code",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "manufacturer_id",
        header: "Manufacturer id",
        accessorKey: "manufacturer_id",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "part_number",
        header: "Part number",
        accessorKey: "part_number",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "actual_currency",
        header: "Actual currency",
        accessorKey: "actual_currency",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "actual_exchange_rate",
        header: "Actual exchange rate",
        accessorKey: "actual_exchange_rate",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "actual_value",
        header: "Actual value",
        accessorKey: "actual_value",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "budget_currency",
        header: "Budget currency",
        accessorKey: "budget_currency",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "budget_exchange_rate",
        header: "Budget exchange rate",
        accessorKey: "budget_exchange_rate",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "budget_value",
        header: "Budget value",
        accessorKey: "budget_value",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "client_markup",
        header: "Client markup",
        accessorKey: "client_markup",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "client_currency",
        header: "Client currency",
        accessorKey: "client_currency",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "client_exchange_rate",
        header: "Client exchange rate",
        accessorKey: "client_exchange_rate",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "client_value",
        header: "Client value",
        accessorKey: "client_value",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },

      {
        id: "package_code",
        header: "Package code",
        accessorKey: "package_code",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "supplier_address_id",
        header: "Supplier address id",
        accessorKey: "supplier_address_id",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "del_address_id",
        header: "Del address id",
        accessorKey: "del_address_id",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "delivery_date",
        header: "Delivery date",
        accessorKey: "delivery_date",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "drawing_revision",
        header: "Drawing revision",
        accessorKey: "drawing_revision",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "drawing_issue_date",
        header: "Drawing issue date",
        accessorKey: "drawing_issue_date",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "Inquiry_id",
        header: "Inquiry id",
        accessorKey: "Inquiry_id",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "order_id",
        header: "Order id",
        accessorKey: "order_id",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "order_number",
        header: "Order number",
        accessorKey: "order_number",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "country_of_origin",
        header: "Country of origin",
        accessorKey: "country_of_origin",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "quote_ref",
        header: "Quote ref",
        accessorKey: "quote_ref",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "quote_date",
        header: "Quote date",
        accessorKey: "quote_date",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "shop_drawing",
        header: "Shop drawing",
        accessorKey: "shop_drawing",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "sample",
        header: "Sample",
        accessorKey: "sample",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "inspection",
        header: "Inspection",
        accessorKey: "inspection",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "photograph",
        header: "Photograph",
        accessorKey: "photograph",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "reservation_number",
        header: "Reservation number",
        accessorKey: "reservation_number",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "reservation_date",
        header: "Reservation date",
        accessorKey: "reservation_date",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "specifier_id",
        header: "Specifier id",
        accessorKey: "specifier_id",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "design_notes",
        header: "Design notes",
        accessorKey: "design_notes",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "user_notes",
        header: "User notes",
        accessorKey: "user_notes",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "supplier_notes",
        header: "Supplier notes",
        accessorKey: "supplier_notes",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "created_date",
        header: "Created date",
        accessorKey: "created_date",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
      {
        id: "modified_date",
        header: "Modified date",
        accessorKey: "modified_date",
        cell: (cellProps) => {
          const cellId = `${cellProps.row.index}-${cellProps.column.id}`;
          return customCellRenderer({
            ...cellProps,
            cellRef: cellRefs.current[cellId],
            cellRefs: cellRefs.current,
            setTableData,
          });
        },
      },
    ],
    [isFiltering]
  );

  const cellRefs = useRef({});
  data.forEach((_, rowIndex) => {
    columns.forEach((column) => {
      const cellId = `${rowIndex}-${column.id}`;
      cellRefs.current[cellId] = useRef();
      //setRefNames(prevRefNames => [...prevRefNames, cellId]);
    });
  });

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
    const { project, batch, items } = await fetchRowData(
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
    }
    if (kind === "primary") {
      newTableRow.location_code = "";
      newTableRow.group_number = highest;
      newTableRow.group_sequence = "1";
    }

    addRow(newTableRow, session); //DB POST api call
  };

  const handleDelete = () => {
    if (!selectedRow) {
      // Assuming selectedRow is null or undefined when no row is selected
      setModalConfig({
        text: "Please select a row to perform this action.",
        button1Text: "OK",
        button1Action: () => setShowModal(false),
        button2Text: "",
        button2Action: () => {},
      });
      setShowModal(true);
      return;
    }
    // Get the selected rows
    const selectedRows = getSelectedRows(rowSelection, tableData);
    if (selectedRows.length === 0) {
      console.error("No row selected");
      return;
    }

    const hasGroupSequenceOne = selectedRows.some((row) => {
      const sameGroupRows = tableData.filter(
        (tableRow) => tableRow.group_number === row.group_number
      );

      return (
        row.group_sequence === "1" &&
        sameGroupRows.length > 1 &&
        sameGroupRows.some((r) => r.group_sequence !== "1")
      );
    });

    if (hasGroupSequenceOne) {
      setModalConfig({
        text: "Cannot delete item with group sequence 1 if there are other items in the same group",
        button1Text: "OK",
        button1Action: () => setShowModal(false),
        button2Text: "",
        button2Action: () => {},
      });
    } else {
      setModalConfig({
        text: `Are you sure you want to delete the selected item(s)?`,
        button1Text: "Yes",
        button1Action: () => handleConfirmDelete(selectedRows),
        button2Text: "No",
        button2Action: handleCancelDelete,
      });
    }

    setShowModal(true);
  };

  const handleConfirmDelete = async (rowsToDelete) => {
    const errors = [];
    const deletePromises = rowsToDelete.map((row) => {
      return changeRowStatus(row.Item_id, "IZ", session).catch((error) => {
        errors.push(
          `Failed to change status for item ${row.Item_id}: ${error}`
        );
      });
    });

    await Promise.all(deletePromises);

    if (errors.length > 0) {
      console.error("Some rows failed to update:", errors);
      // Handle errors (e.g., show a notification to the user)
    } else {
      // Optimistically remove the rows from the UI
      setTableData((currentData) =>
        currentData.filter((item) => !rowsToDelete.includes(item))
      );
    }

    setRowSelection({});
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    //setSelectedRow(null);
    setShowModal(false);
  };

  const handleDuplicate = async () => {
    if (!selectedRow) {
      // Assuming selectedRow is null or undefined when no row is selected
      setModalConfig({
        text: "Please select a row to perform this action.",
        button1Text: "OK",
        button1Action: () => setShowModal(false),
        button2Text: "",
        button2Action: () => {},
      });
      setShowModal(true);
      return;
    }
    // Check if the user has "W" authorisation
    const { batch, items } = await fetchRowData(
      Number(job_id),
      batchNum,
      session
    );
    // Check if a row is selected
    if (!selectedRow) {
      console.error("No row selected");
      return;
    }
    const highest = (getHighestItemId(items) + 1).toString();
    const newTableRow = {
      ...selectedRow,
      group_number: highest,
      Item_id: highest,
      drawing_revision: "",
      drawing_issue_date: new Date(),
      item_status:
        batch.batch_status === "BB"
          ? "IB"
          : batch.batch_status === "BD"
          ? "ID"
          : "UN",
    };

    // Use the addRow function to create the new row
    addRow(newTableRow, session);
    setSelectedRow(newTableRow);
  };

  const handleCopy = async (cell) => {
    const rowIndex = cell && cell.row.index;
    const col = cell && cell.column.columnDef.id;
    if (rowIndex !== 0) {
      setSelectedCell({ index: rowIndex, id: col });
      setSelectedColumn(col);
    }
  };

  const handleCellValueChange = async (
    rowIndex: number,
    columnId: string,
    newValue: any
  ) => {
    const currentCellId = tableData[rowIndex].Item_id;
    setTableData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: newValue,
          };
        }
        return row;
      })
    );

    const updated = await updateRow(
      currentCellId,
      { [columnId]: newValue },
      session
    );
    if (updated) {
      console.log("Cell value updated in the backend");
    } else {
      console.log("Failed to update cell value in the backend");
    }
  };

  //------------------------------------SELECT FILTERS & LINK ROW FUNCTIONS

  const onRowClick = (row: Row<ProjectItems>) => {
    setSelectedRow(null); // Deselect the row
    const actualRow = row && row.original;
    const isAnyRowSelected = Object.values(rowSelection).some(
      (value) => value === true
    );
    if (!isAnyRowSelected) {
      setSelectedRow(actualRow);
    }
  };

  const getRowStyles = (row: Row<ProjectItems>) => {
    const selectedRows = getSelectedRows(rowSelection, tableData);

    // Ensure that row.original exists and has the property Item_id
    if (row?.original?.Item_id && selectedRow?.Item_id) {
      if (row.original.Item_id === selectedRow.Item_id) {
        return { backgroundColor: "#BDCCE5" };
      }
    }
    if (markedRow && markedRow.Item_id === row.original.Item_id) {
      return { backgroundColor: "yellow" };
    }

    return {}; // Default style for non-selected rows
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

  const handleMark = () => {
    if (!selectedRow) {
      // Assuming selectedRow is null or undefined when no row is selected
      setModalConfig({
        text: "Please select a row to perform this action.",
        button1Text: "OK",
        button1Action: () => setShowModal(false),
        button2Text: "",
        button2Action: () => {},
      });
      setShowModal(true);
      return;
    }
    if (markedRow) {
      setMarkedRow(null);
    } else if (selectedRow) {
      setShowMarkModal(!showMarkModal);
      setMarkedRow(selectedRow);
      selectedRow && getRowStyles(selectedRow);
    }
  };

  const handlePaste = async () => {
    const marked = await fetchItemDetails(markedRow.Item_id, session);
    const selectedRows = getSelectedRows(rowSelection, tableData);
    const canUpdateAll = selectedRows.every((row) =>
      ["IB", "ID", "IDR", "IXH"].includes(row.status_code)
    );

    if (!canUpdateAll) {
      handleMerge(marked, checkboxOptions, selectedRows);
    } else {
      console.error(
        "Update can only be performed on items with status codes IB, ID, IDR, IXH"
      );
    }
    setMarkedRow(null);
  };

  const handleMerge = async (marked, options, selectedRows) => {
    const keysToUpdate = Object.keys(options).filter((key) => options[key]);
    const updatedItems = [];
    let errorOccurred = false;

    for (const row of selectedRows) {
      const item_id = row.Item_id.trim();
      for (const key of keysToUpdate) {
        let value = marked[key];
        if (Array.isArray(value)) {
          value = value.map((item) => ({
            ...item,
            item_id: item_id, // Use the item_id of the row you want to update
          }));
        }
        const updated = await updateItemsDetails(
          key,
          item_id,
          value,
          action,
          session
        );
        if (updated) {
          updatedItems.push(`${item_id} (${key})`);
          console.log(`Updated ${key} for item ${item_id}`);
        } else {
          errorOccurred = true;
          console.error(`Failed to update ${key} for item ${item_id}`);
        }
      }
    }
    setSelectedRow(null);
    setRowSelection({});
    setAction("");

    if (errorOccurred) {
      setModalConfig({
        ...modalConfig,
        text: "There was a problem, please try again.",
        button1Text: "OK",
        button1Action: () => setShowModal(false), // Close the modal when "OK" is clicked
      });
    } else {
      setModalConfig({
        ...modalConfig,
        text: `Items ${updatedItems.join(", ")} were updated.`,
        button1Text: "OK",
        button1Action: () => setShowModal(false), // Close the modal when "OK" is clicked
      });
    }

    setShowModal(true);

    return selectedRows;
  };

  const exportToExcel = (tableData) => {
    console.log("batchNum", batchNum);
    console.log("project", project);

    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${project}-Batch${batchNum}-Items.xlsx`);
  };
  const viewGroup = () => {
    if (!selectedRow) {
      // Assuming selectedRow is null or undefined when no row is selected
      setModalConfig({
        text: "Please select a row to perform this action.",
        button1Text: "OK",
        button1Action: () => setShowModal(false),
        button2Text: "",
        button2Action: () => {},
      });
      setShowModal(true);
      return;
    }
    setGroupViewActive((prevGroupViewActive) => {
      const newGroupViewActive = !prevGroupViewActive;
      if (!newGroupViewActive && selectedRow) {
        // Add a new filter for the group_number column
        setColumnFilters((oldFilters) => [
          ...oldFilters,
          { id: "group_number", value: selectedRow.group_number },
        ]);
      } else {
        // Remove the filter for the group_number column
        setColumnFilters((oldFilters) =>
          oldFilters.filter((filter) => filter.id !== "group_number")
        );
      }
      return newGroupViewActive;
    });
  };

  const evaluateCosts = async () => {
    console.log("currency", tableData[0]?.actual_currency);
    const itemsCount = tableData.length;
    console.log("itemsCount", itemsCount);
    // Calculate the sums of the relevant columns
    const totalActual = tableData.reduce((sum, row) => {
      const actualValue = Number(row.actual_value);
      return sum + (isNaN(actualValue) ? 0 : actualValue);
    }, 0);

    const totalBudget = tableData.reduce((sum, row) => {
      const budgetValue = Number(row.budget_value);
      return sum + (isNaN(budgetValue) ? 0 : budgetValue);
    }, 0);

    const totalClientOffer = tableData.reduce((sum, row) => {
      const clientValue = Number(row.client_value);
      return sum + (isNaN(clientValue) ? 0 : clientValue);
    }, 0);
    const currency = tableData[0]?.actual_currency || "";

    // Calculate variance as an example (this will depend on your specific logic)
    const variance = totalActual - totalBudget;
    const evaluateCostsData = {
      currency,
      itemsCount,
      budget: totalBudget,
      actual: totalActual,
      clientOffer: totalClientOffer,
      variance,
    };
    const fakeEvaluateCostsData = {
      currency: "USD", // Use a mock currency
      itemsCount: 10, // Mock number of items
      budget: 5000.0, // Mock budget value
      actual: 4500.0, // Mock actual value
      clientOffer: 4700.0, // Mock client offer value
      variance: 500.0, // Mock variance value
    };
    openEvaluateCostsModal(evaluateCostsData);
  };

  // Function to open the modal and set the data
  const openEvaluateCostsModal = (data) => {
    setEvaluateCostsData(data); // Assuming 'data' is an object with all the necessary info
    setEvaluateModalOpen(true); // Corrected to use setShowModal instead of setIsModalOpen
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
        setSelectedColumn(null);
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
      //setSelectedRow(null);
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

    return () => {
      socket.close();

      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("click", handleClick);
    };
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedCell) {
        if (event.ctrlKey && event.key === "d" && selectedCell.index !== 0) {
          event.preventDefault();
          event.stopPropagation();
          const cellAboveId = `${selectedCell.index - 1}-${selectedCell.id}`;
          const cellBelowId = `${selectedCell.index + 1}-${selectedCell.id}`;
          const aboveCell = cellRefs.current[cellAboveId];
          const belowCell = cellRefs.current[cellBelowId];

          if (
            aboveCell &&
            aboveCell.current &&
            belowCell &&
            belowCell.current
          ) {
            const newValue = aboveCell.current.value;
            belowCell.current.value = newValue;
            console.log("below cell", belowCell.current.value);
            handleCellValueChange(
              selectedCell.index,
              selectedCell.id,
              newValue
            );
            if (cellRefs.current[cellBelowId]) {
              cellRefs.current[cellBelowId]?.current?.focus();
              const nextRowIndex = selectedCell.index + 1;
              console.log("next row index", nextRowIndex);
              setSelectedRow(tableData[nextRowIndex]);
              console.log("selected row", tableData[nextRowIndex]);
              setSelectedCell({
                index: nextRowIndex,
                id: selectedCell.id,
              });
            }
            // Check if the selected cell is in the last row
          } else if (selectedCell.index === tableData.length - 1) {
            const newValue = aboveCell.current.value;
            handleCellValueChange(
              selectedCell.index,
              selectedCell.id,
              newValue
            );
            console.log("This is the last row, no cell below");
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCell]);

  //------------------------------------MARK AND PASTE FUNCTIONS

  const viewSpecs = () => {
    console.log("view specs");
    setPdfDoc(true); // This should trigger a re-render and show the PDFViewer
  };

  return (
    <div ref={tableRef}>
      <Modal
        isOpen={showModal}
        text={modalConfig.text}
        button1Text={modalConfig.button1Text}
        button1Action={modalConfig.button1Action}
        button2Text={modalConfig.button2Text}
        button2Action={modalConfig.button2Action}
      />
      <MarkModal
        isOpen={showMarkModal}
        setModal={setShowMarkModal}
        setMarked={setMarkedRow}
      />
      <EvaluateCostsModal
        isOpen={evaluateModalOpen}
        data={evaluateCostsData}
        onClose={() => setEvaluateModalOpen(false)}
      />
      {pdfDoc && <PdfViewerComponent />}
      {clicked && (
        <ContextMenu
          top={points.y}
          left={points.x}
          row={selectedRow}
          onclick={handleAdd}
        />
      )}
      <div
        style={{ height: openingMenu ? "80px" : "30px" }}
        className="flex items-start duration-500 ease-in-out mb-2"
      >
        <div className="absolute flex gap-2">
          <TopMenuButton description="Hide Columns" onClick={handleOpening} />
          <AddButton description="Add" onclick={handleAdd} row={selectedRow} />
          <TopMenuButton description="Delete" onClick={handleDelete} />
          <TopMenuButton description="Duplicate" onClick={handleDuplicate} />

          <TopMenuButton
            description="Mark/Unmark"
            onClick={() => handleMark()}
          />
          <PasteButton
            description="Paste"
            onclick={() => handlePaste()}
            toggle={isAnyRowSelected && action !== ""}
          />

          <ViewGroupButton
            onclick={() => viewGroup()}
            toggle={groupViewActive}
            row={selectedRow}
          />

          <TopMenuButton
            description="Export Excel"
            onClick={() => exportToExcel(tableData)}
          />
          <TopMenuButton
            description="Evaluate"
            onClick={() => evaluateCosts()}
          />
          <TopMenuButton description="View Specs" onClick={() => viewSpecs()} />
        </div>
        {openingMenu && (
          <div className="flex w-full p-2 text-xs shadow-lg mt-8 rounded-md bg-slate-100">
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
          <tbody ref={tbodyRef}>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <tr
                  tabIndex={0}
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
                        tabIndex={index}
                        onClick={
                          cell.column.id === "Item_id"
                            ? () =>
                                handleItemClick(
                                  Number(cell.row.original.Item_id)
                                )
                            : () => handleCopy(cell)
                        }
                        style={getRowStyles(row)}
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
          <ToggleColorButton
            toggle={selectedColumn}
            description="Copy Down"
            onclick={() => setSelectedColumn(null)}
          />


*/
