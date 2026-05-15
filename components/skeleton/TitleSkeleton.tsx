type TitleSkeletonProps = { level?: 1 | 2 | 3 };

const styles = {
  1: "h-7",
  2: "w-1/2 h-5",
  3: "w-2/5 h-4",
};

export default function TitleSkeleton({ level = 2 }: TitleSkeletonProps) {
  return <div className={`${styles[level]} bg-border rounded animate-pulse`} />;
}
