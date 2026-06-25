import { useEffect, useState } from "react";
import { BrainCircuit, Clock3, Lock } from "lucide-react";
import { AnalyticsData, AnalyticsRange } from "../../data/mockData";
import { getAnalytics } from "../../lib/api";
import { MockUser } from "../../lib/auth";
import { hasPermission } from "../../lib/permissions";
import { BarChart } from "../../charts/BarChart";
import { Heatmap } from "../../charts/Heatmap";
import { LineChart } from "../../charts/LineChart";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { LoadingBlock } from "../ui/LoadingBlock";
import { Panel } from "../ui/Panel";
import { PixelButton } from "../ui/PixelButton";

const ranges: { id: AnalyticsRange; label: string }[] = [
  { id: "live", label: "Live" },
  { id: "1h", label: "1h" },
  { id: "24h", label: "24h" },
  { id: "30d", label: "30d" },
  { id: "max", label: "Max" },
  { id: "last-week", label: "Last Week" },
];

type AnalyticsPageProps = {
  initialAnalytics: AnalyticsData;
  currentUser: MockUser;
};

export function AnalyticsPage({
  initialAnalytics,
  currentUser,
}: AnalyticsPageProps) {
  const [range, setRange] = useState<AnalyticsRange>(initialAnalytics.range);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [view, setView] = useState<"heatmap" | "days">("heatmap");
  const [isLoading, setIsLoading] = useState(false);
  const hasFullAnalytics = hasPermission(currentUser.role, "analytics.full");

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    getAnalytics(range)
      .then((data) => {
        if (active) {
          setAnalytics(data);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [range]);

  return (
    <div className="grid gap-4">
      <Panel
        title="Playercount Trend"
        eyebrow="Range controls"
        action={
          <div className="flex flex-wrap gap-2">
            {ranges.map((item) => (
              <PixelButton
                key={item.id}
                variant={range === item.id ? "primary" : "ghost"}
                onClick={() => setRange(item.id)}
              >
                {item.label}
              </PixelButton>
            ))}
          </div>
        }
      >
        {isLoading ? (
          <LoadingBlock className="h-[316px]" />
        ) : (
          <LineChart
            height={320}
            series={[
              {
                label: "Minecraft players",
                color: "#64ff72",
                values: analytics.playerCount.map((point) => ({
                  label: point.label,
                  value: point.minecraftPlayers,
                })),
              },
              {
                label: "Discord online",
                color: "#7a9cff",
                values: analytics.playerCount.map((point) => ({
                  label: point.label,
                  value: point.discordOnline,
                })),
              },
            ]}
          />
        )}
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[1fr_20rem]">
        <Panel
          title={view === "heatmap" ? "Hourly Heatmap" : "Days Breakdown"}
          eyebrow="Activity shape"
          action={
            <div className="flex gap-2">
              <PixelButton
                variant={view === "heatmap" ? "secondary" : "ghost"}
                onClick={() => setView("heatmap")}
              >
                Heatmap
              </PixelButton>
              <PixelButton
                variant={view === "days" ? "secondary" : "ghost"}
                onClick={() => setView("days")}
              >
                Days
              </PixelButton>
            </div>
          }
        >
          {hasFullAnalytics ? (
            view === "heatmap" ? (
              <Heatmap rows={analytics.hourlyHeatmap} />
            ) : (
              <BarChart data={analytics.dayBars} />
            )
          ) : (
            <EmptyState
              icon={<Lock size={28} />}
              title="Summary only"
              message="Staff roles can view the top-line trend. Full heatmaps and day bars unlock at admin+."
            />
          )}
        </Panel>

        <Panel title="Insights" eyebrow="Mock analysis">
          <div className="space-y-3">
            {analytics.insights.map((insight) => (
              <div key={insight} className="mini-panel">
                <div className="flex items-center gap-2 text-arena">
                  <BrainCircuit size={16} />
                  <span className="text-xs font-black uppercase">Signal</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{insight}</p>
              </div>
            ))}
            <div className="mini-panel">
              <div className="mb-2 flex items-center gap-2 text-discord">
                <Clock3 size={16} />
                <span className="text-xs font-black uppercase">Range</span>
              </div>
              <Badge tone={hasFullAnalytics ? "green" : "orange"}>
                {hasFullAnalytics ? "Full analytics" : "Summary analytics"}
              </Badge>
              <p className="mt-3 text-xs text-slate-400">
                Mock data is returned through `getAnalytics(range)` so real fetch
                calls can replace it later.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
