import React from "react";
import Svg, { Path, Circle, Line } from "react-native-svg";

// Define data point type for charts
export type DataPoint = {
  x: string;
  y: number;
};

// Custom chart component for data visualization
export const SimpleLineChart = ({
  data,
  width,
  height,
  strokeColor = "#4CAF50",
  fillColor = "#4CAF5020",
  showDots = true,
}: {
  data: DataPoint[];
  width: number;
  height: number;
  strokeColor?: string;
  fillColor?: string;
  showDots?: boolean;
}) => {
  // Get min/max values for scaling
  const maxY = Math.max(...data.map((d: DataPoint) => d.y)) + 2;
  const minY = Math.min(...data.map((d: DataPoint) => d.y)) - 2;
  const yRange = maxY - minY;

  // Calculate points
  const points = data.map((point: DataPoint, i: number) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((point.y - minY) / yRange) * height;
    return { x, y };
  });

  // Create SVG path
  const pathData = points.reduce(
    (path: string, point: { x: number; y: number }, i: number) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${path} L ${point.x} ${point.y}`;
    },
    ""
  );

  return (
    <Svg width={width} height={height}>
      {/* Draw the line */}
      <Path d={pathData} stroke={strokeColor} strokeWidth={3} fill="none" />

      {/* Draw dots at data points if requested */}
      {showDots &&
        points.map((point: { x: number; y: number }, i: number) => (
          <Circle key={i} cx={point.x} cy={point.y} r={5} fill={strokeColor} />
        ))}

      {/* Draw horizontal reference lines */}
      {[0.25, 0.5, 0.75].map((position, i) => (
        <Line
          key={i}
          x1={0}
          y1={height * position}
          x2={width}
          y2={height * position}
          stroke="#333"
          strokeWidth={1}
          strokeDasharray="5, 5"
        />
      ))}
    </Svg>
  );
};
