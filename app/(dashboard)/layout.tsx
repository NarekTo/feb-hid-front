"use client";
import { FC, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loading from "./loading";
import { menuItemsFiltered } from "../utils/menuItems";
import { useStore } from "../store/store";
import { Menu } from "../components/UI_SECTIONS/menu/Menu";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const isBatchesPage = /\/items\/batches\/\d+/.test(pathname);
  const job_id = searchParams.get("job_id") as string;
  const project = searchParams.get("project_name") as string;
  const { setJobId, setProjectName, jobId, projectName } = useStore();

  useEffect(() => {
    setJobId(job_id);
    setProjectName(project);
  }, [job_id, project]);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login"); // replace "/login" with your login page route
    }
  }, [loading, session, router]);

  const items = menuItemsFiltered(isBatchesPage, jobId, projectName);

  if (loading || !session) {
    return <Loading />; // replace with a loading component if you have one
  }
  return (
    <div className="w-full h-full flex ">
      <div className="w-1/8">
        <Menu items={items} />
      </div>
      <div className="flex-grow overflow-x-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
