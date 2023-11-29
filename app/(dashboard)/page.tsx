import DashboardList from "./DashBoardList";
import React, { Suspense, FC } from "react";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { Session } from "../types";
import Loading from "./loading";

async function getData(): Promise<Response> {
  const session = (await getServerSession(options)) as Session;
  const userId = session.user_id;
  const res = await fetch(
    `http://localhost:3000/projects/user-projects/${userId}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.accessToken}`, // Include the JWT token here
      },
      next: {
        revalidate: 10,
      },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const userProjects = await getData();
  return (
    <Suspense fallback={<Loading />}>
      <DashboardList userProjects={userProjects} />
    </Suspense>
  );
}
