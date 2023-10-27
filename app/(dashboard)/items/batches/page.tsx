import React, { Suspense, FC } from 'react';
import { getServerSession } from 'next-auth';
import { options } from '../../../api/auth/[...nextauth]/options';
import Loading from '../../loading';
import BatchesList from './batchesList';
import { Session } from '../../../types';
import { ProjectBatches, SearchParams } from '../../../types';



interface BatchesProps {
    searchParams: SearchParams;
  }


async function getData(value: SearchParams): Promise<ProjectBatches[]> {
  const session = await getServerSession(options) as Session;
  const res = await fetch(`http://localhost:3000/project-batches/project-batches/${value.job_id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.accessToken}`, // Include the JWT token here
    },
    next: {
      revalidate: 10,
    },
  });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  return res.json();
}



const Batches: FC<BatchesProps> = async ({ searchParams }) => {
    //type searchparams
  const projectBatches = await getData(searchParams);
  return (
    <div className='w-full '>
      <Suspense fallback={<Loading />}>
        <BatchesList projects={projectBatches} />
      </Suspense>
    </div>
  );
}

export default Batches;