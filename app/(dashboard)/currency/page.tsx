import React from "react";
import { getServerSession } from "next-auth";
import { ItemsParams, Session } from "../../types";
import { options } from "../../api/auth/[...nextauth]/options";
import CurrencyTable from "./CurrencyTable";

interface ItemsParam {
  params: ItemsParams;
}

const getData = async () => {
  try {
    const session = (await getServerSession(options)) as Session;

    const res = await fetch(`http://localhost:3000/currencies`, {
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

const Currency: React.FC<ItemsParam> = async () => {
  const curr = await getData();
  return (
    <div>
      <CurrencyTable currency={curr} />
    </div>
  );
};

export default Currency;
