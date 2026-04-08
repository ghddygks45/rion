import Title from "@/components/ui/Title";
import Tag from "@/components/ui/Tag";
import { Signal } from "../types";

type Props = {
  signals: Signal[];
  className?: string;
};

export default function SignalSection({ signals, className }: Props) {
  if (signals.length === 0) return null;

  return (
    <div className={className}>
      <Title level={2}>주요 시그널</Title>
      <div className="flex flex-wrap gap-2 mt-4">
        {signals.map((signal) => (
          <Tag key={signal}>{signal}</Tag>
        ))}
      </div>
    </div>
  );
}
