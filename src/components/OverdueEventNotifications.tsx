import { FiAlertCircle, FiX } from 'react-icons/fi';
import { Event } from '@/lib/firebaseData';

interface OverdueEventNotificationsProps {
  events: Event[];
  onDismiss: (eventId: string) => void;
}

export function OverdueEventNotifications({ events, onDismiss }: OverdueEventNotificationsProps) {
  if (events.length === 0) return null;
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="mb-4 space-y-2">
      {events.map(event => (
        <div 
          key={event.id} 
          className="bg-pink-100 border border-pink-300 rounded-xl p-3 shadow-sm flex items-center justify-between"
        >
          <div className="flex items-center">
            <FiAlertCircle className="text-pink-600 mr-2 flex-shrink-0" size={20} />
            <div>
              <p className="text-pink-800 font-medium">
                {formatDate(event.date)} {event.time}開始の{event.team}の撮影報告をお忘れですか？
              </p>
              <p className="text-pink-600 text-sm">今すぐ撮影報告をしてください！</p>
            </div>
          </div>
          <button 
            onClick={() => onDismiss(event.id)}
            className="bg-pink-200 hover:bg-pink-300 text-pink-800 p-1.5 rounded-full"
          >
            <FiX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
} 