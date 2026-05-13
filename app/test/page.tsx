"use client";

import PopularStock from "@/features/shared/popularStock/PopularStock";
// import DomesticMarket from "@/features/shared/domesticMarket/hooks/DomesticMarket";
import TopChangeRateStock from "@/features/shared/topChangeRateStock/TopChangeRateStock";
import TopVolumeStock from "@/features/shared/topVolumeStock/TopVolumeStock";
import TopProgramBuys from "@/features/shared/topProgramBuys/TopProgramBuys";

export default function Test() {
  return (
    <>
      <h1>test Component</h1>
      <TopProgramBuys />
    </>
  );
}
