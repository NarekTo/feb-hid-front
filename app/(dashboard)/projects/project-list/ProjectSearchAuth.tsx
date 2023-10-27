"use client"
import React, { FC, SetStateAction, Dispatch } from 'react';
import InputAutoComplete from '../../../components/UI_ATOMS/InputAutoComplete';
import MainButton from '../../../components/UI_ATOMS/MainButton';
import { ProjectProjects as Project } from '../../../types';


interface ProjectSearchAuthProps {
  selected: Project;
  setSelected: Dispatch<SetStateAction<Project>>;
  list: Project[];
}

const ProjectSearchAuth: FC<ProjectSearchAuthProps> = ({selected, setSelected, list}) => {
    return (
        <div className="flex h-12 w-[400px] shadow-md rounded-md mb-2 items-center justify-between z-40">
          <div className="w-1/2 flex grow ">
            <InputAutoComplete
              list={list}
              selected={selected}
              setSelected={setSelected}
            />
          </div>
    
          <div className="p-2 flex justify-end">
            <MainButton
              title="Request Access"
              fun={() => console.log("clicking")}
            />
          </div>
      
        </div>
      );
    };

export default ProjectSearchAuth;