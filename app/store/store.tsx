import {create} from 'zustand';

type State = {
    jobId: string | null;
    projectName: string | null;
    setJobId: (id: string | null) => void;
    setProjectName: (name: string | null) => void;
  };
  
  export const useStore = create<State>(set => ({
    jobId: null,
    projectName: null,
    setJobId: (id: string | null) => set({ jobId: id }),
    setProjectName: (name: string | null) => set({ projectName: name }),
  }));