interface SizeSelectorProps {
  tallas: string[];
  selected: string;
  onChange: (talla: string) => void;
}

export default function SizeSelector({
  tallas,
  selected,
  onChange,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tallas.map((talla) => (
        <button
          key={talla}
          onClick={() => onChange(talla)}
          className={`min-w-[38px] h-9 px-2.5 text-xs font-medium border rounded-sm transition-colors duration-200 ${
            selected === talla
              ? "border-accent bg-accent/10 text-accent"
              : "border-border text-text-secondary hover:border-text-secondary"
          }`}
        >
          {talla}
        </button>
      ))}
    </div>
  );
}
