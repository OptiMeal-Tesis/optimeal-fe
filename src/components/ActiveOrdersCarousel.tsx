import React, { useState, useRef, useEffect } from 'react';
import { OrderResponse } from '../services/api';
import ActiveOrderCard from './ActiveOrderCard';

interface ActiveOrdersCarouselProps {
  orders: OrderResponse[];
  onOrderClick: (orderId: number) => void;
  className?: string;
}

export default function ActiveOrdersCarousel({ orders, onOrderClick, className = "" }: ActiveOrdersCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextOrder = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % orders.length);
  };

  const prevOrder = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + orders.length) % orders.length);
  };

  const goToOrder = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touchX = e.touches[0].clientX;
    const diffX = touchX - startX;
    setCurrentX(touchX);
    setTranslateX(diffX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const diffX = currentX - startX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        // Swipe right - go to previous
        prevOrder();
      } else {
        // Swipe left - go to next
        nextOrder();
      }
    }
    
    setTranslateX(0);
  };

  // Mouse event handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const mouseX = e.clientX;
    const diffX = mouseX - startX;
    setCurrentX(mouseX);
    setTranslateX(diffX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const diffX = currentX - startX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        prevOrder();
      } else {
        nextOrder();
      }
    }
    
    setTranslateX(0);
  };

  // Reset translateX when currentIndex changes
  useEffect(() => {
    setTranslateX(0);
  }, [currentIndex]);

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
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div 
        ref={carouselRef}
        className="relative overflow-hidden select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div 
          className={`flex ${!isDragging ? 'transition-transform duration-300 ease-in-out' : ''}`}
          style={{ 
            transform: `translateX(calc(-${currentIndex * 100}% + ${translateX}px))` 
          }}
        >
          {orders.map((order, index) => (
            <div key={order.id} className="w-full flex-shrink-0">
              <ActiveOrderCard
                order={order}
                onClick={() => !isDragging && onOrderClick(order.id)}
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
            onClick={() => goToOrder(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex 
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
