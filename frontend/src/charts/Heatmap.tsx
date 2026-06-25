type HeatRow = {
  day: string;
  values: number[];
};

export function Heatmap({ rows }: { rows: HeatRow[] }) {
  const max = Math.max(...rows.flatMap((row) => row.values), 1);

  return (
    <div className="space-y-2" role="img" aria-label="Hourly activity heatmap">
      {rows.map((row) => (
        <div key={row.day} className="grid grid-cols-[3rem_1fr] items-center gap-3">
          <span className="text-xs font-bold uppercase text-slate-500">{row.day}</span>
          <div className="grid grid-cols-24 gap-1">
            {row.values.map((value, index) => {
              const alpha = 0.12 + (value / max) * 0.72;
              return (
                <span
                  key={`${row.day}-${index}`}
                  className="h-4 border border-white/[0.04]"
                  style={{ backgroundColor: `rgba(100, 255, 114, ${alpha})` }}
                  title={`${row.day} ${index}:00 - ${value}`}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
