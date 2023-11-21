"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TitleHeader from "../../../../components/UI_SECTIONS/page/TitleHeader";
import Message from "../../../../components/UI_ATOMS/Message";
import { ProjectItems, Session } from "../../../../types";
import { ItemsTable } from "../../../../components/TABLES/items/items_table/ItemsTable";

export interface ItemsProps {
  items: ProjectItems[];
  batchNum: string;
}

const ItemList: React.FC<ItemsProps> = ({ items, batchNum }) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("project_name");

  const [tableItems, setTableItems] = useState<ProjectItems[]>(items);

  useEffect(() => {
    const transformedItems = items.map((item) => {
      const newItem = { ...item };
      for (const key in newItem) {
        if (typeof newItem[key] === "string") {
          newItem[key] = newItem[key].trim();
        }
      }
      return newItem;
    });
    setTableItems(transformedItems);
  }, [items]);

  return (
    <div className="w-full px-2">
      <TitleHeader
        firstLabel="Project"
        firstValue={name}
        secondLabel="Batch n."
        secondValue={batchNum}
        thirdLabel="Items List"
      />
      {tableItems && tableItems.length > 0 ? (
        <div>
          <ItemsTable
            data={tableItems}
            setTableItems={setTableItems}
            project={name}
            batchNum={batchNum}
          />
        </div>
      ) : (
        <Message title="No Items" message="There are no items in this batch" />
      )}
    </div>
  );
};

export default ItemList;

/*
 {tableItems && tableItems.length > 0 ? (
        <>
          <MainTableCrud
            project={name}
            tableItems={tableItems}
            setTableItems={setTableItems}
            batchNum={batchNum}
          />
          <ItemsTable data={tableItems} />
        </>
      ) : (
        <Message title="No Items" message="There are no items in this batch" />
      )}

*/
