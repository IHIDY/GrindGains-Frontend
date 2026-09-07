import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export interface XYChartProps<T extends Record<string, unknown>> {
  data: T[]
  xKey: keyof T & string
  yKey: keyof T & string
  variant: "line" | "area" | "scatter-trend"
  /** Always explicit — never inferred from the page's mode (e.g. "Avg Hold Time" uses isotonic green on a mobeta page). */
  accentColor: string
  xLabel?: string
  yLabel?: string
  valueFormatter?: (y: number) => string
  labelFormatter?: (x: unknown) => string
  /** Sparkline mode: no axes/grid/tooltip, small fixed height. */
  compact?: boolean
  showAxes?: boolean
  showGrid?: boolean
  height?: number
}

/** hex "#2E6B42" + alpha "22" -> "#2E6B4222" (works for our fixed 6-digit palette hexes). */
function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`
}

function ChartTooltip({
  active,
  payload,
  label,
  yKey,
  accentColor,
  valueFormatter,
  labelFormatter,
}: {
  active?: boolean
  payload?: Array<{ payload: Record<string, unknown> }>
  label?: unknown
  yKey: string
  accentColor: string
  valueFormatter?: (y: number) => string
  labelFormatter?: (x: unknown) => string
}) {
  if (!active || !payload?.length) return null
  const y = payload[0].payload[yKey] as number

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs"
      style={{ background: withAlpha(accentColor, "14"), borderColor: withAlpha(accentColor, "55") }}
    >
      <div className="text-muted">{labelFormatter ? labelFormatter(label) : String(label)}</div>
      <div className="font-semibold" style={{ color: accentColor }}>
        {valueFormatter ? valueFormatter(y) : y}
      </div>
    </div>
  )
}

export function XYChart<T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  variant,
  accentColor,
  xLabel,
  yLabel,
  valueFormatter,
  labelFormatter,
  compact = false,
  showAxes = !compact,
  showGrid = !compact,
  height = compact ? 80 : 200,
}: XYChartProps<T>) {
  const lastPoint = data[data.length - 1]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={compact ? { top: 4, right: 4, bottom: 0, left: 4 } : { top: 8, right: 8, bottom: 8, left: 8 }}>
        {showGrid && <CartesianGrid stroke="#C17A4A" strokeOpacity={0.22} vertical={false} />}
        {showAxes && (
          <XAxis
            dataKey={xKey as any}
            tickFormatter={labelFormatter}
            tick={{ fontSize: 11, fill: "#B36A46" }}
            axisLine={{ stroke: "#B36A46" }}
            tickLine={false}
            label={xLabel ? { value: xLabel, position: "insideBottom", offset: -4, fontSize: 12, fill: "#8B4F35" } : undefined}
          />
        )}
        {showAxes && (
          <YAxis
            dataKey={yKey as any}
            tick={{ fontSize: 11, fill: "#B36A46" }}
            axisLine={false}
            tickLine={false}
            width={40}
            label={yLabel ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 12, fill: "#8B4F35" } : undefined}
          />
        )}
        {!compact && (
          <Tooltip
            content={
              <ChartTooltip yKey={yKey} accentColor={accentColor} valueFormatter={valueFormatter} labelFormatter={labelFormatter} />
            }
          />
        )}

        {variant === "area" && (
          <Area
            type="monotone"
            dataKey={yKey as any}
            stroke={accentColor}
            strokeWidth={2}
            fill={withAlpha(accentColor, "1a")}
            dot={false}
            activeDot={{ r: 4, fill: accentColor }}
          />
        )}

        {variant === "line" && (
          <Line
            type="monotone"
            dataKey={yKey as any}
            stroke={accentColor}
            strokeWidth={2}
            dot={{ r: 3, fill: accentColor, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: accentColor }}
          />
        )}

        {variant === "scatter-trend" && (
          <>
            <Scatter dataKey={yKey as any} fill={accentColor} fillOpacity={0.85} />
            <Line type="monotone" dataKey={yKey as any} stroke={accentColor} strokeWidth={2} dot={false} activeDot={false} />
          </>
        )}

        {!compact && lastPoint && variant !== "scatter-trend" && (
          <Scatter data={[lastPoint]} dataKey={yKey as any} shape="circle" fill="#FFFFFF" stroke={accentColor} strokeWidth={2} />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}
