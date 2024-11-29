import React, { useState } from 'react';
import { UseFormWatch, UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormSchemaType } from '@/types/type';
import { EyeOff, Eye } from 'lucide-react';

interface StepProps {
  register: UseFormRegister<FormSchemaType>;
  errors: FieldErrors<FormSchemaType>;
  watch: UseFormWatch<FormSchemaType>;
  onPreferenceChange: (key: keyof FormSchemaType['preferences']) => void;
}

export const Step1: React.FC<StepProps> = ({ register, errors }) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPassword1, setShowPassword1] = useState<boolean>(false)
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="john.doe@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register('phoneNumber')}
          placeholder="(123) 456-7890"
        />
        {errors.phoneNumber && (
          <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <div className='relative'>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className='relative'>
          <Input
          id="confirmPassword"
          type={showPassword1 ? "text" : "password"}
          {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowPassword1(!showPassword1)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword1 ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
        )}
      </div>
    </div>
  )
};

export const Step2: React.FC<StepProps> = ({ register, errors }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="street">Street Address</Label>
      <Input
        id="street"
        {...register('address.street')}
        placeholder="123 Main St"
      />
      {errors.address?.street && (
        <p className="text-sm text-red-500 mt-1">{errors.address.street.message}</p>
      )}
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          {...register('address.city')}
          placeholder="City"
        />
        {errors.address?.city && (
          <p className="text-sm text-red-500 mt-1">{errors.address.city.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          {...register('address.state')}
          placeholder="State"
        />
        {errors.address?.state && (
          <p className="text-sm text-red-500 mt-1">{errors.address.state.message}</p>
        )}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="zipCode">ZIP Code</Label>
        <Input
          id="zipCode"
          {...register('address.zipCode')}
          placeholder="12345"
        />
        {errors.address?.zipCode && (
          <p className="text-sm text-red-500 mt-1">{errors.address.zipCode.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          {...register('address.country')}
          placeholder="Country"
        />
        {errors.address?.country && (
          <p className="text-sm text-red-500 mt-1">{errors.address.country.message}</p>
        )}
      </div>
    </div>
  </div>
);

export const Step3: React.FC<StepProps> = ({ watch, onPreferenceChange }) => (
  <div className="space-y-6">
    <div className="space-y-4">
      <Label className="text-lg font-medium">Communication Preferences</Label>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="notifications"
            checked={watch('preferences.notifications')}
            onCheckedChange={() => onPreferenceChange('notifications')}
          />
          <Label htmlFor="notifications" className="text-sm text-gray-600">
            Receive general notifications about shelter events and news
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="emailUpdates"
            checked={watch('preferences.emailUpdates')}
            onCheckedChange={() => onPreferenceChange('emailUpdates')}
          />
          <Label htmlFor="emailUpdates" className="text-sm text-gray-600">
            Receive email updates about new pets and adoption opportunities
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="smsAlerts"
            checked={watch('preferences.smsAlerts')}
            onCheckedChange={() => onPreferenceChange('smsAlerts')}
          />
          <Label htmlFor="smsAlerts" className="text-sm text-gray-600">
            Receive SMS alerts for urgent updates and matches
          </Label>
        </div>
      </div>
    </div>
  </div>
);