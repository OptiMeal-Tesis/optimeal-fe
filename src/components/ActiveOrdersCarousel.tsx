import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { OrderResponse } from '../services/api';
import ActiveOrderCard from './ActiveOrderCard';

interface ActiveOrdersCarouselProps {
  orders: OrderResponse[];
  onOrderClick: (orderId: number) => void;
  className?: string;
}

export default function ActiveOrdersCarousel({ orders, onOrderClick, className = "" }: ActiveOrdersCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (orders.length === 0) return null;

  if (orders.length === 1) {
    return (
      <ActiveOrderCard
        order={orders[0]}
        onClick={() => onOrderClick(orders[0].id)}
        className={className}
      />
    );
  }

  return (
    <div>
      <div className="overflow-hidden mr-[3p]" ref={emblaRef}>
        <div className="flex gap-2">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="flex-shrink-0 flex-grow-0"
              style={{ width: '95%' }}
            >
              <ActiveOrderCard
                order={order}
                onClick={() => onOrderClick(order.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-3 space-x-2">
        {orders.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === selectedIndex 
                ? 'bg-primary-500' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to order ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
