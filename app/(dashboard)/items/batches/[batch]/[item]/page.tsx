import React from "react";
import SingleItem from "./singleItem";
import { getServerSession } from "next-auth";
import { options } from "../../../../../api/auth/[...nextauth]/options";
import { ItemsParams, Session } from "../../../../../types";
import { useParams } from "next/navigation";

interface SingleItemParam {
  params: {
    item: string;
    batch: string;
  };
}

const getData = async (params: SingleItemParam["params"]) => {
  const session = (await getServerSession(options)) as Session;

  const res = await fetch(`http://localhost:3000/items/info/${params.item}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`, // Include the JWT token here
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

const Item: React.FC<SingleItemParam> = async ({ params }: SingleItemParam) => {
  const singleItem = await getData(params);
  console.log("singleItem", singleItem);

  return (
    <div>
      <SingleItem itemDetail={singleItem} />
    </div>
  );
};

export default Item;
