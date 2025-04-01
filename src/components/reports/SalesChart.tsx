
import React, { useEffect, useState } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from "recharts";
import { Eye, Frame, Droplets } from "lucide-react";

interface SalesChartProps {
  lensRevenue: number;
  frameRevenue: number;
  coatingRevenue: number;
}

export const SalesChart: React.FC<SalesChartProps> = ({ 
  lensRevenue = 0, 
  frameRevenue = 0, 
  coatingRevenue = 0 
}) => {
  // Check if we have any data
  const hasData = (lensRevenue || 0) > 0 || (frameRevenue || 0) > 0 || (coatingRevenue || 0) > 0;
  
  // Ensure all values are at least 0 (not negative) and handle undefined
  const safeValues = {
    lensRevenue: Math.max(0, lensRevenue || 0),
    frameRevenue: Math.max(0, frameRevenue || 0),
    coatingRevenue: Math.max(0, coatingRevenue || 0)
  };
  
  // Create data array, filtering out zero values
  const data = [
    { name: "العدسات", value: safeValues.lensRevenue, icon: <Eye size={16} /> },
    { name: "الإطارات", value: safeValues.frameRevenue, icon: <Frame size={16} /> },
    { name: "الطلاءات", value: safeValues.coatingRevenue, icon: <Droplets size={16} /> },
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
    if (typeof cx !== 'number' || typeof cy !== 'number' || 
        typeof innerRadius !== 'number' || typeof outerRadius !== 'number' || 
        typeof percent !== 'number') {
      return null;
    }
    
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
  
  // Show placeholder if no data or all values are zero
  if (!hasData || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-center text-muted-foreground">
          لا توجد بيانات للعرض
        </p>
      </div>
    );
  }
  
  // Custom legend rendering with icons
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    
    if (!payload || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }
    
    return (
      <ul className="flex justify-center gap-6 mt-2">
        {payload.map((entry: any, index: number) => {
          // Safeguard against invalid data
          if (!entry || index >= data.length || !data[index]) return null;
          
          return (
            <li key={`item-${index}`} className="flex items-center gap-1">
              <div style={{ color: entry.color }} className="mr-1">
                {data[index].icon}
              </div>
              <span className="text-sm">{entry.value}</span>
            </li>
          );
        })}
      </ul>
    );
  };
  
  // Add a useEffect to log data - for debugging
  useEffect(() => {
    console.log("SalesChart data:", data);
    console.log("Has data:", hasData);
  }, [data, hasData]);
  
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
          minAngle={15} // Ensures small segments are still visible
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `${value.toFixed(2)} KWD`}
        />
        <Legend 
          content={renderCustomLegend}
          align="center" 
          verticalAlign="bottom"
          layout="horizontal"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
