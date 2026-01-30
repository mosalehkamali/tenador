import { useState, useEffect, useCallback } from 'react';

// Mock addresses for demo
const mockAddresses = [
  {
    id: '1',
    title: 'منزل',
    fullName: 'علی محمدی',
    phone: '09121234567',
    city: 'تهران',
    addressLine: 'خیابان ولیعصر، کوچه گلستان، پلاک ۱۲، واحد ۳',
    postalCode: '1234567890'
  },
  {
    id: '2',
    title: 'محل کار',
    fullName: 'علی محمدی',
    phone: '09121234567',
    city: 'تهران',
    addressLine: 'میدان ونک، خیابان شیراز شمالی، برج آسمان، طبقه ۸',
    postalCode: '9876543210'
  }
];

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In production:
      // const response = await fetch('/api/addresses');
      // const data = await response.json();
      // setAddresses(data);
      
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setAddresses(mockAddresses);
    } catch (err) {
      setError('خطا در دریافت آدرس‌ها');
      console.error('Error fetching addresses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Add new address
  const addAddress = useCallback(async (newAddress) => {
    try {
      const address = {
        ...newAddress,
        id: Date.now().toString()
      };
      
      if (newAddress.saveAddress) {
        // In production:
        // await fetch('/api/addresses', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ ...newAddress, userId: 'current-user-id' })
        // });
        
        setAddresses(prev => [...prev, address]);
      }
      
      return address;
    } catch (err) {
      console.error('Error adding address:', err);
      return null;
    }
  }, []);

  return {
    addresses,
    isLoading,
    error,
    addAddress,
    refetch: fetchAddresses
  };
};
