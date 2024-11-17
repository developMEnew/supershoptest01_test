import React from 'react';

interface StatsCardProps {
  totalItems: number;
}

export default function StatsCard({ totalItems }: StatsCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
      <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
    </div>
  );
}