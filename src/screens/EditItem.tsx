import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../cart';
import { generateCartItemKey } from '../cart/cart';
import PageHeader from '../components/PageHeader';
import EditItemCard from '../components/EditItemCard';
import { Product } from '../services/api';
import { CartItem } from '../cart/cart';
import { apiService } from '../services/api';
import CustomButton from '../components/CustomButton';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export default function CheckoutEditItemPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, updateItem, addItem, remove } = useCart();
  
  // Get itemKey from URL params
  const searchParams = new URLSearchParams(location.search);
  const itemKey = searchParams.get('itemKey');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null
  });

  // Simple logic: if itemKey exists, we're editing; if not, we're adding new
  const isEditingExistingItem = !!itemKey;
  const finalCartItem = itemKey ? items[itemKey] : undefined;
  
  console.log('EditItem debug:', {
    productId,
    itemKey,
    isEditingExistingItem,
    finalCartItem,
    allItems: Object.keys(items)
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoadingState({ isLoading: false, error: 'Product ID not provided' });
        return;
      }

      try {
        setLoadingState({ isLoading: true, error: null });
        const response = await apiService.getProductById(productId);
        setProduct(response.data);
        setLoadingState({ isLoading: false, error: null });
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoadingState({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : 'Error loading product' 
        });
      }
    };

    fetchProduct();
  }, [productId]);

  const handleEdit = (payload: {
    productId: string;
    quantity: number;
    selectedSideId: string | null;
    clarifications: string | null;
  }) => {
    if (!product) return;

    if (payload.quantity === 0) {
      // Remove item from cart if quantity is 0
      if (itemKey) {
        remove(itemKey);
      }
    } else {
      // Create cart item data
      const cartItemData = {
        productId: payload.productId.toString(),
        quantity: payload.quantity,
        price: product.price,
        name: product.name,
        photo: product.photo,
        sides: product.sides,
        selectedSide: payload.selectedSideId ? payload.selectedSideId.toString() : null,
        clarifications: payload.clarifications,
        stock: product.stock
      };

      if (isEditingExistingItem && itemKey) {
        // If editing existing item, remove old and add new
        remove(itemKey);
      }
      
      // Add the new/updated item
      addItem(cartItemData);
    }

    navigate('/checkout');
  };

  // Skeleton
  if (loadingState.isLoading) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Editar ítem" />
        <div className="p-4">
          <div className="bg-white rounded-xl overflow-hidden">
            {/* Image skeleton */}
            <div className="w-full h-48 bg-gray-200 animate-pulse" />
            
            {/* Content skeleton */}
            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse" />
              </div>
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-20 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadingState.error || !product) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Error" />
        <div className="p-4">
          <div className="rounded-xl p-6 text-center gap-10">
            <h2 className="text-sub1 text-primary-500">Hubo un error al cargar esta página</h2>
            <p className="text-body1 text-gray-600">
              {loadingState.error}
            </p>
            <CustomButton
              onClick={() => navigate('/checkout')}
              className="p-10 bg-primary-500 text-white rounded-lg"
            >
              Volver al checkout
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  // Success - Render detailed edit item card
  return (
    <div className="min-h-screen">
      <PageHeader title={product.name} />
      
      <div className="p-4">
        <EditItemCard
          productId={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          quantity={finalCartItem?.quantity ?? 1}
          photo={product.photo}
          sides={product.sides}
          restrictions={product.restrictions}
          clarifications={finalCartItem?.clarifications ?? ""}
          selectedSide={finalCartItem?.selectedSide || null}
          admitsClarifications={product.admitsClarifications}
          type={product.type}
          stock={product.stock}
          isEditingExistingItem={isEditingExistingItem}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
