import React, { FC } from 'react';

interface TitleHeaderProps {
  firstLabel: string;
  firstValue: string;
  secondLabel?: string;
  secondValue?: string;
  thirdLabel?: string;
  thirdValue?: string;
}

const TitleHeader: FC<TitleHeaderProps> = ({ firstLabel, firstValue, secondLabel, secondValue, thirdLabel, thirdValue }) => {
  return (
    <h1 className="font-bold text-2xl text-primary-button p-2 flex">
      {firstLabel} {firstValue}
      {secondValue && (
        <p className="pl-2 font-normal flex">
          / {secondLabel} {secondValue}
          {thirdValue && (
            <span className="font-normal text-primary-button flex pl-2">
              / {thirdLabel} {thirdValue}
            </span>
          )}
        </p>
      )}
    </h1>
  )
}

export default TitleHeader;