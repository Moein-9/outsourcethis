import React, { useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";
import { Eye, Frame, Droplets } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

interface RevenueSalesChartProps {
  lensRevenue: number;
  frameRevenue: number;
  coatingRevenue: number;
  language?: string; // Make language optional in this interface
  data?: never;
  type?: never;
}

interface ComparativeSalesChartProps {
  data: Array<{
    date: string;
    totalSales: number;
    refunds: number;
    netSales: number;
    glasses: number;
    contacts: number;
    exam: number;
  }>;
  type: "line" | "bar" | "pie";
  language: string;
  lensRevenue?: never;
  frameRevenue?: never;
  coatingRevenue?: never;
}

export type SalesChartProps = RevenueSalesChartProps | ComparativeSalesChartProps;

export const SalesChart: React.FC<SalesChartProps> = (props) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  
  if ('data' in props && props.data) {
    return <ComparativeChart {...props} />;
  }
  
  return <RevenueBreakdownChart {...props} language={language} />;
};

const RevenueBreakdownChart: React.FC<RevenueSalesChartProps & { language: string }> = ({ 
  lensRevenue, 
  frameRevenue, 
  coatingRevenue,
  language
}) => {
  const isRtl = language === 'ar';
  
  const hasData = lensRevenue > 0 || frameRevenue > 0 || coatingRevenue > 0;
  
  const safeValues = {
    lensRevenue: Math.max(0, lensRevenue),
    frameRevenue: Math.max(0, frameRevenue),
    coatingRevenue: Math.max(0, coatingRevenue)
  };
  
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

  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex justify-center gap-6 mt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center gap-1">
            <div style={{ color: entry.color }} className="mr-1">
              {data[index]?.icon}
            </div>
            <span className="text-sm">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };
  
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
          minAngle={15}
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

const ComparativeChart: React.FC<ComparativeSalesChartProps> = ({ data, type, language }) => {
  const isRtl = language === 'ar';
  const COLORS = ["#10B981", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899"];
  
  const translations = {
    sales: language === 'ar' ? "المبيعات" : "Sales",
    netSales: language === 'ar' ? "صافي المبيعات" : "Net Sales",
    refunds: language === 'ar' ? "المبالغ المستردة" : "Refunds",
    glasses: language === 'ar' ? "نظارات" : "Glasses",
    contacts: language === 'ar' ? "عدسات لاصقة" : "Contacts",
    exam: language === 'ar' ? "فحص" : "Exam",
    date: language === 'ar' ? "التاريخ" : "Date",
    amount: language === 'ar' ? "المبلغ" : "Amount",
    noData: language === 'ar' ? "لا توجد بيانات للعرض" : "No data to display"
  };
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-center text-muted-foreground">{translations.noData}</p>
      </div>
    );
  }
  
  const pieData = [
    { name: translations.glasses, value: data.reduce((sum, d) => sum + d.glasses, 0) },
    { name: translations.contacts, value: data.reduce((sum, d) => sum + d.contacts, 0) },
    { name: translations.exam, value: data.reduce((sum, d) => sum + d.exam, 0) }
  ].filter(item => item.value > 0);
  
  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)} KWD` : value)} />
          <Legend />
          <Line type="monotone" dataKey="totalSales" name={translations.sales} stroke="#10B981" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="netSales" name={translations.netSales} stroke="#3B82F6" />
          <Line type="monotone" dataKey="refunds" name={translations.refunds} stroke="#EF4444" />
        </LineChart>
      </ResponsiveContainer>
    );
  } 
  
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)} KWD` : value)} />
          <Legend />
          <Bar dataKey="glasses" name={translations.glasses} fill="#8B5CF6" />
          <Bar dataKey="contacts" name={translations.contacts} fill="#F59E0B" />
          <Bar dataKey="exam" name={translations.exam} fill="#EC4899" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={true}
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)} KWD` : value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
