import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MedicineAdminList() {
    const [medicines, setMedicines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/'); // Redirect to home, block access
  }, [navigate]);

    // Fetch medicines on component mount
    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get('https://patient-managment-backend.vercel.app/api/medicines');
            setMedicines(response.data);
        } catch (error) {
            console.error('Error fetching medicines:', error);
            setError('Failed to fetch medicines. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMedicine = async () => {
        if (!deleteConfirmation) return;

        try {
            await axios.delete(`https://patient-managment-backend.vercel.app/api/medicines/${deleteConfirmation}`);
            
            // Remove the medicine from local state
            setMedicines(prevMedicines => 
                prevMedicines.filter(medicine => medicine._id !== deleteConfirmation)
            );
            
            // Reset delete confirmation
            setDeleteConfirmation(null);
        } catch (error) {
            console.error('Error deleting medicine:', error);
            setError('Failed to delete medicine. Please try again.');
        }
    };

    // Filtered medicines
    const filteredMedicines = medicines.filter(medicine => 
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Render loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
                <button 
                    onClick={fetchMedicines} 
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className=" px-4 py-8 bg-gray-900 text-gray-200 min-h-screen">
            {/* Delete Confirmation Modal */}
            {deleteConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                        <h2 className="text-xl font-bold mb-4 text-indigo-400">Confirm Deletion</h2>
                        <p className="mb-4">Are you sure you want to delete this medicine?</p>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => setDeleteConfirmation(null)}
                                className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteMedicine}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gray-800 shadow-md rounded-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-indigo-400">Medicine Inventory</h1>
                    <div className="flex items-center space-x-4">
                        {/* Search Input */}
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search medicines..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-700 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="absolute left-3 top-3 text-gray-400" 
                                width="20" 
                                height="20" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Medicine List */}
                {filteredMedicines.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <p>No medicines found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {filteredMedicines.map((medicine) => (
                            <div 
                                key={medicine._id} 
                                className="flex justify-between items-center p-4 hover:bg-gray-700 transition-colors"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-200">{medicine.name}</h3>
                                    <p className="text-sm text-gray-400">
                                        {medicine.dosage && `Dosage: ${medicine.dosage}`}
                                        {medicine.category && ` | Category: ${medicine.category}`}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setDeleteConfirmation(medicine._id)}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                    title="Delete Medicine"
                                >
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="24" 
                                        height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="p-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-gray-400">
                        Total Medicines: {filteredMedicines.length}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MedicineAdminList;
