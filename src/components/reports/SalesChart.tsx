
import React from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  Sector
} from "recharts";
import { Eye, Frame, Droplets } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

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
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  // State for tracking active index on hover - moved hook before any conditionals
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  // Check if we have any data
  const hasData = lensRevenue > 0 || frameRevenue > 0 || coatingRevenue > 0;
  
  // Ensure all values are at least 0 (not negative)
  const safeValues = {
    lensRevenue: Math.max(0, lensRevenue),
    frameRevenue: Math.max(0, frameRevenue),
    coatingRevenue: Math.max(0, coatingRevenue)
  };
  
  // Create data array, filtering out zero values
  const data = [
    { name: language === 'ar' ? "العدسات" : "Lenses", value: safeValues.lensRevenue, icon: <Eye size={16} /> },
    { name: language === 'ar' ? "الإطارات" : "Frames", value: safeValues.frameRevenue, icon: <Frame size={16} /> },
    { name: language === 'ar' ? "الطلاءات" : "Coatings", value: safeValues.coatingRevenue, icon: <Droplets size={16} /> },
  ].filter(item => item.value > 0);
  
  const COLORS = ["#8B5CF6", "#F97316", "#0EA5E9"];
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
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

  // Active shape for hover effect
  const renderActiveShape = (props: any) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value 
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <text 
          x={cx} 
          y={cy} 
          dy={-15} 
          textAnchor="middle" 
          fill={fill}
          style={{ fontWeight: 'bold', fontSize: '16px' }}
        >
          {payload.name}
        </text>
        <text 
          x={cx} 
          y={cy} 
          dy={15} 
          textAnchor="middle" 
          fill="#333"
          style={{ fontSize: '14px' }}
        >
          {value.toFixed(2)} KWD
        </text>
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  // Log data for debugging - moved outside of the conditional rendering
  console.log("SalesChart data:", data);
  console.log("Has data:", hasData);
  
  // Custom legend rendering with icons
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex justify-center gap-6 mt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1">
            <div style={{ color: entry.color }} className="mr-1">
              {data[index].icon}
            </div>
            <span className="text-sm">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  // Show placeholder if no data or all values are zero
  if (!hasData || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-center text-muted-foreground">
          {language === 'ar' ? "لا توجد بيانات للعرض" : "No data to display"}
        </p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          innerRadius={55}
          fill="#8884d8"
          dataKey="value"
          minAngle={15} // Ensures small segments are still visible
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `${value.toFixed(2)} KWD`}
          isAnimationActive={true}
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
