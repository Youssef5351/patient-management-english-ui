import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ token }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reports, setReports] = useState([]);
    const formatDate = (date) => {
        const d = new Date(date);
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = d.getFullYear();
        const dayName = dayNames[d.getDay()];
        const hour = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return `${dayName}, ${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
      };
      
      
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get('https://patient-managment-backend.vercel.app/api/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Set up periodic refresh
        const intervalId = setInterval(fetchStats, 60000); // Refresh every 5 seconds

        return () => clearInterval(intervalId);
    }, [token]);
    
    useEffect(() => {
        // Fetch daily reports from the backend
        const fetchReports = async () => {
            try {
                const response = await axios.get('https://patient-managment-backend.vercel.app/api/daily-reports');
                setReports(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load daily reports');
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-none">
            <p className="text-yellow-600 text-xl">Loading...</p>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <p className="text-red-500 text-xl">{error}</p>
        </div>
    );

    if (!stats) return null;

    

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="flex justify-center items-center space-x-4">
                <div className="w-[35%] bg-[#3ff699] p-6 rounded-xl shadow-lg">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium text-[#2f2f2f] font-cairo">Total</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold font-cairo text-[#2f2f2f]">Total Patients</p>
                            <p className="text-lg font-normal text-[#2f2f2f] font-cairo">
                                {stats.morningShift.count + stats.nightShift.count}  patient
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold font-cairo text-[#2f2f2f]">Total Revenue</p>
                            <p className="text-lg font-normal text-[#2f2f2f] font-cairo">
                                {stats.morningShift.revenue + stats.nightShift.revenue} EGP Pound
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-[35%] bg-[#7fffd4] p-6 rounded-lg shadow-lg">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium text-[#2f2f2f] font-cairo">Night Shift Revenue</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-center">
                            <p className="text-lg font-semibold font-cairo text-[#2f2f2f]">Total Patients</p>
                            <p className="text-lg font-normal text-[#2f2f2f] font-cairo"> Patient {stats.nightShift.count}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold font-cairo text-[#2f2f2f]">Revenue</p>
                            <p className="text-lg font-normal text-[#2f2f2f] font-cairo">EGP Pound {stats.nightShift.revenue}</p>
                        </div>
                    </div>
                </div>
                {/* Morning Shift Revenue */}
                <div className="w-[35%] p-6 bg-[#FFF8DC] rounded-lg shadow-lg">
                    <div className="mb-4">
                        <h2 className="text-lg font-medium text-[#2f2f2f] font-cairo">Morning Shift Revenue</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold font-cairo text-[#2f2f2f]">Total Patients</p>
                            <p className="text-lg font-normal text-[#2f2f2f] font-cairo"> Patient {stats.morningShift.count}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold font-cairo text-[#2f2f2f]">Revenue</p>
                            <p className="text-lg font-normal text-[#2f2f2f] font-cairo">EGP Pound {stats.morningShift.revenue} </p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
            <h3 className="text-white text-center text-3xl font-cairo font-bold mt-20">
                All Days Revenue
            </h3>
            <div className="mt-5 border border-[#333] rounded-lg overflow-hidden bg-[#1e1e1e] p-3">
                <div className="grid grid-cols-4 bg-[#2c2c2c] p-3 px-5 font-bold text-base text-[#e0e0e0] border-b border-[#333] rounded-[13px]">
                    <span className="text-right p-2.5 font-cairo text-[15px]">Date</span>
                    <span className="text-right p-2.5 font-cairo text-[15px]">Total</span>
                    <span className="text-right p-2.5 font-cairo text-[15px]">Night Shift Revenue</span>
                    <span className="text-right p-2.5 font-cairo text-[15px]">Morning Shift Revenue</span>
                </div>
                {reports.map((report) => (
                    <div
                        key={report._id}
                        className="grid grid-cols-4 bg-[#2c2c2c] p-3 px-5 text-[#e0e0e0] border-b border-[#333]"
                    >
                        <span className="text-right p-2.5 font-cairo text-[15px]">{formatDate(report.date)}</span>
                        <span className="text-right p-2.5 font-cairo text-[15px]">
                            {report.morningShift.revenue + report.nightShift.revenue} EGP
                        </span>
                        <span className="text-right p-2.5 font-cairo text-[15px]">
                            {report.nightShift.revenue} EGP
                        </span>
                        <span className="text-right p-2.5 font-cairo text-[15px]">
                            {report.morningShift.revenue} EGP
                        </span>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Dashboard;
