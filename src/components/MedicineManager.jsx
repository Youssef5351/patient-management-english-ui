import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMedicineForm from './AddMedicineForm';

function MedicineManager() {
    const [medicines, setMedicines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch existing medicines when component mounts
    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://patient-managment-backend.vercel.app/api/medicines', {
                // Add caching prevention
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
            
            // Verify data is not empty and is an array
            if (Array.isArray(response.data)) {
                // Sort medicines alphabetically
                const sortedMedicines = response.data.sort((a, b) => 
                    a.name.localeCompare(b.name)
                );
                setMedicines(sortedMedicines);
            } else {
                console.error('Unexpected response format:', response.data);
                setError('Failed to load medicines: Invalid data format');
            }
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setError('Failed to fetch medicines. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMedicineAdded = async (newMedicine) => {
        try {
            // First, send the new medicine to the backend
            const response = await axios.post('https://patient-managment-backend.vercel.app/api/medicines/add', newMedicine);
            
            // If successful, update the local state
            setMedicines(prevMedicines => {
                // Check if medicine already exists to prevent duplicates
                const exists = prevMedicines.some(m => m.name === newMedicine.name);
                if (exists) return prevMedicines;
                
                // Add new medicine and sort
                const updatedMedicines = [...prevMedicines, response.data];
                return updatedMedicines.sort((a, b) => a.name.localeCompare(b.name));
            });
        } catch (error) {
            console.error('Error adding medicine:', error);
            setError('Failed to add medicine. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 text-center">
                <p className="text-gray-600">Loading medicines...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={fetchMedicines} 
                        className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <AddMedicineForm onMedicineAdded={handleMedicineAdded} />
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Medicines List</h2>
                {medicines.length === 0 ? (
                    <p className="text-gray-500 text-center">No medicines added yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {medicines.map((medicine) => (
                            <div
                                key={medicine.id || medicine.name}
                                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-blue-600">
                                    {medicine.name}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Dosage:</span> {medicine.dosage}
                                    </p>
                                    {medicine.category && (
                                        <p className="text-gray-600">
                                            <span className="font-medium">Category:</span> {medicine.category}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MedicineManager;
