import React, { Suspense, FC } from 'react';
import { getServerSession } from "next-auth/next";
import { options } from "../../../api/auth/[...nextauth]/options";
import Loading from '../../loading';
import ProjectsList from './ProjectsList';
import { ProjectProjects, Response } from '../../../types';
import { Session } from '../../../types';



async function getData(): Promise<Response> {
  const session = await getServerSession(options) as Session;;
  const userId = session.user_id;
  const res = await fetch(`http://localhost:3000/projects/user-projects/${userId}`, {
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

const Projects: FC = async () => {
    const projects= await getData() 
  console.log("projects", projects)

  return (
    <div className="flex flex-col m-2 ">
      <Suspense fallback={<Loading />}>
      <ProjectsList allProjects={projects} />      
      </Suspense>
    </div>
  );
}

export default Projects;