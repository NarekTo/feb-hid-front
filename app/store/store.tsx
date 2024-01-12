import { create } from "zustand";
import { ProjectProjects } from "../types";

type ProjectState = {
  jobId: string | null;
  projectName: string | null;
  setJobId: (id: string | null) => void;
  setProjectName: (name: string | null) => void;
};

type TableOptionsState = {
  jobId: string | null;
  projectName: string | null;
  selectedRow: any | null;
  groupSequence: number[];
  groupNumber: string;
  primaryRow: any | null;
  setJobId: (id: string | null) => void;
  setProjectName: (name: string | null) => void;
  setSelectedRow: (value: any | null) => void;
  setGroupNumber: (value: string) => void;
  setGroupSequence: (sequence: number[]) => void;
  setPrimaryRow: (value: any | null) => void;
};
export type ProjectStore = {
  projectInfo: ProjectProjects | null;
  setProjectInfo: (info: ProjectProjects | null) => void;
};

export const useStore = create<ProjectState>((set) => ({
  jobId: null,
  projectName: null,
  setJobId: (id: string | null) => set({ jobId: id }),
  setProjectName: (name: string | null) => set({ projectName: name }),
}));

export const useOptionStore = create<TableOptionsState>((set) => ({
  jobId: null,
  projectName: null,
  selectedRow: null,
  groupNumber: "",
  groupSequence: [],
  primaryRow: null,
  setJobId: (id: string | null) => set({ jobId: id }),
  setProjectName: (name: string | null) => set({ projectName: name }),
  setSelectedRow: (value: any | null) => set({ selectedRow: value }),
  setGroupNumber: (value: string) => set({ groupNumber: value }),
  setGroupSequence: (value: any[]) => set({ groupSequence: value }),
  setPrimaryRow: (value: any | null) => set({ primaryRow: value }),
}));

export const useProjectStore = create<ProjectStore>((set) => ({
  projectInfo: null,
  setProjectInfo: (info: ProjectProjects | null) => set({ projectInfo: info }),
}));

//i want the clicke cell to be like this {index: 1, id: 'location_code'}
type ClickedCellState = {
  clickedCell: { index: number; id: string } | null;
  setClickedCell: (cell: { index: number; id: string } | null) => void;
};

export const useClickedCellStore = create<ClickedCellState>((set) => ({
  clickedCell: null,
  setClickedCell: (cell) => set({ clickedCell: cell }),
}));

type StoredValueState = {
  storedValue: any | null;
  setStoredValue: (value: any | null) => void;
};

export const useStoredValueStore = create<StoredValueState>((set) => ({
  storedValue: null,
  setStoredValue: (value) => set({ storedValue: value }),
}));

interface CheckboxOptions {
  itemDimensions: boolean;
  itemCompositions: boolean;
  itemSpecifications: boolean;
  itemImages: boolean;
  itemLocations: boolean;
}

type StoreMarkState = {
  action: string | null;
  checkboxOptions: CheckboxOptions;
  setAction: (action: string | null) => void;
  setCheckboxOptions: (
    options:
      | Partial<CheckboxOptions>
      | ((prevState: CheckboxOptions) => Partial<CheckboxOptions>)
  ) => void;
};

export const useStoreMark = create<StoreMarkState>((set) => ({
  action: null,
  checkboxOptions: {
    itemDimensions: false,
    itemCompositions: false,
    itemSpecifications: false,
    itemImages: false,
    itemLocations: false,
  },
  setAction: (action) => set({ action: action }),
  setCheckboxOptions: (options) =>
    set((state) => ({
      checkboxOptions: { ...state.checkboxOptions, ...options },
    })),
}));
