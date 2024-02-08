import React, { useEffect, useState } from "react";
import MainButton from "../../../../UI_ATOMS/MainButton";

interface EvaluateCostsData {
  currency: string;
  itemsCount: number;
  budget: number;
  actual: number;
  clientOffer: number;
  variance: number;
}

interface EvaluateCostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EvaluateCostsData;
}

interface EvaluateCostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EvaluateCostsData;
}

const EvaluateCostsModal: React.FC<EvaluateCostsModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { currency, itemsCount, budget, actual, clientOffer, variance } = data;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Evaluate Costs</h3>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span>Currency:</span>
              <span>{currency}</span>
            </div>
            <div className="flex justify-between items-center my-2">
              <span>No. Items:</span>
              <span>{itemsCount}</span>
            </div>
            <div className="flex justify-between items-center my-2">
              <span>Budget:</span>
              <span>{budget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center my-2">
              <span>Actual:</span>
              <span>{actual.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center my-2">
              <span>Client Offer:</span>
              <span>{clientOffer.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center my-2">
              <span>Variance:</span>
              <span>{variance.toFixed(2)}</span>
            </div>
          </div>
          <MainButton
            title="Close"
            fun={onClose}
            className="mt-4 bg-dark-blue text-white text-base font-medium rounded-md px-4 py-2 shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Close
          </MainButton>
        </div>
      </div>
    </div>
  );
};

export default EvaluateCostsModal;
