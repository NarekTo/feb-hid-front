"use client";

import { useParams, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import TitleHeader from "../../../../../components/UI_SECTIONS/page/TitleHeader";
import { itemInfoType } from "../../../../../types";

export interface SingleItemProps {
  item: itemInfoType;
}
const SingleItem: FC<SingleItemProps> = ({ item }: SingleItemProps) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("project_name");
  const params = useParams();
  const [itemInfo, setItemInfo] = useState<itemInfoType>(item);
  const {
    projectItems,
    projectSpecifications,
    projectCompositions,
    projectDimensions,
  } = itemInfo;

  useEffect(() => {
    setItemInfo(item);
  }, []);

  return (
    <div className="w-full px-2">
      <TitleHeader
        firstLabel="Project"
        firstValue={name}
        secondLabel="Batch n."
        secondValue={params.batch}
        thirdLabel="Item"
        thirdValue={projectItems.Item_id}
      />

      <div className=" rounded-md flex-col h-full">
        <div className="flex items-center justify-between w-full bg-slate-100 rounded-md p-2 mb-4 ">
          <div className="grid grid-cols-3 gap-2  w-2/3 h-full">
            {itemInfo && projectItems
              ? Object.entries(itemInfo.projectItems).map(([key, value]) => (
                  <div key={key} className="flex px-4">
                    <p className="font-thin">{key}:</p>
                    <p className="font-medium pl-2">{value}</p>
                  </div>
                ))
              : "No info"}
          </div>
          <div className="bg-yellow-200 w-1/3 h-full ">
            <div className=" relative h-full">
              <p>No image</p>
            </div>
          </div>
        </div>

        <div className="flex items-center   h-2/3 p-2">
          <div className="bg-slate-100 h-full w-1/3 p-2 text-center rounded-md mr-2">
            <h3 className="bg-primary-menu text-white py-1 rounded-md">
              Dimensions
            </h3>
            <div className="pt-4">
              {itemInfo && projectDimensions ? (
                Object.entries(itemInfo.projectDimensions).map(
                  ([key, value]) => (
                    <div key={key} className="flex px-4">
                      <p className="font-thin">{key}:</p>
                      <p className="font-medium pl-2">{value}</p>
                    </div>
                  )
                )
              ) : (
                <p>No dimensions</p>
              )}
            </div>
          </div>
          <div className="bg-slate-100 h-full w-1/3 p-2 text-center rounded-md mr-2">
            <h3 className="bg-primary-menu text-white py-1 rounded-md">
              Compositions
            </h3>
            <div className="pt-4">
              {itemInfo && projectCompositions ? (
                Object.entries(itemInfo.projectCompositions).map(
                  ([key, value]) => (
                    <div key={key} className="flex px-4">
                      <p className="font-thin">{key}:</p>
                      <p className="font-medium pl-2">{value}</p>
                    </div>
                  )
                )
              ) : (
                <p>No compositions</p>
              )}
            </div>
          </div>
          <div className="bg-slate-100 h-full w-1/3 p-2 text-center rounded-md">
            <h3 className="bg-primary-menu text-white py-1 rounded-md">
              Specifications
            </h3>
            <div className="pt-4">
              {itemInfo && projectSpecifications ? (
                Object.entries(itemInfo.projectSpecifications).map(
                  ([key, value]) => (
                    <div key={key} className="flex px-4">
                      <p className="font-thin">{key}:</p>
                      <p className="font-medium pl-2">{value}</p>
                    </div>
                  )
                )
              ) : (
                <p>No specifications</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
/*      <div className="rounded-md flex-col h-full">
        <div className="flex items-center justify-between w-full bg-slate-100 rounded-md p-2 mb-4">
          <div className="grid grid-cols-3 gap-2 w-2/3 h-full">
            {itemInfo &&
              Object.entries(itemInfo[0]).map(([key, value]) => (
                <div key={key} className="flex px-4">
                  <p className="font-thin">{key}:</p>
                  
                </div>
              ))}
          </div>
          <div className="bg-yellow-200 w-1/3 h-full">
            <div className="relative h-full">
             
                <p>No image</p>
             
            </div>
          </div>
        </div>

        <div className="flex items-center h-2/3 p-2">
          <div className="bg-slate-100 h-full w-1/3 p-2 text-center rounded-md mr-2">
            <h3 className="bg-primary-menu text-white py-1 rounded-md">
              Dimensions
            </h3>
            <div className="pt-4">
              {itemInfo && itemInfo[1] ? (
                Object.entries(itemInfo[1]).map(([key, value]) => (
                  <div key={key} className="flex px-4">
                    <p className="font-thin">{key}:</p>
                    <p className="font-medium pl-2">{value}</p>
                  </div>
                ))
              ) : (
                <p>No image</p>
              )}
            </div>
          </div>
          <div className="bg-slate-100 h-full w-1/3 p-2 text-center rounded-md mr-2">
            <h3 className="bg-primary-menu text-white py-1 rounded-md">
              Compositions
            </h3>
            <div className="pt-4">
              {itemInfo && itemInfo[2] ? (
                Object.entries(itemInfo[2]).map(
                  ([key, value]) => (
                    <div key={key} className="flex px-4">
                      <p className="font-thin">{key}:</p>
                      <p className="font-medium pl-2">{value}</p>
                    </div>
                  )
                )
              ) : (
                <p>No image</p>
              )}
            </div>
          </div>
          <div className="bg-slate-100 h-full w-1/3 p-2 text-center rounded-md">
            <h3 className="bg-primary-menu text-white py-1 rounded-md">
              Specifications
            </h3>
            <div className="pt-4">
              {itemInfo && itemInfo[3] ? (
                Object.entries(itemInfo[3]).map(
                  ([key, value]) => (
                    <div key={key} className="flex px-4">
                      <p className="font-thin">{key}:</p>
                      <p className="font-medium pl-2">{value}</p>
                    </div>
                  )
                )
              ) : (
                <p>No image</p>
              )}
            </div>
          </div>
        </div>
      </div>
*/
