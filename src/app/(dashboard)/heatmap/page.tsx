import { MarketHeatmap } from "@/components/heatmap/market-heatmap";
import { PageHeader } from "@/components/layout/page-header";

export default function HeatmapPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Visualize"
        title="Market Heatmap"
        description="Every open market at a glance — color intensity shows conviction."
      />
      <MarketHeatmap />
    </div>
  );
}