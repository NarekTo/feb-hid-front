import React from "react";
import {
  Column,
  Table,
  sortingFns,
  FilterFn,
  SortingFn,
} from "@tanstack/react-table";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

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
  if (dir === 0) {
    const valueA = rowA.getValue(columnId);
    const valueB = rowB.getValue(columnId);
    const numA = Number(valueA);
    const numB = Number(valueB);

    if (!isNaN(numA) && !isNaN(numB)) {
      // Both values are numbers, compare as numbers
      return numA > numB ? 1 : numA < numB ? -1 : 0;
    } else {
      // At least one value is not a number, compare as strings
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    }
  }

  return dir;
};

export const Filter = React.memo(function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );
  const filteredRowCount = table.getFilteredRowModel().flatRows.length;
  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => {
          const trimmedValue = typeof value === "string" ? value.trim() : value;
          column.setFilterValue(trimmedValue);
        }}
        placeholder={`Search... (${filteredRowCount})`}
        className="pl-2 w-36 border shadow rounded text-dark-blue outline-none focus:border-slate-500"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
});

// A debounced input react component
export const DebouncedInput = React.memo(function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
});
