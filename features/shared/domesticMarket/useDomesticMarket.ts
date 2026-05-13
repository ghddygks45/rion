import { useQuery } from "@tanstack/react-query";
import { DomesticMarket } from "@/features/shared/type";

export function useDomesticMarket() {
  return useQuery<DomesticMarket>({
    queryKey: ["domesticMarket"],
    queryFn: async () => {
      const res = await fetch("/api/hankuk/domestic-market");
      const data = await res.json();

      return {
        kospi: Number(data.kospi.output.bstp_nmix_prpr),
        kospiChange: Number(data.kospi.output.bstp_nmix_prdy_ctrt),
        kosdaq: Number(data.kosdaq.output.bstp_nmix_prpr),
        kosdaqChange: Number(data.kosdaq.output.bstp_nmix_prdy_ctrt),
      };
    },
  });
}
