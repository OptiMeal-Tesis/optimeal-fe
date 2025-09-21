import { useState } from "react";
import { TextField, Box, InputAdornment } from "@mui/material";
import { styled } from "@mui/material/styles";
import CartIcon from "../assets/icons/CartIcon";
import ClockIcon from "../assets/icons/ClockIcon";

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    fontSize: '16px',
    fontFamily: 'var(--font-family-sans)',
    '& fieldset': {
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: 'var(--color-primary-500)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--color-primary-500)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 14px',
    fontSize: '16px',
    fontFamily: 'var(--font-family-sans) !important',
    // Hide native time picker icon
    '&::-webkit-calendar-picker-indicator': {
      display: 'none',
    },
    '&::-webkit-inner-spin-button': {
      display: 'none',
    },
    '&::-webkit-outer-spin-button': {
      display: 'none',
    },
  },
}));

interface CheckoutSummaryProps {
  subtotal: number;
  isDisabled: boolean;
  onCheckout: () => void;
  pickupTime: string;
  onPickupTimeChange: (time: string) => void;
  isTimeValid: boolean;
  className?: string;
}   

export default function CheckoutSummary({ 
  subtotal,
  isDisabled, 
  onCheckout,
  pickupTime,
  onPickupTimeChange,
  isTimeValid,
  className = "" 
}: CheckoutSummaryProps) {
  const handlePickupTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPickupTimeChange(e.target.value);
  };

  return (
    <div className={`fixed left-4 right-4 bottom-4 z-50 rounded-xl overflow-hidden ${className}`}>
      {/* Pickup time input */}
      <div className={`px-6 py-4 bg-white ${isDisabled ? "border-2 border-gray-200 border-b-0" : "border-2 border-primary-500 border-b-0"} rounded-t-xl`}>
        <h3 className="text-body1 text-primary-500 mb-2.5">Horario de retiro</h3>
        <Box sx={{ width: '100%' }}>
          <StyledTextField
            type="time"
            value={pickupTime}
            onChange={handlePickupTimeChange}
            fullWidth
            variant="outlined"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <ClockIcon 
                      width={20} 
                      height={20} 
                      color={isTimeValid ? 'var(--color-primary-500)' : 'var(--color-error)'}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '& fieldset': {
                  borderColor: isTimeValid ? 'var(--color-primary-500)' : 'var(--color-error)',
                },

                '&.Mui-focused fieldset': {
                  borderColor: 'var(--color-primary-400)',
                },
              },
              '& .MuiInputBase-input': {
                color: isTimeValid ? 'var(--color-primary-500)' : 'var(--color-error)',
                paddingRight: '40px'
              },
            }}
          />
        </Box>
      </div>

      {/* Subtotal and Pay Button */}
      <div className={`px-6 py-4 ${isDisabled ? "bg-gray-200 border-2 border-gray-200" : "bg-primary-500 border-2 border-primary-500"} rounded-b-xl flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <CartIcon width={24} height={25} color={!isDisabled ? "white" : "black"} />
          <div className="flex flex-col gap-1">
            <span className={`text-body1 ${!isDisabled ? "text-white" : "text-black"}`}>Subtotal</span>
            <span className={`text-body1 ${!isDisabled ? "text-white" : "text-black"}`}>
              {new Intl.NumberFormat("es-AR", { 
                style: "currency", 
                currency: "ARS", 
                maximumFractionDigits: 0 
              }).format(subtotal)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          disabled={isDisabled}
          className={`py-3 rounded-lg text-sub1-bold ${
            !isDisabled 
              ? 'text-white' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          aria-disabled={isDisabled}
        >
          Pagar
        </button>
      </div>
    </div>
  );
}
