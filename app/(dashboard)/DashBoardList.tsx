"use client";

import { Session } from "../types";
import { useState, useEffect } from "react";
import AllItemsChart from "../components/CHARTS/Alltemscharts";
import MainTable from "../components/TABLES/MainTable";
import { useSession } from "next-auth/react";

const DashboardList = ({ userProjects }) => {
  const { data: session } = useSession() as { data: Session | null };
  const allProjects = userProjects.userProjects; // Fetch or define your projects here
  const [selectedProject, setSelectedProject] = useState(allProjects[0]);
  const [tableItems, setTableItems] = useState([]);
  const handleBatchClick = (project) => {
    console.log(project);
  };

  //calls to the backend to retrieve sometables
  useEffect(() => {
    const fetchItems = async () => {
      const allItems = [];

      for (const project of allProjects) {
        const res = await fetch(
          `http://localhost:3000/items/project/${project.job_id}`,

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const items = await res.json();
        allItems.push(items);
      }

      setTableItems(allItems);
    };

    fetchItems();
  }, [allProjects]);

  return (
    <main className="px-2 pb-2 h-screen overflow-auto grid grid-cols-2 grid-rows-2 gap-4 auto-rows-min no-scrollbar">
      <AllItemsChart
        allProjects={allProjects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />

      {tableItems &&
        tableItems.map((project, index) => (
          <div
            className="h-full overflow-auto  no-scrollbar"
            key={project.job_id}
          >
            <h1>TABLE {project.job_id}</h1>
            <h3>{project.job_id}</h3>
            <MainTable
              key={index}
              tableItems={Object.values(project)} // Render the values of the object
              onBatchClick={handleBatchClick}
              clickableColumn={"Item_id"}
            />
          </div>
        ))}
    </main>
  );
};

export default DashboardList;

/*



      <AllItemsChart
        allProjects={userProjects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
      />
*/
