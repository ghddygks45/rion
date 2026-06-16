import Title from "./Title";

type CardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg overflow-hidden ${className}`}
    >
      {title && (
        <div className="px-4 py-3 border-b border-border">
          <Title level={2}>{title}</Title>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
