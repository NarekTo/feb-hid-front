// ProjectsList.jsx
"use client"
import React, { useEffect, useState } from 'react'
import MainTable from '../../../components/TABLES/MainTable'
import ProjectSearchAuth from './ProjectSearchAuth'
import MainToggle from '../../../components/UI_ATOMS/MainToggle';
import { filterActiveProjects } from '../../../utils/constants';
import {ProjectProjects as Project, Response } from '../../../types';


interface ProjectsListProps {
  allProjects: Response;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ allProjects }) => {
  const { userProjects, projects } = allProjects
  const [selected, setSelected] = useState<Project | null>(projects[0] || null);
  const [active, setActive] = useState<Project[]>([]);
  const [showAll, setShowAll] = useState<boolean>(false);


  const handleBatchClick = (project: Project) => {
    window.open(`/items/batches?job_id=${project.job_id}&project_name=${project.project_name.replace(/ /g, '_')}`, '_blank');
  };



  useEffect(() => {
    const activeProjects = showAll ? userProjects : filterActiveProjects(userProjects);
    setActive(activeProjects);
    
  }, [userProjects, showAll]);

  return (
    <div className="p-2 bg-slate-100 rounded-md w-full">
      <div className='flex items-center justify-between '>
        <ProjectSearchAuth
          list={projects}
          selected={selected}
          setSelected={setSelected}
        />
        <div className="sticky top-0 right-0">
          <MainToggle showAll={showAll} setShowAll={setShowAll} />
        </div>
      </div>
      <div className=''>
        {projects ? (
          <MainTable
            tableItems={active}
            onBatchClick={handleBatchClick}
            clickableColumn={"project_number"}
          />
        ) : (
          <p>There is no data :(</p>
        )}
      </div>
    </div>
  );
};

export default ProjectsList