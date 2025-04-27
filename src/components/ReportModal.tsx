import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Event, Team, TeamMember, getTeamByName, updateEvent } from '@/lib/mockData';
import { FiUser, FiUsers, FiTarget, FiCamera, FiFileText, FiCheckCircle } from 'react-icons/fi';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onEventUpdated?: (event: Event) => void;
}

export function ReportModal({
  isOpen,
  onClose,
  event,
  onEventUpdated,
}: ReportModalProps) {
  const [participants, setParticipants] = useState(event.participants || '');
  const [target, setTarget] = useState(event.target || '');
  const [shots, setShots] = useState(event.shots?.toString() || '');
  const [notes, setNotes] = useState(event.notes || '');
  const [teamData, setTeamData] = useState<Team | undefined>(undefined);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (event.team) {
      const team = getTeamByName(event.team);
      setTeamData(team);
    }
  }, [event.team]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleAddMember = (member: TeamMember) => {
    const currentParticipants = participants.split('、').filter(p => p.trim() !== '');
    
    // メンバーがすでに含まれているかチェック
    if (!currentParticipants.includes(member.name)) {
      const newParticipants = [...currentParticipants, member.name];
      setParticipants(newParticipants.join('、'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedEvent = {
      ...event,
      participants,
      target,
      shots: shots ? parseInt(shots, 10) : undefined,
      notes,
      status: 'completed' as const,
    };
    
    updateEvent(updatedEvent);
    onEventUpdated?.(updatedEvent);
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
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiFileText className="mr-2" />
          利用報告書の作成
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUsers className="mr-1" />
              参加者
            </label>
            <input
              type="text"
              id="participants"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            
            {teamData && teamData.members.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">班メンバー：</p>
                <div className="flex flex-wrap gap-1">
                  {teamData.members.map(member => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleAddMember(member)}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full hover:bg-gray-200"
                    >
                      <FiUser className="mr-1" size={12} />
                      {member.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiTarget className="mr-1" />
              撮影対象
            </label>
            <input
              type="text"
              id="target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="shots" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiCamera className="mr-1" />
              撮影枚数
            </label>
            <input
              type="number"
              id="shots"
              value={shots}
              onChange={(e) => setShots(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              min="1"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiFileText className="mr-1" />
              備考
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              キャンセル
            </Button>
            <Button 
              type="submit"
              variant="success"
              className="flex items-center"
            >
              <FiCheckCircle className="mr-1" />
              完了
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 