import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Event, Team, TeamMember, getTeamByName, updateEvent } from '@/lib/firebaseData';
import { FiUser, FiUsers, FiTarget, FiCamera, FiFileText, FiCheckCircle, FiPlus, FiX, FiUserPlus, FiClipboard, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onEventUpdated?: (event: Event) => void;
  onCompleted?: () => void;
}

interface TempMember {
  id: string;
  name: string;
  studentId: string;
}

export function ReportModal({
  isOpen,
  onClose,
  event,
  onEventUpdated,
  onCompleted,
}: ReportModalProps) {
  const [participants, setParticipants] = useState<string[]>(event.participants ? event.participants.split('、').filter(p => p.trim() !== '') : []);
  const [target, setTarget] = useState(event.target || '');
  const [shots, setShots] = useState(event.shots?.toString() || '');
  const [notes, setNotes] = useState(event.notes || '');
  const [teamData, setTeamData] = useState<Team | undefined>(undefined);
  
  const [tempMembers, setTempMembers] = useState<TempMember[]>([]);
  const [tempName, setTempName] = useState('');
  const [tempStudentId, setTempStudentId] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [studentIdError, setStudentIdError] = useState<string | null>(null);
  const [isAddingTempMember, setIsAddingTempMember] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (event.team) {
      const fetchTeam = async () => {
        const team = await getTeamByName(event.team);
        setTeamData(team || undefined);
      };
      fetchTeam();
    }
  }, [event.team]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleAddMember = (member: TeamMember) => {
    if (!participants.includes(member.name)) {
      setParticipants([...participants, member.name]);
    }
  };

  const handleRemoveMember = (memberName: string) => {
    setParticipants(participants.filter(name => name !== memberName));
    
    setTempMembers(tempMembers.filter(m => m.name !== memberName));
  };

  const handleAddTempMember = () => {
    let hasError = false;
    
    if (!tempName.trim()) {
      setNameError('氏名を入力してください');
      hasError = true;
    } else if (!tempName.includes(' ')) {
      setNameError('姓と名の間にスペースを入れてフルネームで入力してください');
      hasError = true;
    } else if (tempName.trim().split(' ').length !== 2 || tempName.trim().split(' ').some(part => !part)) {
      setNameError('正しい形式のフルネームを入力してください（例：山田 太郎）');
      hasError = true;
    } else {
      setNameError(null);
    }
    
    if (!tempStudentId.trim()) {
      setStudentIdError('学籍番号を入力してください');
      hasError = true;
    } else {
      setStudentIdError(null);
    }
    
    if (hasError) return;
    
    const newId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newTempMember: TempMember = {
      id: newId,
      name: tempName,
      studentId: tempStudentId
    };
    
    setTempMembers([...tempMembers, newTempMember]);
    setParticipants([...participants, tempName]);
    
    setTempName('');
    setTempStudentId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedEvent = {
        ...event,
        participants: participants.join('、'),
        target,
        shots: shots ? parseInt(shots, 10) : undefined,
        notes,
        status: 'completed' as const,
        tempMembers: tempMembers.length > 0 ? JSON.stringify(tempMembers) : null,
      };
      
      const result = await updateEvent(updatedEvent);
      if (result) {
        onEventUpdated?.(result);
        onCompleted?.();
        
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error('イベントの更新に失敗しました');
      }
    } catch (error) {
      console.error('Error completing event:', error);
      alert('利用報告の送信中にエラーが発生しました。管理者に連絡してください。');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiFileText className="mr-2" />
          利用報告書の作成
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiUsers className="mr-1" />
              参加者
            </label>
            
            {participants.length > 0 ? (
              <div className="mb-3 flex flex-wrap gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
                {participants.map((name, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800">
                    <FiUser className="mr-1.5 flex-shrink-0" size={14} />
                    {name}
                    <button 
                      type="button" 
                      className="ml-1.5 text-blue-600 hover:text-blue-800"
                      onClick={() => handleRemoveMember(name)}
                    >
                      <FiX size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="mb-3 p-3 text-sm text-gray-500 bg-gray-50 rounded-md border border-gray-200">
                参加者が登録されていません。
              </div>
            )}
            
            {teamData && teamData.members.length > 0 && (
              <div className="mb-4 bg-blue-50 p-3 rounded-md border border-blue-100">
                <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                  <FiUsers className="mr-1.5" size={14} />
                  班メンバーから選択
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {teamData.members.map((member: TeamMember) => {
                    const isSelected = participants.includes(member.name);
                    return (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => isSelected ? handleRemoveMember(member.name) : handleAddMember(member)}
                        className={`inline-flex items-center px-2 py-1 text-xs rounded-full transition-colors
                          ${isSelected 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                      >
                        <FiUser className="mr-1" size={12} />
                        {member.name}
                        {isSelected && <FiCheck className="ml-1" size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setIsAddingTempMember(!isAddingTempMember)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
              >
                <span className="flex items-center">
                  <FiUserPlus className="mr-1.5" size={14} />
                  臨時参加者を追加
                </span>
                {isAddingTempMember ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {isAddingTempMember && (
                <div className="mt-3 bg-yellow-50 p-3 rounded-md border border-yellow-100">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-xs font-medium text-yellow-700 mb-1 flex items-center">
                        <FiUser className="mr-1" size={12} />
                        氏名（フルネーム）
                      </label>
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => {
                          setTempName(e.target.value);
                          setNameError(null);
                        }}
                        placeholder="例：山田 太郎"
                        className={`w-full px-2 py-1.5 text-sm border ${nameError ? 'border-red-500' : 'border-yellow-200'} rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                      />
                      {nameError && (
                        <p className="mt-1 text-xs text-red-500">{nameError}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-yellow-700 mb-1 flex items-center">
                        <FiClipboard className="mr-1" size={12} />
                        学籍番号
                      </label>
                      <input
                        type="text"
                        value={tempStudentId}
                        onChange={(e) => {
                          setTempStudentId(e.target.value);
                          setStudentIdError(null);
                        }}
                        placeholder="例：24AMJ21"
                        className={`w-full px-2 py-1.5 text-sm border ${studentIdError ? 'border-red-500' : 'border-yellow-200'} rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                      />
                      {studentIdError && (
                        <p className="mt-1 text-xs text-red-500">{studentIdError}</p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleAddTempMember}
                    className="w-full flex items-center justify-center px-3 py-1.5 text-sm rounded-md bg-yellow-200 text-yellow-800 hover:bg-yellow-300 transition-colors"
                  >
                    <FiPlus className="mr-1.5" size={14} />
                    臨時参加者を追加
                  </button>
                </div>
              )}
            </div>
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
              disabled={participants.length === 0}
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