"use client";

import { useParams, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import TitleHeader from "../../../../../components/UI_SECTIONS/page/TitleHeader";
import { itemInfoType } from "../../../../../types";
import { fetchImage } from "../../../../../utils/api";
import ItemPanelSpecsTable from "../../../../../components/TABLES/items/single_item/components/ItemPanelSpecsTable";
import SingleItemForm from "../../../../../components/TABLES/items/single_item/singleItemForm";

export interface SingleItemProps {
  itemDetail: itemInfoType;
}
const SingleItem: FC<SingleItemProps> = ({ itemDetail }: SingleItemProps) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("project_name");
  const params = useParams();
  const [itemInfo, setItemInfo] = useState(itemDetail);
  const { item, itemSpecifications, itemCompositions, itemDimensions } =
    itemInfo;

  useEffect(() => {
    setItemInfo(itemDetail);
  }, []);

  const [mainImage, setMainImage] = useState("");
  const [carouselImages, setCarouselImages] = useState([]);

  useEffect(() => {
    // Fetch the main image
    fetchImage(itemDetail.item.Item_id, 1).then((image) =>
      setMainImage(image.toString())
    );

    // Fetch the carousel images
    const carouselPromises = [];
    carouselPromises.push(fetchImage(itemDetail.item.Item_id, 2));
    for (let i = 2; i <= 4; i++) {
      carouselPromises.push(fetchImage(itemDetail.item.Item_id, i));
    }
    console.log("carouselPromises", carouselPromises);

    Promise.all(carouselPromises).then(setCarouselImages);
  }, [itemDetail.item.Item_id]);

  const getReadableSpecCode = (code) => {
    switch (code) {
      case "AH":
        return "HT - Height";
      case "DP":
        return "DP - Depth";
      // Add other cases as needed
      default:
        return code;
    }
  };
  const renderDimensionRow = (dimension, index) => (
    <tr key={index}>
      <td className="px-4 py-2 text-left">
        {getReadableSpecCode(dimension.spec_code)}
      </td>
      <td className="px-4 py-2 text-left">{dimension.uom_code}</td>
      <td className="px-4 py-2 text-left">{dimension.value}</td>
    </tr>
  );
  const renderCompositionRow = (composition, index) => (
    <tr key={index}>
      <td className="px-4 py-2 text-left">{composition.material_code}</td>
      <td className="px-4 py-2 text-left">{composition.percentage}%</td>
    </tr>
  );
  const renderSpecificationRow = (specification, index) => (
    <tr key={index}>
      <td className="px-4 py-2 text-left">{specification.sequence}</td>
      <td className="px-4 py-2 text-left">{specification.finish_code}</td>
      <td className="px-4 py-2 text-left">{specification.notes}</td>
    </tr>
  );

  return (
    <div className="w-full px-2 h-screen flex flex-col">
      <TitleHeader
        firstLabel="Project"
        firstValue={name}
        secondLabel="Batch n."
        secondValue={params.batch}
        thirdLabel="Item"
        thirdValue={item.Item_id}
      />

      <div className=" flex rounded-md flex-col h-full flex-grow">
        <div className="flex items-center justify-between w-full bg-slate-100 rounded-md p-2 mb-4 h-full">
          {itemInfo && itemInfo.item ? (
            <SingleItemForm itemInfo={itemInfo} />
          ) : (
            "No info"
          )}

          <div className=" w-1/3 flex justify-center items-start h-full ">
            <div className="flex flex-col">
              <div className="pt-2 pr-2">
                <img src={mainImage} alt="Main Image" className="rounded-md" />
              </div>
              <div className="flex justify-center pt-2 pr-2 gap-2 flex-wrap">
                {carouselImages.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    alt={`Image ${index + 1}`}
                    className="w-20 h-20 rounded-md flex-grow"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-center  flex-grow">
          <div className="bg-slate-100 h-full flex-grow p-2 text-center rounded-md mr-2 ">
            <h3 className="bg-slate-200 text-darkblue p-1 rounded-md font-semibold text-lg ">
              Dimensions
            </h3>
            <div className="pt-4">
              {itemInfo && itemDimensions ? (
                <ItemPanelSpecsTable
                  headers={["Dimensions", "UoM", "Value"]}
                  data={
                    itemInfo && itemInfo.itemDimensions
                      ? itemInfo.itemDimensions
                      : []
                  }
                  renderRow={renderDimensionRow}
                />
              ) : (
                <p>No dimensions</p>
              )}
            </div>
          </div>
          <div className="bg-slate-100 h-full flex-grow p-2 text-center rounded-md mr-2">
            <h3 className="bg-slate-200 text-darkblue p-1 rounded-md font-semibold text-lg ">
              Compositions
            </h3>
            <div className="pt-4">
              {itemInfo && itemCompositions ? (
                <ItemPanelSpecsTable
                  headers={["Composition", "Value %"]}
                  data={
                    itemInfo && itemInfo.itemCompositions
                      ? itemInfo.itemCompositions
                      : []
                  }
                  renderRow={renderCompositionRow}
                />
              ) : (
                <p>No compositions</p>
              )}
            </div>
          </div>
          <div className="bg-slate-100 h-full flex-grow p-2 text-center rounded-md">
            <h3 className="bg-slate-200 text-darkblue p-1 rounded-md font-semibold text-lg ">
              Specifications
            </h3>
            <div className="pt-4">
              {itemInfo && itemSpecifications ? (
                <ItemPanelSpecsTable
                  headers={["Seq.", "Finish Code", "Notes"]}
                  data={
                    itemInfo && itemInfo.itemSpecifications
                      ? itemInfo.itemSpecifications
                      : []
                  }
                  renderRow={renderSpecificationRow}
                />
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

/*             thirdValue={projectItems.Item_id}

*/
