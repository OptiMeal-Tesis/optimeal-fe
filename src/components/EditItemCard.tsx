import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box,
  InputLabel,
} from '@mui/material';
import RestrictionChip from './RestrictionChip';
import QuantityControl from './QuantityControl';
import CustomButton from './CustomButton';
import { Side, Restriction } from '../services/api';
import CustomTextField from './CustomTextField';

export type EditItemCardProps = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  photo?: string | null;
  description?: string;
  sides?: Side[];
  restrictions?: Restriction[];
  clarifications?: string;
  selectedSide?: string | null;
  admitsClarifications?: boolean;
  type?: "FOOD" | "BEVERAGE" | string;
  stock?: number;
  isEditingExistingItem?: boolean; // New prop to indicate if editing existing item
  onEdit: (payload: {
    productId: string;
    quantity: number;
    selectedSideId: string | null;
    clarifications: string | null;
  }) => void;
  isSaving?: boolean;
  className?: string;
};


export default function EditItemCard({
  productId,
  name,
  price,
  quantity: initialQuantity,
  photo,
  description,
  sides = [],
  restrictions = [],
  clarifications: initialClarifications = "",
  selectedSide: initialSelectedSide = null,
  admitsClarifications,
  type,
  stock,
  isEditingExistingItem = false,
  onEdit,
  isSaving = false,
  className = ""
}: EditItemCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [selectedSideId, setSelectedSideId] = useState<string | null>(initialSelectedSide);
  const [clarifications, setClarifications] = useState(initialClarifications);

  // Reset state when props change
  useEffect(() => {
    if (!isEditingExistingItem) {
      setQuantity(initialQuantity);
      setSelectedSideId(initialSelectedSide);
      setClarifications(initialClarifications);
    }
  }, [initialQuantity, initialSelectedSide, initialClarifications, isEditingExistingItem]);

  const peso = new Intl.NumberFormat("es-AR", { 
    style: "currency", 
    currency: "ARS", 
    maximumFractionDigits: 0 
  });

  // Check if there are any changes from initial values
  const hasChanges = quantity !== initialQuantity || 
    selectedSideId !== initialSelectedSide || 
    clarifications !== initialClarifications;

  // Validation logic
  const hasActiveSides = sides.some(s => s.isActive);
  const sideIsRequired = type === "FOOD" && hasActiveSides;
  const isOutOfStock = stock === 0;
  
  // Save button should be disabled if:
  // 1. No changes have been made, OR
  // 2. Required side is missing
  const isSaveDisabled = !hasChanges || 
    (sideIsRequired && !selectedSideId);

  const handleQuantityIncrease = () => {
    if (quantity < 99 && !isOutOfStock && quantity < (stock || 0)) {
      setQuantity(prev => prev + 1);
    } else if (isOutOfStock) {
      return;
    }
  };

  const handleQuantityDecrease = () => {
    if (quantity > 0) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleSideChange = (event: any) => {
    const value = event.target.value;
    setSelectedSideId(value || null);
  };

  const handleClarificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= 200) {
      setClarifications(value);
    }
  };

  const handleSave = () => {
    if (!isSaveDisabled) {
      onEdit({
        productId,
        quantity,
        selectedSideId,
        clarifications: clarifications.trim() || null
      });
    }
  };


  return (
    <Card sx={{ borderRadius: '12px' }}>
      {/* Product Image */}
      <Box sx={{ width: '100%', height: 192, position: 'relative' }}>
        {photo ? (
          <img
            src={photo}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            loading="lazy"
            onError={(e) => {
              // Fallback to placeholder
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'grey.400'
            }}
          >
          </Box>
        )}
      </Box>

      <CardContent className='flex flex-col gap-5'>
        {/* Title and Price */}
        <div className='flex flex-col gap-3'>
          <div className="flex items-center justify-between">
            <h1 className="text-body1 text-black flex-1">{name}</h1>
            <span className="text-body2-bold text-black">
              {peso.format(price)}
            </span>
          </div>

          {/* Description */}
          <p className="text-body2 text-gray-600">
            {description}
          </p>
        </div>
        
        {/* Restriction Chips */}
        {restrictions.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <div className="w-full flex items-center gap-3 overflow-x-auto scrollbar-hide">
              {restrictions.map((restriction) => (
                <RestrictionChip 
                  key={restriction} 
                  restriction={restriction} 
                />
              ))}
            </div>
          </Box>
        )}

        {/* Side Selection */}
        {hasActiveSides && (
          <FormControl fullWidth>
            <InputLabel 
              sx={{ 
                color: 'var(--color-primary-500)',
                '&.Mui-focused': {
                  color: 'var(--color-primary-500)'
                },
                font: 'var(--font-family-sans)',
                fontSize: 'var(--font-size-body1)',
              }}
            >Guarnición
            </InputLabel>
            <Select
              value={selectedSideId || ""}
              onChange={handleSideChange}
              label="Guarnición"
              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      font: 'var(--font-family-sans)',
                      fontSize: 'var(--font-size-body1)'
                    }
                  }
                }
              }}
              sx={{
                borderRadius: '12px',
                font: 'var(--font-family-sans)',
                fontSize: 'var(--font-size-body1)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary-500)',
                  borderWidth: 2,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary-500)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'var(--color-primary-500)'
                }
              }}
            > 
              {sides
                .filter(side => side.isActive)
                .map(side => (
                  <MenuItem className='text-body1' key={side.id} value={side.id}>
                    {side.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}

        {/* Clarifications */}
        {admitsClarifications && (
          <Box>
            <CustomTextField
              fullWidth
              label="Aclaraciones"
              value={clarifications}
              onChange={handleClarificationsChange}
              placeholder="Aclaraciones para la cocina"
              variant="outlined"
              inputProps={{ maxLength: 100 }}
              sx={{
                font: 'var(--font-family-sans)',
                fontSize: 'var(--font-size-body1)',
                '& .MuiInputLabel-root': {
                  color: 'var(--color-primary-500)',
                  '&.Mui-focused': {
                    color: 'var(--color-primary-500)'
                  },
                  font: 'var(--font-family-sans)',
                  fontSize: 'var(--font-size-body1)',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  borderColor: 'var(--color-primary-500)',
                  '& fieldset': {
                    borderColor: 'var(--color-primary-500)',
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: 'var(--color-primary-500)'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--color-primary-500)'
                  }
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Typography 
                variant="caption" 
                sx={{ color: 'var(--color-gray-500)', font: 'var(--font-family-sans)', fontSize: 'var(--font-size-label)', mt: 1}}
              >
                Se leerán tus aclaraciones, sujetas a disponibilidades.
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ color: 'var(--color-gray-500)', font: 'var(--font-family-sans)', fontSize: 'var(--font-size-label)' }}
              >
                {clarifications.length}/100
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{width: '100%', padding: '16px'}}>
        <div className="w-full flex flex-col gap-4">
          {/* Quantity Control */}
          <div className="flex items-center justify-between">
            <span className="text-body1 text-gray-700">Cantidad:</span>
            <QuantityControl
              quantity={quantity}
              onDecrease={handleQuantityDecrease}
              onIncrease={handleQuantityIncrease}
              disabled={stock === 0}
            />
          </div>
          
          <CustomButton
            onClick={handleSave}
            variant='contained'
            size='large'
            loading={isSaving}
            disabled={isSaveDisabled && !isSaving}
            className="w-full py-11 rounded-lg text-sub1-bold"
            aria-label={isEditingExistingItem ? "Guardar cambios" : "Agregar al carrito"}
          >
            {isSaving 
              ? (isEditingExistingItem ? "Guardando..." : "Agregando...") 
              : (isEditingExistingItem ? "Guardar cambios" : "Agregar al carrito")
            }
          </CustomButton>
        </div>
      </CardActions>
    </Card>
  );
}
