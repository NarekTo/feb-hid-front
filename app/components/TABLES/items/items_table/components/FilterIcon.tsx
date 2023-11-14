import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";

const FilterIcon = ({ isFiltering, clearAllFilters }) => {
  return isFiltering ? (
    <MdFilterAlt
      size={16}
      className="cursor-pointer h-8 w-5 "
      onClick={clearAllFilters}
    />
  ) : (
    <MdFilterAltOff size={16} className="cursor-pointer h-8 w-5" />
  );
};

export default FilterIcon;
