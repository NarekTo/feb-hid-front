"use client"
import React, { useEffect, useState } from "react";
import MainTableCrud from "../../../../components/TABLES/MainTableCrud";
import { useSearchParams } from "next/navigation";
import TitleHeader from "../../../../components/UI_SECTIONS/page/TitleHeader";
import Message from "../../../../components/UI_ATOMS/Message";
import { ItemsProps, ProjectItems } from "../../../../types";



const ItemList: React.FC<ItemsProps> = ({ items, batchNum }) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("project_name");

  const [tableItems, setTableItems] = useState<ProjectItems[]>(items);

  useEffect(() => {
    setTableItems(items);
  }, [items]);

  console.log("tableItems", tableItems.length === 0);

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
        <MainTableCrud
          project={name}
          tableItems={tableItems}
          setTableItems={setTableItems}
          batchNum={batchNum}
        />
      ) : (
        <Message
          title="No Items"
          message="There are no items in this batch"
        />
      )}
    </div>
  );
};

export default ItemList;