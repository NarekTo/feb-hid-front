import { useEffect, useState } from "react";
import { useOptionStore, useStoreMark } from "../../../../../store/store";
import { is } from "date-fns/locale";

interface ModalProps {
  isOpen: boolean;
  setModal: (isOpen: boolean) => void;
  setMarked: (marked: boolean) => void;
}

const MarkModal: React.FC<ModalProps> = ({ isOpen, setModal, setMarked }) => {
  const selectedRow = useOptionStore((state) => state.selectedRow); // row selected by click
  const [openText, setOpenText] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);
  const { setAction, setCheckboxOptions, checkboxOptions } = useStoreMark();
  const [error, setError] = useState(null);
  const [localCheckboxOptions, setLocalCheckboxOptions] =
    useState(checkboxOptions);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setLocalCheckboxOptions((prev) => {
      const newState = { ...prev, [name]: checked };
      console.log(newState);
      return newState;
    });
  };
  const handleUpdate = () => {
    lastClicked === null && setError("action: Merge or Overwrite");
    const isAnyOptionSelected = Object.values(localCheckboxOptions).some(
      (value) => value === true
    );
    isAnyOptionSelected === false && setError("option");
    isAnyOptionSelected === false &&
      lastClicked == null &&
      setError("option and action");

    const isActionSelected =
      lastClicked === "merge" || lastClicked === "overwrite";
    const canUpdate = isAnyOptionSelected && isActionSelected;

    if (canUpdate) {
      setAction(lastClicked);
      setCheckboxOptions(localCheckboxOptions);
      setModal(false);
      setLastClicked(null);
      setError(null);
      setOpenText(false);
    }
  };

  const cancel = () => {
    setModal(false);
    setMarked(null);
  };
  useEffect(() => {
    if (isOpen) {
      // Reset localCheckboxOptions when the modal opens
      setLocalCheckboxOptions({
        itemDimensions: false,
        itemCompositions: false,
        itemSpecifications: false,
        itemImages: false,
        itemLocations: false,
      });
    }
    // Optionally, you can also reset other states like error or lastClicked here
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      id="my-modal"
    >
      <div className="relative top-20 mx-auto py-5 border w-96 shadow-lg rounded-md bg-white ">
        <div className="mt-3 text-center w-full ">
          <h3 className="text-lg font-medium text-gray-900">Mark & Paste</h3>
          <div className="mt-2 px-5 pb-3 w-full">
            <p className="text-sm text-gray-500">
              What would you like to Copy?
            </p>
            <div className="flex justify-between my-4 w-full">
              <button
                onClick={() => setLastClicked("merge")}
                className={`border rounded px-3 py-1 text-sm ${
                  lastClicked === "merge" ? "bg-dark-blue text-white" : ""
                }`}
              >
                Merge
              </button>
              <button
                onClick={() => setLastClicked("overwrite")}
                className={`border rounded px-3 py-1 text-sm ${
                  lastClicked === "overwrite" ? "bg-dark-blue text-white" : ""
                }`}
              >
                Overwrite
              </button>
              <div className="tooltip">
                <button
                  onClick={() => setOpenText(!openText)}
                  className={`border rounded px-3 py-1 text-sm ${
                    openText ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  Info
                </button>
              </div>
            </div>
            {openText && (
              <p className="w-full text-xs text-left pb-3 ">
                <b>Merge</b>: appends to the end of any existing details for the
                sections ticked (selected)
                <br />
                <b>Overwrite</b>: will delete any existing information and paste
                for the sections ticked (selected)
              </p>
            )}
            <div className="flex flex-col items-start w-full">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="itemDimensions"
                  className="form-checkbox h-5 w-5 text-gray-600"
                  onChange={handleCheckboxChange}
                  checked={localCheckboxOptions.itemDimensions}
                />
                <span className="ml-2 text-gray-700">Item Dimensions</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="itemCompositions"
                  className="form-checkbox h-5 w-5 text-gray-600"
                  onChange={handleCheckboxChange}
                  checked={localCheckboxOptions.itemCompositions}
                />
                <span className="ml-2 text-gray-700">Item Compositions</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="itemSpecifications"
                  className="form-checkbox h-5 w-5 text-gray-600"
                  onChange={handleCheckboxChange}
                  checked={localCheckboxOptions.itemSpecifications}
                />
                <span className="ml-2 text-gray-700">Item Specifications</span>
              </label>
              <label className="inline-flex items-center w-full">
                <input
                  type="checkbox"
                  name="itemImages"
                  className="form-checkbox h-5 w-5 text-gray-600"
                  onChange={handleCheckboxChange}
                  checked={localCheckboxOptions.itemImages}
                />
                <div className="flex items-center justify-between w-full ">
                  <span className="ml-2 text-gray-700">Item Images</span>
                  <p className="text-xs italic text-gray-500 mt-1">
                    (Only for Overwrite)
                  </p>
                </div>
              </label>
              <label
                className={`inline-flex items-center w-full ${
                  selectedRow && selectedRow.item_status !== "IDX"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  name="itemLocations"
                  className="form-checkbox h-5 w-5 text-gray-600"
                  disabled={selectedRow && selectedRow.item_status !== "IDX"}
                  checked={localCheckboxOptions.itemLocations}
                />
                <div className="flex items-center justify-between w-full ">
                  <span className="ml-2 text-gray-700">Item Locations</span>
                  <p className="text-xs italic text-gray-500">
                    (Only for Indexed projects)
                  </p>
                </div>
              </label>
            </div>
            <div className="items-center px-4 py-3 flex gap-4">
              <button
                onClick={() => cancel()}
                className="px-4 py-2 bg-dark-blue text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-dark-blue text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Update
              </button>
            </div>
            {error && <p className="text-xs"> You have to select an {error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkModal;
