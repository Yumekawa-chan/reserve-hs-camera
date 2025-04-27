import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Event, updateEvent } from '@/lib/firebaseData';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { ReportModal } from './ReportModal';
import { FiCalendar, FiClock, FiUsers, FiTarget, FiCamera, FiFileText, FiCheckCircle, FiPlay, FiX } from 'react-icons/fi';

interface EventDetailsProps {
  event: Event;
  onEventUpdated?: (event: Event) => void;
  onClose: () => void;
}

export function EventDetails({ event, onEventUpdated, onClose }: EventDetailsProps) {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const startUsing = async () => {
    try {
      setIsUpdating(true);
      const updatedEvent = {
        ...event,
        status: 'in-use' as const,
      };
      const result = await updateEvent(updatedEvent);
      if (result) {
        onEventUpdated?.(updatedEvent);
      } else {
        throw new Error('イベントの更新に失敗しました');
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('イベントの状態を更新できませんでした。管理者に連絡してください。');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleReportComplete = () => {
    setIsReportModalOpen(true);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold">{event.team}</h2>
        <StatusBadge status={event.status} />
      </div>
      
      <div className="space-y-3 mb-6">
        <div>
          <p className="text-sm text-gray-500 flex items-center">
            <FiCalendar className="mr-1" />
            日付
          </p>
          <p className="font-medium">{formatDate(event.date)}</p>
        </div>
        
        {event.time && (
          <div>
            <p className="text-sm text-gray-500 flex items-center">
              <FiClock className="mr-1" />
              利用時間
            </p>
            <p className="font-medium">
              {event.time} {event.endTime && `〜 ${event.endTime}`}
            </p>
          </div>
        )}
        
        <div>
          <p className="text-sm text-gray-500 flex items-center">
            <FiUsers className="mr-1" />
            班名
          </p>
          <p className="font-medium">{event.team}</p>
        </div>
        
        {event.status === 'completed' && (
          <>
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <FiUsers className="mr-1" />
                参加者
              </p>
              <p className="font-medium">{event.participants || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <FiTarget className="mr-1" />
                撮影対象
              </p>
              <p className="font-medium">{event.target || '-'}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <FiCamera className="mr-1" />
                撮影枚数
              </p>
              <p className="font-medium">{event.shots || '-'}</p>
            </div>
            
            {event.notes && (
              <div>
                <p className="text-sm text-gray-500 flex items-center">
                  <FiFileText className="mr-1" />
                  備考
                </p>
                <p className="font-medium whitespace-pre-line">{event.notes}</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          variant="outline" 
          onClick={onClose}
          className="flex items-center"
        >
          <FiX className="mr-1" />
          閉じる
        </Button>
        
        {event.status === 'reserved' && (
          <Button 
            variant="primary" 
            onClick={startUsing}
            className="flex items-center"
            disabled={isUpdating}
          >
            <FiPlay className="mr-1" />
            {isUpdating ? '処理中...' : '使用開始'}
          </Button>
        )}
        
        {event.status === 'in-use' && (
          <Button 
            variant="success" 
            onClick={handleReportComplete}
            className="flex items-center"
          >
            <FiCheckCircle className="mr-1" />
            使用完了
          </Button>
        )}
      </div>
      
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        event={event}
        onEventUpdated={onEventUpdated}
      />
    </div>
  );
} 