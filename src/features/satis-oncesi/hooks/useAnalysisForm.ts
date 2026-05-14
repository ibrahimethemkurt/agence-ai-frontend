import { useState } from 'react';

export const useAnalysisForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    purchasePrice: '',
    stock: '',
    shippingCost: '',
    taxRate: '20'
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const updateData = (data: Partial<typeof formData>) => setFormData(prev => ({ ...prev, ...data }));

  return { currentStep, formData, nextStep, prevStep, updateData, setStep: setCurrentStep };
};
