import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Session } from "../../../../../types";
import { updateRow } from "../../../../../utils/api";

interface EditableInputProps {
  initialValue: string;
  onSave: (value: string) => void; // Function to call when saving the new value
  name: string; // Identifier for the input, useful for onSave
  label: string; // Label for the input
  Item_id: string;
}

const EditableInput: React.FC<EditableInputProps> = ({
  initialValue,
  onSave,
  name,
  label,
  Item_id,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);
  const { data: session } = useSession() as { data: Session | null };

  const handleBlur = async () => {
    if (value !== initialValue) {
      const updated = await updateRow(
        Item_id.trim(),
        { [name]: value },
        session
      );
      if (updated) {
        // Update your state or perform any other actions needed after successful update
      }
    }
    setIsEditable(null);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <div className="flex items-center justify-between pb-2 w-full">
      <label className="font-thin w-1/3 text-sm pr-1">{label}</label>
      <input
        className=" w-2/3 h-6 border-2 pl-1 border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        type="text"
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => handleBlur()}
        onFocus={() => setIsEditable(true)}
        readOnly={!isEditable}
      />
    </div>
  );
};

export default EditableInput;
