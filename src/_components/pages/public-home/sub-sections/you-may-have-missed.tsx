import React from 'react';
import OverlayedNewsImage from '@/_components/public/core/news-component/overlayed-news-image';
import FullWidthAlternateTitle from '@/_components/public/core/section-title/full-width-alternate-title';
import { dummyBasicNewsData } from '@/lib/constants/pre-data';
import DarkerBasicNewsWithTag from '@/_components/public/core/news-component/darker-basic-news-with-tag';

/**
 * This component displays a section titled "You may have missed" with news items.
 * It uses a consistent gap between elements for a uniform layout.
 */
const YouMayHaveMissed = () => {
  return (
    <div className="mt-6 flex flex-col gap-12 pb-60 relative">
      <FullWidthAlternateTitle title="You may have missed" />
      <div className="flex flex-row gap-4">
        <div className="w-1/3 flex justify-between flex-col gap-4">
          <OverlayedNewsImage newsItem={dummyBasicNewsData[0]} />
          <DarkerBasicNewsWithTag newsContent={dummyBasicNewsData[0]} />
        </div>
        <div className="w-1/3 flex flex-col justify-between gap-4">
          <DarkerBasicNewsWithTag newsContent={dummyBasicNewsData[0]} />
          <DarkerBasicNewsWithTag newsContent={dummyBasicNewsData[0]} />
          <DarkerBasicNewsWithTag newsContent={dummyBasicNewsData[0]} />
        </div>
        <div className="w-1/3 flex flex-col justify-between gap-4">
          <DarkerBasicNewsWithTag newsContent={dummyBasicNewsData[0]} />
          <DarkerBasicNewsWithTag newsContent={dummyBasicNewsData[0]} />
          <DarkerBasicNewsWithTag newsContent={dummyBasicNewsData[0]} />
        </div>
      </div>
    </div>
  );
};

export default YouMayHaveMissed;
