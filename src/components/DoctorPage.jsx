import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function DoctorPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [completedPatients, setCompletedPatients] = useState(() => {
        // Initialize from localStorage on component mount
        const stored = localStorage.getItem('completedPatients');
        return new Set(stored ? JSON.parse(stored) : []);
    });

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await api.get('/api/patients');
                setPatients(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching patients:', err);
                setError('فError Loading patients');
                setLoading(false);
            }
        };

        fetchPatients();
        console.log('Setting up initial fetch and refresh interval');
        fetchPatients();
        const interval = setInterval(fetchPatients, 3000);
        
        return () => {
          console.log('Clearing refresh interval');
          clearInterval(interval);
        };
      }, []);

    

    const handlePatientSelect = (patient) => {
        // Mark patient as completed immediately
        const newCompletedPatients = new Set(completedPatients);
        newCompletedPatients.add(patient._id);
        
        // Update state and localStorage
        setCompletedPatients(newCompletedPatients);
        localStorage.setItem('completedPatients', JSON.stringify([...newCompletedPatients]));
        
        // Navigate to treatment page
        navigate('/treatment', { state: { patient } });
    };

    // Rest of your component remains the same...
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center font-cairo">
                <div className="text-gray-300 flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading..</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center font-cairo">
                <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6 font-cairo relative">
        <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-100 text-center">بوابة الطبيب</h2>
                <p className="mt-2 text-center text-gray-400">
                   Patient Waiting
                </p>
                <div className="flex justify-center mt-4">
                <button 
    className="px-[4.5rem] py-2 bg-violet-500 text-gray-100 font-medium rounded-lg shadow hover:bg-violet-600 transition-colors duration-200"
    onClick={() => window.open("/dashboard", "_blank")}
>
    Day Revenue
</button>

        </div>
            </div>


                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    {patients.length === 0 ? (
                        <p className="text-center text-gray-400">No Patients Waiting/p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {patients.map((patient) => (
                                <div
                                    key={patient._id}
                                    onClick={() => handlePatientSelect(patient)}
                                    className={`bg-gray-700 p-4 rounded-lg cursor-pointer 
                                        transition-all duration-200 hover:bg-gray-600 
                                        transform hover:scale-[1.02] active:scale-[0.98] 
                                        border border-gray-600 hover:border-violet-500/50 
                                        shadow-lg hover:shadow-violet-500/10 ${
                                            completedPatients.has(patient._id) ? 'opacity-50' : ''
                                        }`}
                                >
                                    <div className="space-y-2 relative">
                                        <h3 className="font-medium text-gray-100 text-lg">{patient.name}</h3>
                                        <div className="flex justify-between text-gray-300">
                                            <span>العمر:</span>
                                            <span>{patient.age}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-300">
                                            <span>Visit Date:</span>
                                            <span dir="ltr">
                                                {new Date(patient.visitDate).toLocaleDateString('ar-EG')}
                                            </span>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-600">
                                            <p className="text-gray-300">
                                                <span className="text-gray-400">Address: </span>
                                                {patient.symptoms}
                                            </p>
                                        </div>
                                        {completedPatients.has(patient._id) && (
                                            <div className="absolute top-2 right-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-6 h-6 text-green-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorPage;
