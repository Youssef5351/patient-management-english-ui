import React, { useState } from 'react';
import axios from 'axios';

function AddMedicineForm({ onMedicineAdded }) {
    const [medicine, setMedicine] = useState({ name: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const handleChange = (e) => {
        const { name, value } = e.target;
        setMedicine((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await axios.post('https://patient-managment-backend.vercel.app/api/medicines/add', medicine);

            if (response.data) {
                setSuccessMessage(response.data.message || 'Medicine added successfully');

                const newMedicine = response.data.medicine || {
                    id: response.data.id,
                    name: response.data.name,
                };

                if (newMedicine && onMedicineAdded) {
                    onMedicineAdded({
                        label: newMedicine.name,
                        value: newMedicine.name,
                        id: newMedicine.id,
                    });
                    setMedicine({ name: '' });
                }
            }
        } catch (error) {
            console.error('Error adding medicine:', error);
            setErrorMessage(
                error.response?.data?.message ||
                'Failed to add medicine. Please try again.'
            );
        }
    };

    return (
         <div className="h-screen mx-auto p-6 bg-gray-900 shadow-lg rounded-lg text-gray-300 relative">
            <h2 className="text-3xl font-bold text-[#E3E3E3] mb-4 font-cairo">! اضف دواء جديد</h2>

            {successMessage && (
                <div className="mb-4 p-2 bg-green-800 text-green-400 border border-green-600 rounded">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="mb-4 p-2 bg-red-800 text-red-400 border border-red-600 rounded">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#E3E3E3] mb-1 font-cairo">
                        Medicine Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={medicine.name}
                        onChange={handleChange}
                        className="w-[60%] p-2 bg-gray-800 text-gray-300 border border-gray-700 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-[60%] py-3 rounded-lg text-white font-medium transition-transform duration-200 transform hover:scale-[1.02] bg-violet-600 hover:bg-violet-700 active:scale-[0.98] shadow-lg shadow-violet-500/20 font-cairo"
                >
                    Add Medicine!
                </button>
            </form>
        </div>
    );
}

export default AddMedicineForm;