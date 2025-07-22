
// src/pages/SizeGuidePage.tsx
import React from 'react';


const SizeGuidePage: React.FC = () => {
  return (
    <>
      
      <div className="container mx-auto px-4 py-12 text-[#222222] bg-[#F8F8F8] min-h-[70vh]">
        <h1 className="text-4xl font-bold text-center mb-8">Size Guide</h1>
        <div className="max-w-4xl mx-auto text-lg space-y-6">
          <p>
            Finding the perfect fit is essential for a comfortable and stylish look. Use our comprehensive size guide below to help you choose the right size for your clothing and shoes.
          </p>
          <h2 className="text-2xl font-semibold text-[#D81E05]">Women's Clothing Size Chart (CM)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="py-3 px-4 border-b">Size</th>
                  <th className="py-3 px-4 border-b">Bust</th>
                  <th className="py-3 px-4 border-b">Waist</th>
                  <th className="py-3 px-4 border-b">Hips</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">S (Small)</td>
                  <td className="py-3 px-4 border-b">86-90</td>
                  <td className="py-3 px-4 border-b">66-70</td>
                  <td className="py-3 px-4 border-b">92-96</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">M (Medium)</td>
                  <td className="py-3 px-4 border-b">91-95</td>
                  <td className="py-3 px-4 border-b">71-75</td>
                  <td className="py-3 px-4 border-b">97-101</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">L (Large)</td>
                  <td className="py-3 px-4 border-b">96-100</td>
                  <td className="py-3 px-4 border-b">76-80</td>
                  <td className="py-3 px-4 border-b">102-106</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">XL (Extra Large)</td>
                  <td className="py-3 px-4 border-b">101-105</td>
                  <td className="py-3 px-4 border-b">81-85</td>
                  <td className="py-3 px-4 border-b">107-111</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-[#D81E05] mt-8">Men's Clothing Size Chart (CM)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="py-3 px-4 border-b">Size</th>
                  <th className="py-3 px-4 border-b">Chest</th>
                  <th className="py-3 px-4 border-b">Waist</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">S (Small)</td>
                  <td className="py-3 px-4 border-b">92-96</td>
                  <td className="py-3 px-4 border-b">76-80</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">M (Medium)</td>
                  <td className="py-3 px-4 border-b">97-101</td>
                  <td className="py-3 px-4 border-b">81-85</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">L (Large)</td>
                  <td className="py-3 px-4 border-b">102-106</td>
                  <td className="py-3 px-4 border-b">86-90</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-8 text-center text-gray-600">
            Please note that these are general guides. Specific product measurements may vary.
            Refer to individual product pages for more detailed sizing information.
          </p>
        </div>
      </div>
    
    </>
  );
};

export default SizeGuidePage;