import { Box, InputAdornment, Select, MenuItem, FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";
import CartIcon from "../assets/icons/CartIcon";
import ClockIcon from "../assets/icons/ClockIcon";

const StyledSelect = styled(Select)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px !important',
    fontSize: '16px',
    fontFamily: 'var(--font-family-sans)',
    '& fieldset': {
      borderWidth: '2px !important',
    },
    '&:hover fieldset': {
      borderWidth: '2px !important',
      borderColor: 'var(--color-primary-500)',
    },
    '&.Mui-focused fieldset': {
      borderWidth: '2px !important',
      borderColor: 'var(--color-primary-500)',
    },
  },
  '& .MuiSelect-select': {
    padding: '12px 14px',
    fontSize: '16px',
    fontFamily: 'var(--font-family-sans) !important',
  },
  // In order to hide the default dropdown chevron
  '& .MuiSelect-icon': {
    display: 'none',
  },
}));

interface CheckoutSummaryProps {
  subtotal: number;
  isDisabled: boolean;
  onCheckout: () => void;
  selectedShift: string;
  onShiftChange: (shift: string) => void;
  isShiftValid: boolean;
  isLoading?: boolean;
  className?: string;
  shifts: string[];
  shiftsLoading: boolean;
  shiftsError: string | null;
}   

export default function CheckoutSummary({ 
  subtotal,
  isDisabled, 
  onCheckout,
  selectedShift,
  onShiftChange,
  isShiftValid,
  isLoading = false,
  className = "",
  shifts,
  shiftsLoading,
  shiftsError
}: CheckoutSummaryProps) {
  const handleShiftChange = (event: any) => {
    onShiftChange(event.target.value);
  };

  return (
    <div className={`fixed left-4 right-4 bottom-4 z-50 overflow-hidden ${className}`}>
      {/* Pickup shift selection */}
      <div className={`px-6 py-4 bg-white ${isDisabled ? "border-2 border-gray-200 border-b-0" : "border-2 border-primary-500 border-b-0"} rounded-t-xl`}>
        <h3 className="text-body1 text-primary-500 mb-2.5">Horario de retiro</h3>
        <Box sx={{ width: '100%' }}>
          {shiftsLoading ? (
            <div className="flex items-center justify-center py-4">
              <p className="text-body1 text-gray-500">Cargando horarios...</p>
            </div>
          ) : shiftsError ? (
            <div className="flex items-center justify-center py-4">
              <p className="text-body1 text-error">{shiftsError}</p>
            </div>
          ) : (
            <FormControl fullWidth>
              <StyledSelect
                value={selectedShift}
                onChange={handleShiftChange}
                displayEmpty
                endAdornment={
                  <InputAdornment position="end">
                    <ClockIcon 
                      width={20} 
                      height={20} 
                      color={isShiftValid ? 'var(--color-primary-500)' : 'var(--color-error)'}
                    />
                  </InputAdornment>
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: '12px',
                      marginTop: '4px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      '& .MuiMenuItem-root': {
                        fontFamily: 'var(--font-family-sans)',
                        fontSize: '16px',
                        padding: '12px 16px',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary-50)',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'var(--color-primary-100)',
                          '&:hover': {
                            backgroundColor: 'var(--color-primary-200)',
                          },
                        },
                      },
                    },
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '12px !important',
                    '& fieldset': {
                      borderWidth: '2px !important',
                      borderColor: isShiftValid ? 'var(--color-primary-500)' : 'var(--color-error)',
                    },
                    '&:hover fieldset': {
                      borderWidth: '2px !important',
                      borderColor: isShiftValid ? 'var(--color-primary-500)' : 'var(--color-error)',
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: '2px !important',
                      borderColor: 'var(--color-primary-500)',
                    },
                  },
                  '& .MuiSelect-select': {
                    color: isShiftValid ? 'var(--color-primary-500)' : 'var(--color-error)',
                    paddingRight: '40px'
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Selecciona un horario</em>
                </MenuItem>
                {shifts
                  .filter(shift => shift.toLowerCase() !== 'all')
                  .map((shift) => (
                    <MenuItem key={shift} value={shift}>
                      {shift}
                    </MenuItem>
                  ))}
              </StyledSelect>
              {!isShiftValid && (
                <p className="text-error text-xs mt-1 ml-0" style={{ fontFamily: 'var(--font-family-sans)' }}>
                  Por favor selecciona un horario de retiro
                </p>
              )}
            </FormControl>
          )}
        </Box>
      </div>

      {/* Subtotal and Pay Button */}
      <button
        type="button"
        onClick={onCheckout}
        disabled={isDisabled}
        className={`w-full px-6 py-4 ${isDisabled ? "bg-gray-200 border-2 border-gray-200" : "bg-primary-500 border-2 border-primary-500"} flex items-center justify-between ${
          !isDisabled ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
        style={{
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }}
        aria-disabled={isDisabled}
      >
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

        <span className={`text-sub1-bold ${
          !isDisabled 
            ? 'text-white' 
            : 'text-gray-400'
        }`}>
          {isLoading ? 'Procesando...' : 'Pagar'}
        </span>
      </button>
    </div>
  );
}
