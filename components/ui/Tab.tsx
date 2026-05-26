import Button from "./Button";

type Tab = {
  key: string;
  label: string;
};

type TabProps = {
  tabs: Tab[];
  activeKey: string;
  onChange?: (key: string) => void;
};

export default function Tab({ tabs, onChange, activeKey }: TabProps) {
  return (
    <>
      <div className="flex gap-1">
        {tabs.map((tab, index) => (
          <Button
            variant={activeKey === tab.key ? "primary" : "secondary"}
            key={index}
            onClick={() => onChange?.(tab.key)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </>
  );
}
