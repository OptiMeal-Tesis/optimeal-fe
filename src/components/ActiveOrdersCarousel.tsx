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
      <div className="-mx-4 -mt-4 relative">
        <div 
          className="bg-primary-500 px-4 pt-4 pb-8"
          style={{
            borderBottomLeftRadius: '50% 30px',
            borderBottomRightRadius: '50% 30px'
          }}
        >
          <ActiveOrderCard
            order={orders[0]}
            onClick={() => onOrderClick(orders[0].id)}
            className={className}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-4 relative">
      <div 
        className="bg-primary-500 p-4 flex flex-col gap-2"
        style={{
          borderBottomLeftRadius: '50% 30px',
          borderBottomRightRadius: '50% 30px'
        }}
      >
        <div className="overflow-hidden" ref={emblaRef}>
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
        <div className="flex justify-center space-x-2">
          {orders.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === selectedIndex 
                  ? 'bg-white' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
              aria-label={`Go to order ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
