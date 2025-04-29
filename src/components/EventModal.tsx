import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Event, Team, addEvent, generateId, getTeams, updateEvent } from '@/lib/firebaseData';
import { FiClock, FiUsers, FiCalendar, FiArrowRight, FiAlertCircle } from 'react-icons/fi';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  onEventAdded?: (event: Event) => void;
  onEventUpdated?: (event: Event) => void;
  existingEvent?: Event;
}

export function EventModal({
  isOpen,
  onClose,
  selectedDate,
  onEventAdded,
  onEventUpdated,
  existingEvent,
}: EventModalProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team, setTeam] = useState(existingEvent?.team || '');
  const [startTime, setStartTime] = useState(existingEvent?.time || '09:00');
  const [endTime, setEndTime] = useState(existingEvent?.endTime || '11:00');
  const [timeError, setTimeError] = useState<string | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const teamsData = await getTeams();
      setTeams(teamsData);
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    validateTimeRange();
  }, [startTime, endTime]);

  const validateTimeRange = () => {
    const minTime = '06:00';
    const maxTime = '24:00';
    
    if (startTime < minTime) {
      setTimeError('開始時間は6:00以降に設定してください');
      return false;
    }
    
    if (endTime > maxTime) {
      setTimeError('終了時間は24:00までに設定してください');
      return false;
    }
    
    if (startTime >= endTime) {
      setTimeError('開始時間は終了時間より前に設定してください');
      return false;
    }
    
    setTimeError(null);
    return true;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!team) return;
    
    if (!validateTimeRange()) {
      return;
    }
    
    if (existingEvent) {
      const updatedEvent = {
        ...existingEvent,
        team,
        time: startTime,
        endTime
      };
      updateEvent(updatedEvent);
      onEventUpdated?.(updatedEvent);
    } else {
      const newEvent = {
        id: generateId(),
        date: selectedDate || new Date().toISOString().split('T')[0],
        time: startTime,
        endTime,
        team,
        status: 'reserved' as const,
      };
      addEvent(newEvent);
      onEventAdded?.(newEvent);
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiCalendar className="mr-2" />
          {existingEvent ? '予約編集' : 'カメラ予約登録'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUsers className="mr-1" />
              班名
            </label>
            <select
              id="team"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">班を選択</option>
              {teams.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiClock className="mr-1" />
              利用時間 <span className="text-xs text-gray-500 ml-1">(6:00〜24:00)</span>
            </label>
            <div className="flex items-center">
              <input
                type="time"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                min="06:00"
                max="24:00"
                className={`w-full px-3 py-2 border ${timeError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
              <FiArrowRight className="mx-2 text-gray-500" />
              <input
                type="time"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min="06:00"
                max="24:00"
                className={`w-full px-3 py-2 border ${timeError ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>
            {timeError && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <FiAlertCircle className="mr-1" />
                {timeError}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={!!timeError}>
              {existingEvent ? '更新' : '登録'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 