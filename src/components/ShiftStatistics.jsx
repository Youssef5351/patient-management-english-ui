import React, { useState, useEffect } from 'react';

const CompactCard = ({ children }) => (
  <div className="rounded-lg bg-gray-800 border border-gray-700 overflow-hidden mb-8">
    {children}
  </div>
);

const StatCard = ({ icon, label, value, unit }) => (
  <div className="bg-gray-700/40 rounded-lg p-4 hover:bg-gray-700/60 transition-colors">
    <div className="flex justify-between items-center">
      <div className="text-xl font-semibold text-gray-100">
        {value}
        {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
      </div>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
    </div>
  </div>
);

const ShiftStatistics = ({ shift }) => {
  const [stats, setStats] = useState({
    morningShift: { count: 0, revenue: 0 },
    nightShift: { count: 0, revenue: 0 },
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchShiftStats = async () => {
      if (!shift) return;

      try {
        const response = await fetch("http://localhost:5000/api/stats");
        const data = await response.json();
        setStats({
          ...data,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load shift statistics',
        }));
      }
    };

    fetchShiftStats();
    const interval = setInterval(fetchShiftStats, 5000);
    return () => clearInterval(interval);
  }, [shift]);

  if (!shift) return null;

  const currentShiftData = shift === 'morning' ? stats.morningShift : stats.nightShift;

  return (
    <CompactCard>
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-gray-100 text-lg">
          {shift === 'morning' ? 'Morning Shift' : 'Night Shift'}
        </h2>
      </div>

      <div className="p-4">
        {stats.loading ? (
          <div className="flex justify-center p-4">
            <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : stats.error ? (
          <div className="text-red-400 text-center text-sm p-2">
            {stats.error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <StatCard 
              icon={
                <svg className="w-6 h-6 text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
              label="Patients"
              value={currentShiftData?.count || 0}
              unit="patients"
            />
            <StatCard 
              icon={
                <svg className="w-6 h-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
              label="Total Revenue"
              unit="EGP"
              value={ currentShiftData?.revenue || 0}
            />
          </div>
        )}
      </div>
    </CompactCard>
  );
};

export default ShiftStatistics;
