// import DarkerBasicNewsWithTag from "@/_components/public/core/news-component/darker-basic-news-with-tag"
// import OverlayedNewsImage from "@/_components/public/core/news-component/overlayed-news-image"
import FullWidthAlternateTitle from "@/_components/public/core/section-title/full-width-alternate-title"
// import { dummyBasicNewsData, longCarouselBasicNewsData } from "@/lib/constants/pre-data"

const Sports = () => {
//   const newsData = longCarouselBasicNewsData ?? []

  return (
    <div className="relative px-8 py-5 flex flex-col gap-8">
      <FullWidthAlternateTitle title="Sports" />

      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <OverlayedNewsImage newsItem={dummyBasicNewsData[0]} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:col-span-1">
          {newsData.slice(0, 2).map((item, index) => (
            <div className="w-full" key={index}>
              <DarkerBasicNewsWithTag newsContent={item} />
            </div>
          ))}
        </div>

        <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mt-0">
          {newsData.slice(2).map((item, index) => (
            <div className="w-full" key={index + 2}>
              <DarkerBasicNewsWithTag newsContent={item} />
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default Sports
