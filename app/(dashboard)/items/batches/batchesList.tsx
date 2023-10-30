"use client";
import React, { Suspense, FC } from "react";
import Loading from "../../loading";
import MainTable from "../../../components/TABLES/MainTable";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import TitleHeader from "../../../components/UI_SECTIONS/page/TitleHeader";
import { ProjectBatches } from "../../../types";

export interface BatchesListProps {
  projects: ProjectBatches[];
}

const BatchesList: FC<BatchesListProps> = ({ projects }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("project_name") || "";

  const handleBatchClick = (item: ProjectBatches) => {
    const batchNumber = item.batch_number.trim();
    const jobId = item.job_id;
    router.push(
      `/items/batches/${batchNumber}?job_id=${jobId.trim()}&project_name=${name.replace(
        / /g,
        "_"
      )}`
    );
  };

  return (
    <div className="w-full px-2">
      <TitleHeader
        firstLabel="Project"
        firstValue={name}
        secondLabel="BatchesList"
      />
      <Suspense fallback={<Loading />}>
        {projects ? (
          <MainTable
            tableItems={projects}
            onBatchClick={handleBatchClick}
            clickableColumn="batch_number"
          />
        ) : (
          <p>There no data :(</p>
        )}
      </Suspense>
    </div>
  );
};

export default BatchesList;
