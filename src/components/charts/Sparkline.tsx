import { XYChart } from "./XYChart"

export function Sparkline<T extends Record<string, unknown>>({
  data,
  xKey,
  yKey,
  accentColor,
  height = 80,
}: {
  data: T[]
  xKey: keyof T & string
  yKey: keyof T & string
  accentColor: string
  height?: number
}) {
  return <XYChart data={data} xKey={xKey} yKey={yKey} variant="area" accentColor={accentColor} compact height={height} />
}
