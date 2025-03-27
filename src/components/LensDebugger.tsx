
import React from 'react';
import { useInventoryStore } from '@/store/inventoryStore';

export const LensDebugger = () => {
  const { 
    lensCoatings, 
    lensThicknesses, 
    getLensCoatingsByCategory, 
    getLensThicknessesByCategory 
  } = useInventoryStore();
  
  const distanceReadingCoatings = getLensCoatingsByCategory("distance-reading");
  const progressiveCoatings = getLensCoatingsByCategory("progressive");
  const bifocalCoatings = getLensCoatingsByCategory("bifocal");
  
  const distanceReadingThicknesses = getLensThicknessesByCategory("distance-reading");
  const progressiveThicknesses = getLensThicknessesByCategory("progressive");
  const bifocalThicknesses = getLensThicknessesByCategory("bifocal");
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Lens Data Debugger</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Lens Coatings</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Distance/Reading ({distanceReadingCoatings.length})</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distanceReadingCoatings.map(coating => (
                      <tr key={coating.id} className="hover:bg-gray-100">
                        <td className="p-2 border">{coating.id}</td>
                        <td className="p-2 border">{coating.name}</td>
                        <td className="p-2 border">{coating.price}</td>
                        <td className="p-2 border">{coating.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Progressive ({progressiveCoatings.length})</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressiveCoatings.map(coating => (
                      <tr key={coating.id} className="hover:bg-gray-100">
                        <td className="p-2 border">{coating.id}</td>
                        <td className="p-2 border">{coating.name}</td>
                        <td className="p-2 border">{coating.price}</td>
                        <td className="p-2 border">{coating.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Bifocal ({bifocalCoatings.length})</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bifocalCoatings.map(coating => (
                      <tr key={coating.id} className="hover:bg-gray-100">
                        <td className="p-2 border">{coating.id}</td>
                        <td className="p-2 border">{coating.name}</td>
                        <td className="p-2 border">{coating.price}</td>
                        <td className="p-2 border">{coating.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Lens Thicknesses</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Distance/Reading ({distanceReadingThicknesses.length})</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distanceReadingThicknesses.map(thickness => (
                      <tr key={thickness.id} className="hover:bg-gray-100">
                        <td className="p-2 border">{thickness.id}</td>
                        <td className="p-2 border">{thickness.name}</td>
                        <td className="p-2 border">{thickness.price}</td>
                        <td className="p-2 border">{thickness.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Progressive ({progressiveThicknesses.length})</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressiveThicknesses.map(thickness => (
                      <tr key={thickness.id} className="hover:bg-gray-100">
                        <td className="p-2 border">{thickness.id}</td>
                        <td className="p-2 border">{thickness.name}</td>
                        <td className="p-2 border">{thickness.price}</td>
                        <td className="p-2 border">{thickness.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Bifocal ({bifocalThicknesses.length})</h3>
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">ID</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Price</th>
                      <th className="p-2 border">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bifocalThicknesses.map(thickness => (
                      <tr key={thickness.id} className="hover:bg-gray-100">
                        <td className="p-2 border">{thickness.id}</td>
                        <td className="p-2 border">{thickness.name}</td>
                        <td className="p-2 border">{thickness.price}</td>
                        <td className="p-2 border">{thickness.description || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded">Back to Home</a>
        </div>
      </div>
    </div>
  );
};
