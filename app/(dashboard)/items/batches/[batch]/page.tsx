import React from "react";
import ItemList from "./itemList";
import { getServerSession } from "next-auth";
import { options } from "../../../../api/auth/[...nextauth]/options";

import { Session, ItemsParams } from "../../../../types";

interface ItemsParam {
  params: ItemsParams;
}

const getData = async (batch: string) => {
  try {
    const session = (await getServerSession(options)) as Session;

    const res = await fetch(`http://localhost:3000/items/batch/${batch}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`, // Include the JWT token here
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data. HTTP status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const Items: React.FC<ItemsParam> = async ({ params }) => {
  const items = await getData(params.batch);
  return (
    <div>
      <ItemList items={items} batchNum={params.batch} />
    </div>
  );
};

export default Items;
