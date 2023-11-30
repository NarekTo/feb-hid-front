import React from "react";
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CustomYAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

const CustomYAxisTick: React.FC<CustomYAxisTickProps> = ({ x, y, payload }) => {
  const { value } = payload;
  return (
    <text x={x} y={y} dy={2} textAnchor="end" fill="#666" fontSize={10}>
      <tspan>{value}</tspan>
    </text>
  );
};

interface Item {
  name: string;
  quantity: number;
}

interface MainChartProps {
  items: Item[];
}

const MainChart: React.FC<MainChartProps> = ({ items }) => {
  return (
    <div className="w-full h-full  items-end ">
      <div
        style={{ width: "98%", height: "98%" }}
        className="flex items-center justify-center"
      >
        <ResponsiveContainer>
          <ComposedChart
            layout="vertical"
            width={500}
            height={300}
            data={items}
            margin={{
              top: 10,
              left: 60,
            }}
          >
            <XAxis type="number" />
            <YAxis
              interval={0}
              tick={(props) => <CustomYAxisTick {...props} />}
              dataKey="name"
              type="category"
              style={{
                fontSize: "10px",
                fontFamily: "Roboto",
                display: "flex",
              }}
            ></YAxis>
            <Tooltip />
            <Bar dataKey="quantity" barSize={10} fill="#4472c4" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MainChart;
