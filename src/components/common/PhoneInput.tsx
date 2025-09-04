import React, { useState, useEffect } from 'react';
import PhoneInputBase, { PhoneInputProps as BasePhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useLanguage } from '@/contexts/LanguageContext';

interface PhoneInputProps extends Omit<BasePhoneInputProps, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  inputClass?: string;
  containerClass?: string;
  required?: boolean;
}

const PhoneNumberInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = '',
  inputClass = '',
  containerClass = '',
  required = false,
  ...props
}) => {
  const { isRTL } = useLanguage();
  const [selectedCountry, setSelectedCountry] = useState('eg');

  // Load saved country from localStorage on component mount
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      setSelectedCountry(savedCountry);
    }
  }, []);

  const handleChange = (phone: string, country: any) => {
    if (country && country.countryCode) {
      // Save the selected country to localStorage
      localStorage.setItem('selectedCountry', country.countryCode.toLowerCase());
      setSelectedCountry(country.countryCode.toLowerCase());
    }
    // Format the phone number with country code
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    onChange(formattedPhone);
  };

  // Filter out our custom props before passing to the base component
  const baseProps = {
    ...props,
    label: undefined,
    error: undefined,
    inputClass: undefined,
    containerClass: undefined,
    required: undefined
  };

  return (
    <div className={`space-y-1 ${containerClass}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <PhoneInputBase
          country={selectedCountry} // Use the selected country from state
          onlyCountries={['eg', 'sa', 'ae', 'jo', 'kw', 'qa', 'bh', 'om', 'iq', 'ps', 'lb', 'sy', 'ye', 'sd', 'ma', 'dz', 'tn', 'ly', 'mr', 'so', 'dj', 'km']}
          countryCodeEditable={false}
          enableSearch
          disableSearchIcon
          searchPlaceholder="Search country..."
          searchNotFound="No country found"
          placeholder=" "
          value={value}
          onChange={handleChange}
          inputClass={`w-full rounded-md border border-gray-300 py-2 pl-14 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm ${inputClass}`}
          containerClass={`${className}`}
          inputStyle={{
            width: '100%',
            height: '40px',
            paddingLeft: '60px',
            paddingRight: '12px',
            direction: isRTL ? 'rtl' : 'ltr',
            textAlign: isRTL ? 'right' : 'left',
          }}
          buttonStyle={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '0 0 0 12px',
          }}
          dropdownStyle={{
            width: '300px',
            marginTop: '4px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          }}
          searchStyle={{
            width: '100%',
            padding: '8px 12px',
            margin: '0',
            border: '1px solid #e5e7eb',
            borderWidth: '0 0 1px 0',
            borderRadius: '8px 8px 0 0',
          }}
          disabled={disabled}
          enableAreaCodes={false}
          autoFormat={true}
          {...baseProps}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PhoneNumberInput;
