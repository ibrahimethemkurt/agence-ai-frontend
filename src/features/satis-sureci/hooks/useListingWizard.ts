import { useState } from 'react';

export const useListingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    platforms: [] as string[]
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const updateData = (data: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...data }));

  return { currentStep, formData, nextStep, prevStep, updateData };
};
