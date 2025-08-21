import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';
import elkoumi from "../assets/Elkoumi3.jpg";
import index from "../index.css"
const TreatmentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patient = location.state?.patient;
  const [patients, setPatients] = useState([]);
  const [medicinesList, setMedicinesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [showPrescription, setShowPrescription] = useState(false);

  const [treatment, setTreatment] = useState({
    patientId: patient?._id || '',
    patientName: patient?.name || '',
    patientAge: patient?.age || '',
    symptoms: patient?.symptoms || '',
    medicine1: '',
    dosage1: '',
    medicine2: '',
    dosage2: '',
    medicine3: '',
    dosage3: '',
    medicine4: '',
    dosage4: '',
    medicine5: '',
    dosage5: '',
    treatmentDate: new Date().toISOString().split('T')[0]
  });

  // Redirect if no patient data
  useEffect(() => {
    if (!patient) {
      setErrorMessage('No patient data found');
      setTimeout(() => {
        navigate('/doctor');
      }, 3000);
    }
  }, [patient, navigate]);

  const dosageList = [
    // Tablets (قرص)
    { value: 'قرص بعد الفطار', label: 'Tablet after breakfast' },
    { value: 'قرص بعد الغذاء', label: 'Tablet after lunch' },
    { value: 'قرص بعد العشاء', label: 'Tablet after dinner' },
    { value: 'قرص قبل النوم', label: 'Tablet before sleep' },
    { value: 'قرص في الصباح', label: 'Tablet in the morning' },
    { value: 'قرص في المساء', label: 'Tablet in the evening' },
    { value: 'قرص كل 12 ساعة', label: 'Tablet every 12 hours' },
    { value: 'قرص كل 24 ساعة', label: 'Tablet every 24 hours' },
    { value: 'قرص كل يوم', label: 'Tablet daily' },
    { value: 'قرص يوم بعد يوم', label: 'Tablet every other day' },
    { value: 'قرص 3 مرات يومياً', label: 'Tablet three times a day' },
    { value: 'قرص 4 مرات يومياً', label: 'Tablet four times a day' },
    { value: 'قرص عند الحاجة', label: 'Tablet as needed' },
    { value: 'قرص عند اللزوم', label: 'Tablet when required' },
    { value: 'قرص قبل الفطار والعشاء', label: 'Tablet before breakfast and dinner' },
    { value: 'قرص بعد الفطار والعشاء', label: 'Tablet after breakfast and dinner' },
    { value: 'قرص قبل النوم حسب الحاجة', label: 'Tablet before sleep as needed' },
    { value: 'قرص في وقت الألم', label: 'Tablet during pain' },
    { value: 'قرص صباحاً ومساءً', label: 'Tablet morning and evening' },
    { value: 'قرص كل يومين', label: 'Tablet every two days' },
    { value: 'قرص للأطفال يومياً', label: 'Tablet daily for children' },
    { value: 'قرص للأطفال مرتين يومياً', label: 'Tablet twice daily for children' },
    { value: 'قرص للكبار يومياً', label: 'Tablet daily for adults' },
    { value: 'قرص للكبار مرتين يومياً', label: 'Tablet twice daily for adults' },
    { value: 'قرص كل 3 أيام', label: 'Tablet every three days' },
    { value: 'قرص كل أسبوع', label: 'Tablet weekly' },
    { value: 'قرص عند الضرورة', label: 'Tablet in case of necessity' },

      // Syrup (شراب)
    { value: 'ملعقة بعد الفطار', label: 'Spoon after breakfast' },
    { value: 'ملعقة بعد الغذاء', label: 'Spoon after lunch' },
    { value: 'ملعقة بعد العشاء', label: 'Spoon after dinner' },
    { value: 'ملعقة قبل النوم', label: 'Spoon before sleep' },
    { value: 'ملعقة في الصباح', label: 'Spoon in the morning' },
    { value: 'ملعقة في المساء', label: 'Spoon in the evening' },
    { value: 'ملعقة كل 12 ساعة', label: 'Spoon every 12 hours' },
    { value: 'ملعقة كل 24 ساعة', label: 'Spoon every 24 hours' },
    { value: 'ملعقة كل يوم', label: 'Spoon every day' },
    { value: 'ملعقة يوم بعد يوم', label: 'Spoon every other day' },
    { value: 'ملعقة 3 مرات يومياً', label: 'Spoon 3 times daily' },
    { value: 'ملعقة 4 مرات يومياً', label: 'Spoon 4 times daily' },
    { value: 'ملعقة عند الحاجة', label: 'Spoon when needed' },
    { value: 'ملعقة عند اللزوم', label: 'Spoon as required' },
    { value: 'ملعقة قبل الفطار والعشاء', label: 'Spoon before breakfast and dinner' },
    { value: 'ملعقة بعد الفطار والعشاء', label: 'Spoon after breakfast and dinner' },
    { value: 'ملعقة قبل النوم حسب الحاجة', label: 'Spoon before sleep if needed' },
    { value: 'ملعقة في وقت الألم', label: 'Spoon during pain' },
    { value: 'ملعقة صباحاً ومساءً', label: 'Spoon morning and evening' },
    { value: 'ملعقة كل يومين', label: 'Spoon every 2 days' },
    { value: 'ملعقة للأطفال يومياً', label: 'Spoon daily for children' },
    { value: 'ملعقة للأطفال مرتين يومياً', label: 'Spoon twice daily for children' },
    { value: 'ملعقة للكبار يومياً', label: 'Spoon daily for adults' },
    { value: 'ملعقة للكبار مرتين يومياً', label: 'Spoon twice daily for adults' },
    { value: 'ملعقة كل 3 أيام', label: 'Spoon every 3 days' },
    { value: 'ملعقة كل أسبوع', label: 'Spoon every week' },
    { value: 'ملعقة عند الضرورة', label: 'Spoon when necessary' },

    // Effervescent (فوار)
    { value: 'كيس بعد الفطار', label: 'Sachet after breakfast' },
    { value: 'كيس بعد الغذاء', label: 'Sachet after lunch' },
    { value: 'كيس بعد العشاء', label: 'Sachet after dinner' },
    { value: 'كيس قبل النوم', label: 'Sachet before sleep' },
    { value: 'كيس في الصباح', label: 'Sachet in the morning' },
    { value: 'كيس في المساء', label: 'Sachet in the evening' },
    { value: 'كيس كل 12 ساعة', label: 'Sachet every 12 hours' },
    { value: 'كيس كل 24 ساعة', label: 'Sachet every 24 hours' },
    { value: 'كيس كل يوم', label: 'Sachet every day' },
    { value: 'كيس يوم بعد يوم', label: 'Sachet every other day' },
    { value: 'كيس 3 مرات يومياً', label: 'Sachet 3 times daily' },
    { value: 'كيس 4 مرات يومياً', label: 'Sachet 4 times daily' },
    { value: 'كيس عند الحاجة', label: 'Sachet when needed' },
    { value: 'كيس عند اللزوم', label: 'Sachet as required' },
    { value: 'كيس قبل الفطار والعشاء', label: 'Sachet before breakfast and dinner' },
    { value: 'كيس بعد الفطار والعشاء', label: 'Sachet after breakfast and dinner' },
    { value: 'كيس قبل النوم حسب الحاجة', label: 'Sachet before sleep if needed' },
    { value: 'كيس في وقت الألم', label: 'Sachet during pain' },
    { value: 'كيس صباحاً ومساءً', label: 'Sachet morning and evening' },
    { value: 'كيس كل يومين', label: 'Sachet every 2 days' },
    { value: 'كيس للأطفال يومياً', label: 'Sachet daily for children' },
    { value: 'كيس للأطفال مرتين يومياً', label: 'Sachet twice daily for children' },
    { value: 'كيس للكبار يومياً', label: 'Sachet daily for adults' },
    { value: 'كيس للكبار مرتين يومياً', label: 'Sachet twice daily for adults' },
    { value: 'كيس كل 3 أيام', label: 'Sachet every 3 days' },
    { value: 'كيس كل أسبوع', label: 'Sachet every week' },
    { value: 'كيس عند الضرورة', label: 'Sachet when necessary' },
    { value: 'كيس علي نصف كوب ماء مرتين يومياً', label: 'Sachet on half a cup of water twice daily' },
    { value: 'كيس علي نصف كوب ماء ثلاث مرات يومياً', label: 'Sachet on half a cup of water three times daily' },
    { value: 'كيس علي نصف كوب ماء مرة يومياً', label: 'Sachet on half a cup of water once daily' },

    // Injections (حقن)
    { value: 'حقنة بعد الفطار', label: 'Injection after breakfast' },
    { value: 'حقنة بعد الغذاء', label: 'Injection after lunch' },
    { value: 'حقنة بعد العشاء', label: 'Injection after dinner' },
    { value: 'حقنة قبل النوم', label: 'Injection before sleep' },
    { value: 'حقنة في الصباح', label: 'Injection in the morning' },
    { value: 'حقنة في المساء', label: 'Injection in the evening' },
    { value: 'حقنة كل يوم', label: 'Injection every day' },
    { value: 'حقنة يوم بعد يوم', label: 'Injection every other day' },
    { value: 'حقنة 3 مرات في الأسبوع', label: 'Injection 3 times a week' },
    { value: 'حقنة كل أسبوع', label: 'Injection every week' },
    { value: 'حقنة 3 مرات يومياً', label: 'Injection 3 times daily' },
    { value: 'حقنة 4 مرات يومياً', label: 'Injection 4 times daily' },
    { value: 'حقنة عند الحاجة', label: 'Injection when needed' },
    { value: 'حقنة عند اللزوم', label: 'Injection as required' },
    { value: 'حقنة في وقت الألم', label: 'Injection during pain' },
    { value: 'حقنة في الليل حسب الحاجة', label: 'Injection at night if needed' },
    { value: 'حقنة في الصباح والمساء', label: 'Injection morning and evening' },
    { value: 'حقنة للأطفال يومياً', label: 'Injection daily for children' },
    { value: 'حقنة للأطفال مرتين يومياً', label: 'Injection twice daily for children' },
    { value: 'حقنة للكبار يومياً', label: 'Injection daily for adults' },
    { value: 'حقنة كل شهر', label: 'Injection every month' },
    { value: 'حقنة حسب الحاجة كل أسبوع', label: 'Injection as needed every week' },
    { value: 'حقنة كل 3 أيام', label: 'Injection every 3 days' },

    { value: 'أمبولة بعد الفطار', label: 'Ampoule after breakfast' },
    { value: 'أمبولة بعد الغذاء', label: 'Ampoule after lunch' },
    { value: 'أمبولة بعد العشاء', label: 'Ampoule after dinner' },
    { value: 'أمبولة قبل النوم', label: 'Ampoule before sleep' },
    { value: 'أمبولة في الصباح', label: 'Ampoule in the morning' },
    { value: 'أمبولة في المساء', label: 'Ampoule in the evening' },
    { value: 'أمبولة كل يوم', label: 'Ampoule every day' },
    { value: 'أمبولة يوم بعد يوم', label: 'Ampoule every other day' },
    { value: 'أمبولة 3 مرات في الأسبوع', label: 'Ampoule 3 times a week' },
    { value: 'أمبولة كل أسبوع', label: 'Ampoule every week' },
    { value: 'أمبولة 3 مرات يومياً', label: 'Ampoule 3 times daily' },
    { value: 'أمبولة 4 مرات يومياً', label: 'Ampoule 4 times daily' },
    { value: 'أمبولة عند الحاجة', label: 'Ampoule when needed' },
    { value: 'أمبولة عند اللزوم', label: 'Ampoule as required' },
    { value: 'أمبولة في وقت الألم', label: 'Ampoule during pain' },
    { value: 'أمبولة في الليل حسب الحاجة', label: 'Ampoule at night if needed' },
    { value: 'أمبولة في الصباح والمساء', label: 'Ampoule morning and evening' },
    { value: 'أمبولة للأطفال يومياً', label: 'Ampoule daily for children' },
    { value: 'أمبولة للأطفال مرتين يومياً', label: 'Ampoule twice daily for children' },
    { value: 'أمبولة للكبار يومياً', label: 'Ampoule daily for adults' },
    { value: 'أمبولة كل شهر', label: 'Ampoule every month' },
    { value: 'أمبولة حسب الحاجة كل أسبوع', label: 'Ampoule as needed every week' },
    { value: 'أمبولة كل 3 أيام', label: 'Ampoule every 3 days' },

    // Drops (قطرات)
    { value: 'قطرة بعد الفطار', label: 'Drop after breakfast' },
    { value: 'قطرة بعد الغذاء', label: 'Drop after lunch' },
    { value: 'قطرة بعد العشاء', label: 'Drop after dinner' },
    { value: 'قطرة قبل النوم', label: 'Drop before sleep' },
    { value: 'قطرة في الصباح', label: 'Drop in the morning' },
    { value: 'قطرة في المساء', label: 'Drop in the evening' },
    { value: 'قطرة كل يوم', label: 'Drop every day' },
    { value: 'قطرة يوم بعد يوم', label: 'Drop every other day' },
    { value: 'قطرة 3 مرات في الأسبوع', label: 'Drop 3 times a week' },
    { value: 'قطرة كل أسبوع', label:"Drop every week" },
    { value: 'قطرة 3 مرات يومياً', label: 'Drop 3 times daily' },
    { value: 'قطرة 4 مرات يومياً', label: 'Drop 4 times daily' },
    { value: 'قطرة عند الحاجة', label: 'Drop when needed' },
    { value: 'قطرة عند اللزوم', label: 'Drop as required' },
    { value: 'قطرة في وقت الألم', label: 'Drop during pain' },
    { value: 'قطرة في الليل حسب الحاجة', label: 'Drop at night if needed' },
    { value: 'قطرة في الصباح والمساء', label: 'Drop morning and evening' },
    { value: 'قطرة للأطفال يومياً', label: 'Drop daily for children' },
    { value: 'قطرة للأطفال مرتين يومياً', label: 'Drop twice daily for children' },
    { value: 'قطرة للكبار يومياً', label: 'Drop daily for adults' },
    { value: 'قطرة كل شهر', label: 'Drop every month' },
    { value: 'قطرة حسب الحاجة كل أسبوع', label: 'Drop as needed every week' },
    { value: 'قطرة كل 3 أيام', label: 'Drop every 3 days' },
  
    // Creams (كريمات)
    { value: 'كريم صباحاً ومساءً', label: 'Cream morning and evening' },
    { value: 'كريم مرة يومياً', label: 'Cream once daily' },
    { value: 'كريم مرتين يومياً', label: 'Cream twice daily' },
  
    // Ointments (مرهم)
    { value: 'مرهم صباحاً ومساءً', label: 'Ointment morning and evening' },
    { value: 'مرهم مرتين يومياً', label: 'Ointment twice daily' },
    { value: 'مرهم مرة واحدة يومياً', label: 'Ointment once daily' },
  
    // Suspensions (معلق)
    { value: 'معلق 3 مرات يومياً', label: 'Suspension 3 times daily' },
    { value: 'معلق مرة واحدة يومياً', label: 'Suspension once daily' },

    { value: 'لبوس قبل النوم', label: 'Suppository Before Bed' },
    { value: 'لبوس بعد الفطار', label: 'Suppository After Breakfast' },
    { value: 'لبوس بعد الغذاء', label: 'Suppository After Lunch' },
    { value: 'لبوس بعد العشاء', label: 'Suppository After Dinner' },
    { value: 'لبوس كل 12 ساعة', label: 'Suppository Every 12 Hours' },
    { value: 'لبوس كل يوم', label: 'Suppository Every Day' },
    { value: 'لبوس 3 مرات يومياً', label: 'Suppository 3 Times Daily' },
    { value: 'لبوس يوم بعد يوم', label: 'Suppository Every Other Day' },
    { value: 'لبوس عند اللزوم', label: 'Suppository When Needed' },
    { value: 'لبوس مرة واحدة يومياً', label: 'Suppository Once Daily' },
    { value: 'لبوس مرة واحدة كل 3 أيام', label: 'Suppository Once Every 3 Days' },
    { value: 'لبوس صباحاً ومساءً', label: 'Suppository Morning and Evening' },
    { value: 'لبوس كل 48 ساعة', label: 'Suppository Every 48 Hours' },
    { value: 'لبوس قبل النوم حسب الحاجة', label: 'Suppository Before Bed As Needed' },
    { value: 'لبوس قبل الفطار والعشاء', label: 'Suppository Before Breakfast and Dinner' },
    { value: 'لبوس في وقت الألم', label: 'Suppository At Time of Pain' },
    { value: 'لبوس عند الضرورة', label: 'Suppository As Necessary' },
    { value: 'لبوس للأطفال مرة واحدة يومياً', label: 'Suppository for Children Once Daily' },
    { value: 'لبوس للأطفال مرتين يومياً', label: 'Suppository for Children Twice Daily' },
    { value: 'لبوس للكبار مرة واحدة يومياً', label: 'Suppository for Adults Once Daily' },
    { value: 'لبوس للكبار مرتين يومياً', label: 'Suppository for Adults Twice Daily' },
    // Miscellaneous
    { value: 'محلول للغرغرة 3 مرات يومياً', label: 'Gargle solution 3 times daily' },
    { value: 'شامبو مرة كل يومين', label: 'Shampoo once every two days' },
    { value: 'بخاخ مرتين يومياً', label: 'Spray twice daily' },
    { value: 'مسحوق يخلط حسب التوجيه', label: 'Powder to mix as directed' },
    { value: 'محلول يستخدم حسب التوجيه', label: 'Solution to use as directed' },
  
    // Combination (تركيبة)
    { value: 'تركيبة ثلاثية: قرص صباحاً ومساءً', label: 'Triple combination: Tablet morning and evening' },
    { value: 'تركيبة صباحاً ومساءً حسب التوجيه', label: 'Combination morning and evening as directed' }
  
];



  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#1f2937',
      borderRadius: '0.5rem',
      borderColor: '#374151',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#4b5563'
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#1f2937',
      border: '1px solid #374151'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#7c3aed' 
        : state.isFocused 
          ? '#374151' 
          : '#1f2937',
      color: '#e5e7eb',
      '&:active': {
        backgroundColor: '#7c3aed'
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#e5e7eb'
    }),
    input: (provided) => ({
      ...provided,
      color: '#e5e7eb'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af'
    })
  };

useEffect(() => {
  const fetchMedicines = async () => {
    try {
      const response = await axios.get('https://patient-managment-backend.vercel.app/api/medicines');
      const options = response.data.map((medicine) => ({
        value: medicine._id,
        label: medicine.name
      }));
      setMedicinesList(options);
    } catch (error) {
      console.error('Full error details:', error);
      setErrorMessage(`Failed to fetch medicines: ${error.message}`);
    }
  };
  fetchMedicines();
}, []);

const handleSelectChange = (selectedOption, { name }) => {
  setTreatment((prevTreatment) => ({
    ...prevTreatment,
    [name]: selectedOption ? selectedOption.label : ''
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    await axios.post('https://patient-managment-backend.vercel.app/api/treatment/add', treatment);
    setSuccessMessage('Treatment plan saved successfully!');
    setShowPrescription(true);
  } catch (error) {
    setErrorMessage('Failed to submit treatment data');
  } finally {
    setIsSubmitting(false);
  }
};

const handlePrint = async () => {
  try {
    // Track medicine usage data when printing
    const medicineUsageData = {
      medicine1: treatment.medicine1,
      medicine2: treatment.medicine2,
      medicine3: treatment.medicine3,
      medicine4: treatment.medicine4,
      medicine5: treatment.medicine5,
    };

    // Post the medicine usage data only when printing
    const response = await axios.post(
      "https://patient-managment-backend.vercel.app/api/medicine-usage/track",
      medicineUsageData
    );
    console.log("Medicine usage tracking response for print:", response.data);
  } catch (error) {
    console.error("Error tracking medicine usage:", error);
  }

  // Trigger print dialog
  window.print();

  // Set up the event listener for after printing
  window.onafterprint = () => {
    console.log("Patient ID to remove from display:", patient._id);

    if (typeof setPatients === "function") {
      setPatients((prevPatients) => {
        const updatedPatients = prevPatients.filter((p) => p._id !== patient._id);
        console.log("Updated patients list:", updatedPatients);
        return updatedPatients;
      });
    } else {
      console.error("setPatients is not defined or not a function.");
    }

    // Redirect to the doctor page
    window.location.href = "/doctor";    
  };
};



const handleNewPrescription = () => {
  setShowPrescription(false);
  setTreatment({
    medicine1: '',
    dosage1: '',
    medicine2: '',
    dosage2: '',
    medicine3: '',
    dosage3: '',
    medicine4: '',
    dosage4: '',
    medicine5: '',
    dosage5: '',
    treatmentDate: new Date().toISOString().split('T')[0]
  });
  setSuccessMessage('');
};

const renderMedicineSection = (number) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1 font-cairo">
        Medicine {number}
      </label>
      <Select
        name={`medicine${number}`}
        options={medicinesList}
        onChange={handleSelectChange}
        value={medicinesList.find((option) => option.label === treatment[`medicine${number}`]) || null}
        isClearable
        styles={customSelectStyles}
        placeholder="Select medicine..."
        className="mt-1"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">
        Dosage {number}
      </label>
      <Select
        name={`dosage${number}`}
        options={dosageList}
        onChange={handleSelectChange}
        value={dosageList.find((option) => option.label === treatment[`dosage${number}`]) || null}
        isClearable
        styles={customSelectStyles}
        placeholder="Select dosage..."
        className="mt-1"
      />
      
    </div>
  </div>
);

if (showPrescription) {
  return (
    <div className="min-h-[40rem] bg-gray-900 text-gray-100 font-cairo">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative w-full"
          style={{
            height: '100vh',
            pageBreakInside: 'avoid',
          }}
        >
          <img
            src={elkoumi}
            alt="Prescription Background"
            className="w-full h-full "
          />

          <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-between p-8">
            {/* Patient Info */}
            <div className="text-center mt-16">
              <p className="text-gray-800 mb-2 ml-[1.5rem] text-sm absolute mt-[3rem]">
                {new Date(treatment.treatmentDate).toLocaleDateString('en-US')}
              </p>
              <p className="text-gray-800 mt-4 ml-[11rem] text-[.85rem] absolute">
                {treatment.patientName}
              </p>
              <p className="text-gray-800 ml-[4.25rem] mt-[1.1rem] text-sm absolute">
                {treatment.patientAge}
              </p>
              <p className="text-gray-800 text-sm mt-[3rem] pl-[11rem] absolute">
                {treatment.symptoms}
              </p>
            </div>

            {/* Medicines */}
            <div className="flex-grow mt-32 ml-6 space-y-3">
              {[1, 2, 3, 4, 5].map((num) => {
                if (treatment[`medicine${num}`] && treatment[`dosage${num}`]) {
                  let medicineColor;
                  switch (num) {
                    case 1:
                      medicineColor = 'text-red-500';
                      break;
                    case 2:
                      medicineColor = 'text-green-500';
                      break;
                    case 3:
                      medicineColor = 'text-blue-500';
                      break;
                    case 4:
                      medicineColor = 'text-black';
                      break;
                    case 5:
                      medicineColor = 'text-red-500';
                      break;
                    default:
                      medicineColor = 'text-gray-800';
                      break;
                  }

                  return (
                    <div key={num} className="text-gray-800 text-base space-y-1 text-left font-roboto">
                      <span className={`block ${medicineColor}`}>
                        {medicinesList.find(
                          (m) => m.label === treatment[`medicine${num}`]
                        )?.label}
                      </span>
                      <span className="block text-sm text-black ml-20 font-tajawal">
                        {dosageList.find((d) => d.label === treatment[`dosage${num}`])?.label}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-6 flex justify-center space-x-4 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-violet-500/20"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen p-6 bg-gray-900 font-cairo">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-100 text-center">New Treatment Plan</h2>
      <p className="mt-2 text-center text-gray-400">
        Add medicine details for treatment
      </p>
    </div>

    {/* Patient Information Display */}
    <div className="max-w-2xl mx-auto mb-6 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-medium text-gray-200 mb-3">Patient Information</h3>
      <div className="grid grid-cols-2 gap-4 text-gray-300">
        <div>
          <span className="font-medium">Name:</span> {treatment.patientName}
        </div>
        <div>
          <span className="font-medium">Age:</span> {treatment.patientAge}
        </div>
      </div>
    </div>

    {errorMessage && (
      <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
        {errorMessage}
      </div>
    )}

    {successMessage && (
      <div className="mb-6 p-4 bg-green-900/50 border border-green-700 text-green-200 rounded-lg">
        {successMessage}
      </div>
    )}
  <div className="print:max-h-screen print:overflow-hidden print:page-break-inside-avoid"></div>
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div className="flex space-x-2 mb-6">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 
              ${activeSection === num 
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setActiveSection(num)}
          >
            Medicine {num}
          </button>
        ))}
      </div>

      {renderMedicineSection(activeSection)}

      <div>
        <label className="block text-sm font-medium text-gray-200 mb-1">
          Treatment Date
        </label>
        <input
          type="date"
          value={treatment.treatmentDate}
          onChange={(e) => setTreatment({ ...treatment, treatmentDate: e.target.value })}
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 
                    focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg text-white font-medium transition-transform duration-200 
          transform hover:scale-[1.02] ${isSubmitting 
            ? 'bg-violet-600/50 cursor-not-allowed' 
            : 'bg-violet-600 hover:bg-violet-700 active:scale-[0.98] shadow-lg shadow-violet-500/20'}`}
      >
        {isSubmitting ? 'Saving...' : 'Save Treatment Plan'}
      </button>
    </form>
  </div>
);
};

export default TreatmentForm;
