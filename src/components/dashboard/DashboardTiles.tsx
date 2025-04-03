
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardTiles } from "@/pages/dashboardTiles";
import { useLanguageStore } from "@/store/languageStore";

export const DashboardTiles = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';
  const { primaryTiles, secondaryTiles, specialTiles } = getDashboardTiles(onNavigate);

  // Render a configured tile (not a React component)
  const renderTile = (tile: any) => (
    <Card 
      key={tile.title} 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={tile.onClick}
    >
      <CardContent className={`p-5 flex ${isRtl ? 'flex-row-reverse' : 'flex-row'} gap-4 items-center`}>
        <div className={`${tile.bgColor} rounded-full p-3`}>
          <tile.icon className={`h-6 w-6 ${tile.iconColor}`} />
        </div>
        <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
          <h3 className="font-semibold text-base">{tile.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {tile.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Primary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {primaryTiles.map(renderTile)}
      </div>

      {/* Secondary Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secondaryTiles.map(renderTile)}
      </div>

      {/* Special Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specialTiles.map((tile, index) => 
          React.isValidElement(tile) ? tile : renderTile(tile)
        )}
      </div>
    </div>
  );
};
