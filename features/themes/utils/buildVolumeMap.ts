type volumeStock = {
  stockCode: string;
  volume: number;
};

type buildVolumeMapProps = {
  uniqueStockCodes: string[];
  volumeData: (volumeStock | "실패" | undefined)[];
};

export function buildVolumeMap({
  uniqueStockCodes,
  volumeData,
}: buildVolumeMapProps) {
  return new Map(uniqueStockCodes.map((code, i) => [code, volumeData[i]]));
}
