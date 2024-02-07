"use client";

import React, { useState } from "react";
import { Session } from "../../../../types";
import { useSession } from "next-auth/react";
import { updateRow } from "../../../../utils/api";
import EditableInput from "./components/EditableInput";

const SingleItemForm = ({ itemInfo }) => {
  console.log("itemInfo", itemInfo);
  const { data: session } = useSession() as { data: Session | null };
  // Assuming itemInfo.item is the object with the fields you want to edit
  const [values, setValues] = useState(itemInfo.item || {});
  const [editableField, setEditableField] = useState<string | null>(null);

  const handleFocus = (fieldName: string) => {
    setEditableField(fieldName);
  };

  const handleBlur = async (fieldName: string) => {
    if (values[fieldName] !== itemInfo.item[fieldName]) {
      const updated = await updateRow(
        itemInfo.item.Item_id.trim(),
        { [fieldName]: values[fieldName] },
        session
      );
      if (updated) {
        // Update your state or perform any other actions needed after successful update
      }
    }
    setEditableField(null);
  };

  const handleChange = (fieldName: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-2/3 h-full p-2 ">
      <div>
        <EditableInput
          initialValue={values.location_code}
          onSave={(newValue) => handleChange("location_code", newValue)}
          name="location_code"
          label="Location"
        />
        <EditableInput
          initialValue={values.item_ref}
          onSave={(newValue) => handleChange("item_ref", newValue)}
          name="item_ref"
          label="Item Ref"
        />
        <EditableInput
          initialValue={values.design_ref}
          onSave={(newValue) => handleChange("design_ref", newValue)}
          name="design_ref"
          label="Design Ref"
        />
        <EditableInput
          initialValue={values.additional_description}
          onSave={(newValue) =>
            handleChange("additional_description", newValue)
          }
          name="additional_description"
          label="Description"
        />
        <EditableInput
          initialValue={values.supplier_code}
          onSave={(newValue) => handleChange("supplier_code", newValue)}
          name="supplier_code"
          label="Supplier"
        />
        <EditableInput
          initialValue={values.manufacturer_code}
          onSave={(newValue) => handleChange("manufacturer_code", newValue)}
          name="manufacturer_code"
          label="Manufacturer"
        />
        <EditableInput
          initialValue={values.part_number}
          onSave={(newValue) => handleChange("part_number", newValue)}
          name="part_number"
          label="Part Number"
        />
        <div className="flex items-center justify-between">
          <p className="font-thin w-1/3 text-sm pr-1">
            Drawing Revision: {values.drawing_revision}
          </p>
          <p className="font-thin w-1/3 text-sm pr-1">
            Drawing Issue: {values.drawing_issue}
          </p>
        </div>
      </div>
      <div>
        <EditableInput
          initialValue={values.quantity}
          onSave={(newValue) => handleChange("quantity", newValue)}
          name="quantity"
          label="Quantity"
        />
        <EditableInput
          initialValue={values.spares}
          onSave={(newValue) => handleChange("spares", newValue)}
          name="spares"
          label="Spares"
        />
        <div className="flex items-center justify-between">
          <p className="font-thin w-1/3 text-sm pr-1">
            Order Qty: {values.quantity}
          </p>
          <p className="font-thin w-1/3 text-sm pr-1">Uom: {values.uom_code}</p>
        </div>
      </div>
      <div>
        <EditableInput
          initialValue={values.Item_id}
          onSave={(newValue) => handleChange("Item_id", newValue)}
          name="Item_id"
          label="Item id"
        />
        <div className=" flex font-thin text-sm items-center pb-2 ">
          <p className="w-1/3">Status </p>
          <p className="w-2/3 font-semibold">{values.item_status}</p>
        </div>

        <EditableInput
          initialValue={values.group_number}
          onSave={(newValue) => handleChange("group_number", newValue)}
          name="group_number"
          label="Group N."
        />

        <EditableInput
          initialValue={values.group_sequence}
          onSave={(newValue) => handleChange("group_sequence", newValue)}
          name="group_sequence"
          label="Group Seq."
        />
        <EditableInput
          initialValue={values.package_code}
          onSave={(newValue) => handleChange("package_code", newValue)}
          name="package_code"
          label="Package"
        />
        <EditableInput
          initialValue={values.origin_code}
          onSave={(newValue) => handleChange("origin_code", newValue)}
          name="origin_code"
          label="Origin"
        />
        <EditableInput
          initialValue={values.del_address}
          onSave={(newValue) => handleChange("del_address", newValue)}
          name="del_address"
          label="Delivery Add."
        />
        <EditableInput
          initialValue={values.supplier_address}
          onSave={(newValue) => handleChange("supplier_address", newValue)}
          name="supplier_address"
          label="Supplier Add."
        />
        <div className="flex items-center justify-between">
          <p className="font-thin w-1/3 text-sm pr-1">
            Order Ref: {values.oder_ref}
          </p>
          <p className="font-thin w-1/3 text-sm pr-1">
            Order N.: {values.order_number}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleItemForm;
