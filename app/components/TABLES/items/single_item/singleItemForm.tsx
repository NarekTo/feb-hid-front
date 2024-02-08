"use client";

import React, { useState } from "react";

import EditableInput from "./components/EditableInput";

const SingleItemForm = ({ itemInfo }) => {
  const [values, setValues] = useState(itemInfo.item || {});

  const handleChange = (fieldName: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-2/3 h-full p-2">
      <div>
        <EditableInput
          initialValue={values.location_code}
          onSave={(newValue) => handleChange("location_code", newValue)}
          name="location_code"
          label="Location"
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.item_ref}
          onSave={(newValue) => handleChange("item_ref", newValue)}
          name="item_ref"
          label="Item Ref"
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.design_ref}
          onSave={(newValue) => handleChange("design_ref", newValue)}
          name="design_ref"
          label="Design Ref"
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.additional_description}
          onSave={(newValue) =>
            handleChange("additional_description", newValue)
          }
          name="additional_description"
          label="Description"
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.supplier_code}
          onSave={(newValue) => handleChange("supplier_code", newValue)}
          name="supplier_code"
          label="Supplier"
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.manufacturer_code}
          onSave={(newValue) => handleChange("manufacturer_code", newValue)}
          name="manufacturer_code"
          label="Manufacturer"
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.part_number}
          onSave={(newValue) => handleChange("part_number", newValue)}
          name="part_number"
          label="Part Number"
          Item_id={itemInfo.item.Item_id}
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
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.spares}
          onSave={(newValue) => handleChange("spares", newValue)}
          name="spares"
          label="Spares"
          Item_id={itemInfo.item.Item_id}
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
          Item_id={itemInfo.item.Item_id}
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
          Item_id={itemInfo.item.Item_id}
        />

        <EditableInput
          initialValue={values.group_sequence}
          onSave={(newValue) => handleChange("group_sequence", newValue)}
          name="group_sequence"
          label="Group Seq."
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.package_code}
          onSave={(newValue) => handleChange("package_code", newValue)}
          name="package_code"
          label="Package"
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.origin_code}
          onSave={(newValue) => handleChange("origin_code", newValue)}
          name="origin_code"
          label="Origin"
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.del_address}
          onSave={(newValue) => handleChange("del_address", newValue)}
          name="del_address"
          label="Delivery Add."
          Item_id={itemInfo.item.Item_id}
        />
        <EditableInput
          initialValue={values.supplier_address}
          onSave={(newValue) => handleChange("supplier_address", newValue)}
          name="supplier_address"
          label="Supplier Add."
          Item_id={itemInfo.item.Item_id}
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
