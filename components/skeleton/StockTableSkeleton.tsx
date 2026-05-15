type StockTableSkeletonProps = { rows?: number };

export default function StockTableSkeleton({
  rows = 3,
}: StockTableSkeletonProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div>
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="text-left">
              <th className="py-3 pl-4 w-[40%]">
                <div className="h-3 bg-border rounded w-3/4 animate-pulse" />
              </th>
              <th className="py-3 w-[22%]">
                <div className="h-3 bg-border rounded w-full animate-pulse" />
              </th>
              <th className="py-3 w-[18%]">
                <div className="h-3 bg-border rounded w-full animate-pulse" />
              </th>
              <th className="py-3 pr-4 w-[20%]">
                <div className="h-3 bg-border rounded w-full animate-pulse" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-3 pl-4">
                  <div className="h-4 bg-border rounded w-3/4 animate-pulse" />
                </td>
                <td className="py-3">
                  <div className="h-4 bg-border rounded w-full animate-pulse" />
                </td>
                <td className="py-3">
                  <div className="h-5 bg-border rounded-full w-full animate-pulse" />
                </td>
                <td className="py-3 pr-4">
                  <div className="h-4 bg-border rounded w-full animate-pulse" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
