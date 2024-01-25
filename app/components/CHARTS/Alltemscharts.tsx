import { useEffect, useState } from "react";
import { MainListBox } from "./MainListBox";
import MainChart from "./MainChart";
import { ProjectProjects, Session } from "../../types";
import { signOut, useSession } from "next-auth/react";
import { getStatusName } from "../../utils/constants";
import { useRouter } from "next/navigation";

interface AllItemsChartProps {
  allProjects: ProjectProjects[];
  selectedProject: ProjectProjects;
  setSelectedProject: (project: ProjectProjects) => void;
}
interface Item {
  name: string;
  quantity: number;
}

const AllItemsChart: React.FC<AllItemsChartProps> = ({
  allProjects,
  selectedProject,
  setSelectedProject,
}) => {
  const { data: session } = useSession() as { data: Session | null };

  const router = useRouter();
  const [chartItems, setChartItems] = useState([]);
  useEffect(() => {
    const fetchItems = async () => {
      if (selectedProject) {
        const res = await fetch(
          `http://localhost:3000/items/project/${selectedProject.job_id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        if (res.status === 401) {
          console.log("checking for 401");
          // Redirect to "Change Password" page
          signOut();
          router.push("/login");
        } else if (!res.ok) {
          {
            throw new Error("Failed to fetch data");
          }
        } else {
          const items = await res.json();
          setChartItems(items);
        }
      }
    };

    fetchItems();
  }, [selectedProject]);

  //create an array of objects with the status and the quantity for the chart
  const statusCounts = chartItems.reduce((acc, item) => {
    const status = item.item_status; // Replace 'status' with the actual key for the status in your item objects
    const statusName = getStatusName(status); // Replace this with the actual function that gets the status name

    if (acc[statusName]) {
      acc[statusName].quantity += 1;
    } else {
      acc[statusName] = { name: statusName, quantity: 1 };
    }

    return acc;
  }, {});
  const statusArray = Object.values(statusCounts);
  return (
    <div className="bg-slate-100 rounded-md w-full  grow flex flex-col ">
      <div className="flex justify-between">
        <MainListBox
          list={allProjects}
          displayKey="project number - project name"
          setSelectedProject={setSelectedProject}
          selected={selectedProject}
        />
        <h3 className="text-lg font-semibold px-6 py-2 text-right">
          Number of Items
        </h3>
      </div>
      <MainChart items={statusArray as Item[]} />
    </div>
  );
};

export default AllItemsChart;

///>
