type Series = {
  label: string;
  color: string;
  values: { label: string; value: number }[];
};

type LineChartProps = {
  series: Series[];
  height?: number;
};

function makePath(values: { label: string; value: number }[], min: number, max: number) {
  const span = Math.max(1, max - min);
  return values
    .map((point, index) => {
      const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
      const y = 38 - ((point.value - min) / span) * 30;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function LineChart({ series, height = 260 }: LineChartProps) {
  const allValues = series.flatMap((item) => item.values.map((value) => value.value));
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues, 1);
  const labels = series[0]?.values ?? [];

  return (
    <div className="chart-shell" style={{ height }}>
      <svg viewBox="0 0 100 44" preserveAspectRatio="none" role="img" aria-label="Activity line chart">
        {[8, 18, 28, 38].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="rgba(148, 163, 184, 0.16)"
            strokeWidth="0.25"
          />
        ))}
        {series.map((item) => (
          <path
            key={item.label}
            d={makePath(item.values, min, max)}
            fill="none"
            stroke={item.color}
            strokeLinecap="square"
            strokeLinejoin="miter"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex flex-wrap gap-3">
          {series.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2">
              <span className="h-2 w-5" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          {labels.slice(0, 4).map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
