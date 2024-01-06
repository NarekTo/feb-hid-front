"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TitleHeader from "../../../../components/UI_SECTIONS/page/TitleHeader";
import Message from "../../../../components/UI_ATOMS/Message";
import { ProjectItems } from "../../../../types";
import { ItemsTable } from "../../../../components/TABLES/items/items_table/ItemsTable";
import { transformItems } from "../../../../utils/constants";

export interface ItemsProps {
  items: ProjectItems[];
  batchNum: string;
}

const ItemList: React.FC<ItemsProps> = ({ items, batchNum }) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("project_name");

  const [tableItems, setTableItems] = useState<ProjectItems[]>(items);

  // in the useEffect the data is being transformed to remove any white spaces
  useEffect(() => {
    const transformedItems = transformItems(items);
    setTableItems(transformedItems);
  }, [items]);

  return (
    <div className="w-full px-2 ">
      <TitleHeader
        firstLabel="Project"
        firstValue={name}
        secondLabel="Batch n."
        secondValue={batchNum}
        thirdLabel="Items List"
      />

      <ItemsTable
        data={tableItems}
        setTableItems={setTableItems}
        project={name}
        batchNum={batchNum}
      />
    </div>
  );
};

export default ItemList;
