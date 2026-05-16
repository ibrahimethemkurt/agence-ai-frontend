import { useState } from 'react';

export const useListingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sourceType: '' as 'analyzed' | 'manual' | '',
    selectedProduct: '',
    productName: '',
    description: '',
    price: '',
    platforms: [] as string[]
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const updateData = (data: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...data }));
  const setStep = (step: number) => setCurrentStep(step);

  return { currentStep, formData, nextStep, prevStep, updateData, setStep };
};
