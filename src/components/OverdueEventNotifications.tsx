import { useState, useEffect } from 'react';
import { FiAlertCircle, FiX, FiChevronLeft, FiChevronRight, FiClock } from 'react-icons/fi';
import { Event } from '@/lib/firebaseData';

interface OverdueEventNotificationsProps {
  events: Event[];
  onDismiss: (eventId: string) => void;
}

export function OverdueEventNotifications({ events, onDismiss }: OverdueEventNotificationsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (events.length === 0) return;
    if (activeIndex >= events.length) {
      setActiveIndex(events.length - 1);
    }
  }, [events, activeIndex]);
  
  if (events.length === 0) return null;
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const handlePrev = () => {
    setActiveIndex(current => (current > 0 ? current - 1 : events.length - 1));
  };
  
  const handleNext = () => {
    setActiveIndex(current => (current < events.length - 1 ? current + 1 : 0));
  };
  
  const currentIndex = Math.min(activeIndex, events.length - 1);
  const currentEvent = events[currentIndex];
  
  if (!currentEvent) return null;
  
  return (
    <div className="mb-3">
      <div className="bg-pink-100 border border-pink-300 rounded-lg py-2 px-3 shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center">
            <FiAlertCircle className="text-pink-600 mr-1.5" size={16} />
            <h3 className="font-medium text-pink-800 text-sm">
              未完了の撮影報告
              {events.length > 1 && (
                <span className="ml-1.5 inline-flex items-center justify-center bg-pink-500 text-white text-xs font-medium rounded-full h-4 min-w-4 px-1">
                  {events.length}
                </span>
              )}
            </h3>
          </div>
          
          {events.length > 1 && (
            <div className="flex items-center space-x-1 text-pink-700">
              <button 
                onClick={handlePrev}
                className="p-0.5 hover:bg-pink-200 rounded-full transition-colors"
                aria-label="前の通知"
              >
                <FiChevronLeft size={14} />
              </button>
              <span className="text-xs">{currentIndex + 1}/{events.length}</span>
              <button 
                onClick={handleNext}
                className="p-0.5 hover:bg-pink-200 rounded-full transition-colors"
                aria-label="次の通知"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
        
        <div className="relative bg-white rounded-md p-2 border border-pink-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center text-xs text-pink-900">
                <FiClock className="mr-1 flex-shrink-0" size={12} />
                <span className="truncate">{formatDate(currentEvent.date)} {currentEvent.time}開始</span>
              </div>
              <p className="text-pink-800 font-medium text-sm mt-0.5 truncate">
                {currentEvent.team}の撮影報告をお忘れですか？
              </p>
              <p className="text-pink-600 text-xs mt-0.5">
                今すぐ報告してください！
              </p>
            </div>
            <button 
              onClick={() => onDismiss(currentEvent.id)}
              className="bg-pink-200 hover:bg-pink-300 text-pink-800 p-1 rounded-full ml-1.5 flex-shrink-0"
              aria-label="通知を閉じる"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
        
        {events.length > 1 && (
          <div className="mt-1.5 flex justify-center">
            {events.map((_, index) => (
              <button
                key={index}
                className={`mx-0.5 rounded-full ${
                  index === currentIndex 
                    ? 'w-1.5 h-1.5 bg-pink-500' 
                    : 'w-1 h-1 bg-pink-300 hover:bg-pink-400'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`通知 ${index + 1} に切り替え`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 