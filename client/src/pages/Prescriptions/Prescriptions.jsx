import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    diagnosis: '',
    notes: ''
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get('/api/prescriptions');
      setPrescriptions(response.data.data.prescriptions);
    } catch (error) {
      toast.error('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/prescriptions', formData);
      toast.success('Prescription created successfully');
      setShowForm(false);
      fetchPrescriptions();
    } catch (error) {
      toast.error('Failed to create prescription');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          {user.role === 'doctor' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
            >
              New Prescription
            </button>
          )}
        </div>

        {showForm && user.role === 'doctor' && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">Create Prescription</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Medications</label>
                  {formData.medications.map((med, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 mt-2 p-4 border rounded">
                      <input
                        type="text"
                        placeholder="Medication name"
                        required
                        className="border border-gray-300 rounded-md p-2"
                        value={med.name}
                        onChange={(e) => {
                          const newMeds = [...formData.medications];
                          newMeds[index].name = e.target.value;
                          setFormData({ ...formData, medications: newMeds });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Dosage"
                        required
                        className="border border-gray-300 rounded-md p-2"
                        value={med.dosage}
                        onChange={(e) => {
                          const newMeds = [...formData.medications];
                          newMeds[index].dosage = e.target.value;
                          setFormData({ ...formData, medications: newMeds });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Frequency"
                        required
                        className="border border-gray-300 rounded-md p-2"
                        value={med.frequency}
                        onChange={(e) => {
                          const newMeds = [...formData.medications];
                          newMeds[index].frequency = e.target.value;
                          setFormData({ ...formData, medications: newMeds });
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        required
                        className="border border-gray-300 rounded-md p-2"
                        value={med.duration}
                        onChange={(e) => {
                          const newMeds = [...formData.medications];
                          newMeds[index].duration = e.target.value;
                          setFormData({ ...formData, medications: newMeds });
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMedication}
                    className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Add Medication
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                  >
                    Create Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {prescriptions.map((prescription) => (
              <li key={prescription._id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.role === 'patient' 
                            ? `Dr. ${prescription.doctor?.firstName} ${prescription.doctor?.lastName}`
                            : `${prescription.patient?.firstName} ${prescription.patient?.lastName}`
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          Diagnosis: {prescription.diagnosis}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                      {prescription.sentToPharmacy?.status && (
                        <span className="text-xs text-gray-500 mt-1">
                          Sent to Pharmacy
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Medications:</h4>
                    <ul className="mt-2 space-y-2">
                      {prescription.medications.map((med, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {med.name} - {med.dosage}, {med.frequency} for {med.duration}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;