import React from 'react';
import ItemList from './itemList';
import { getServerSession } from 'next-auth';
import { options } from '../../../../api/auth/[...nextauth]/options';

import { Session, ItemsParams } from '../../../../types';

interface ItemsParam {
  params: ItemsParams;
}


const getData = async (batch: string) => {
  const session = await getServerSession(options) as Session;

  const res = await fetch(`http://localhost:3000/items/batch/${batch}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`, // Include the JWT token here
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
};


const Items: React.FC<ItemsParam> = async ({ params}) => {
  console.log("params", params)
  const items = await getData(params.batch);
  console.log("items list", items)
  return (
    <div>
      <ItemList items={items} batchNum={params.batch} />
    </div>
  );
};



export default Items;