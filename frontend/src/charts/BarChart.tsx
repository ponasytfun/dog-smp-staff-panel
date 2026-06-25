type BarDatum = {
  label: string;
  players: number;
  discord: number;
};

export function BarChart({ data }: { data: BarDatum[] }) {
  const max = Math.max(...data.flatMap((item) => [item.players, item.discord]), 1);

  return (
    <div className="grid h-72 grid-cols-7 items-end gap-3" role="img" aria-label="Daily activity bar chart">
      {data.map((item) => (
        <div key={item.label} className="flex h-full flex-col justify-end gap-2">
          <div className="flex h-full items-end gap-1">
            <div
              className="w-full border border-minecraft/30 bg-minecraft/35"
              style={{ height: `${Math.max(8, (item.players / max) * 100)}%` }}
              title={`${item.players} Minecraft players`}
            />
            <div
              className="w-full border border-discord/30 bg-discord/35"
              style={{ height: `${Math.max(8, (item.discord / max) * 100)}%` }}
              title={`${item.discord} Discord online`}
            />
          </div>
          <span className="text-center text-[0.68rem] font-bold uppercase text-slate-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
