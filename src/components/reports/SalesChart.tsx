
import React from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";

interface SalesChartProps {
  lensRevenue: number;
  frameRevenue: number;
  coatingRevenue: number;
}

export const SalesChart: React.FC<SalesChartProps> = ({ 
  lensRevenue, 
  frameRevenue, 
  coatingRevenue 
}) => {
  const hasData = lensRevenue > 0 || frameRevenue > 0 || coatingRevenue > 0;
  
  const data = [
    { name: "العدسات", value: lensRevenue },
    { name: "الإطارات", value: frameRevenue },
    { name: "الطلاءات", value: coatingRevenue },
  ].filter(item => item.value > 0);
  
  const COLORS = ["#8B5CF6", "#F97316", "#0EA5E9"];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? "start" : "end"} 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-center text-muted-foreground">
          لا توجد بيانات للعرض
        </p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `${value.toFixed(2)} د.ك`}
        />
        <Legend 
          align="center" 
          verticalAlign="bottom"
          layout="horizontal"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
