import { useEffect, useRef, useState } from 'react';
import { Team, TeamMember, addTeam, deleteTeam, generateId, getTeams, updateTeam } from '@/lib/mockData';
import { Button } from './Button';
import { FiUser, FiUsers, FiUserPlus, FiUserX, FiEdit, FiTrash2, FiPlus, FiCheck, FiX, FiSettings } from 'react-icons/fi';

const COLOR_PALETTE = [
  { name: 'インディゴ', bg: '#4F46E5', border: '#4338CA' },
  { name: 'エメラルド', bg: '#10B981', border: '#059669' },
  { name: 'バイオレット', bg: '#8B5CF6', border: '#7C3AED' },
  { name: 'アンバー', bg: '#F59E0B', border: '#D97706' },
  { name: 'フクシャ', bg: '#D946EF', border: '#C026D3' },
  { name: 'ティール', bg: '#14B8A6', border: '#0D9488' },
  { name: 'ライム', bg: '#84CC16', border: '#65A30D' },
  { name: 'ピンク', bg: '#EC4899', border: '#DB2777' },
];

interface TeamManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeamManagement({ isOpen, onClose }: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [editingTeam, setEditingTeam] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTeams(getTeams());
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setEditingTeam(false);
    // チームの色を選択状態に設定
    if (team.color) {
      const matchingColor = COLOR_PALETTE.find(
        color => color.bg === team.color?.bg && color.border === team.color?.border
      );
      if (matchingColor) {
        setSelectedColor(matchingColor);
      }
    }
  };

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;
    
    const newTeam: Team = {
      id: generateId(),
      name: newTeamName,
      members: [],
      color: selectedColor
    };
    
    addTeam(newTeam);
    setTeams(getTeams());
    setNewTeamName('');
    setSelectedTeam(newTeam);
  };

  const handleEditTeam = () => {
    setEditingTeam(true);
    if (selectedTeam) {
      setNewTeamName(selectedTeam.name);
      if (selectedTeam.color) {
        const matchingColor = COLOR_PALETTE.find(
          color => color.bg === selectedTeam.color?.bg && color.border === selectedTeam.color?.border
        );
        if (matchingColor) {
          setSelectedColor(matchingColor);
        }
      }
    }
  };

  const handleUpdateTeam = () => {
    if (!selectedTeam || !newTeamName.trim()) return;
    
    const updatedTeam = {
      ...selectedTeam,
      name: newTeamName,
      color: selectedColor
    };
    
    updateTeam(updatedTeam);
    setTeams(getTeams());
    setSelectedTeam(updatedTeam);
    setEditingTeam(false);
    setNewTeamName('');
  };

  const handleDeleteTeam = () => {
    if (!selectedTeam) return;
    
    if (window.confirm(`「${selectedTeam.name}」を削除してもよろしいですか？`)) {
      deleteTeam(selectedTeam.id);
      setTeams(getTeams());
      setSelectedTeam(null);
    }
  };

  const handleAddMember = () => {
    if (!selectedTeam || !newMemberName.trim()) return;
    
    const newMember: TeamMember = {
      id: generateId(),
      name: newMemberName
    };
    
    const updatedTeam = {
      ...selectedTeam,
      members: [...selectedTeam.members, newMember]
    };
    
    updateTeam(updatedTeam);
    setTeams(getTeams());
    setSelectedTeam(updatedTeam);
    setNewMemberName('');
  };

  const handleDeleteMember = (memberId: string) => {
    if (!selectedTeam) return;
    
    const updatedTeam = {
      ...selectedTeam,
      members: selectedTeam.members.filter(m => m.id !== memberId)
    };
    
    updateTeam(updatedTeam);
    setTeams(getTeams());
    setSelectedTeam(updatedTeam);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden flex flex-col shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FiUsers className="mr-2" />
          班管理
        </h2>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r pr-4 overflow-y-auto">
            <div className="mb-4">
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="新しい班名"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {COLOR_PALETTE.map((color, index) => (
                    <button
                      key={index}
                      className={`w-6 h-6 rounded-full ${color.bg === selectedColor.bg ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                      style={{ backgroundColor: color.bg }}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                    />
                  ))}
                </div>
                
                <Button 
                  onClick={handleAddTeam} 
                  className="flex items-center justify-center mt-2"
                >
                  <FiPlus className="mr-1" />
                  新しい班を追加
                </Button>
              </div>
            </div>
            
            <ul className="space-y-1">
              {teams.map(team => (
                <li 
                  key={team.id}
                  className={`px-3 py-2 rounded-md cursor-pointer flex justify-between items-center ${
                    selectedTeam?.id === team.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSelectTeam(team)}
                >
                  <span className="flex items-center">
                    <span 
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: team.color?.bg || '#CBD5E1' }}
                    />
                    {team.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {team.members.length}名
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="w-2/3 pl-4 flex flex-col overflow-hidden">
            {selectedTeam ? (
              <>
                <div className="border-b pb-3 mb-3 flex justify-between items-center">
                  {editingTeam ? (
                    <div className="flex flex-col space-y-2 w-full">
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="text-sm text-gray-500 flex items-center mr-2">
                          <FiSettings className="mr-1" />
                          班の色:
                        </div>
                        {COLOR_PALETTE.map((color, index) => (
                          <button
                            key={index}
                            className={`w-6 h-6 rounded-full ${color.bg === selectedColor.bg ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                            style={{ backgroundColor: color.bg }}
                            onClick={() => setSelectedColor(color)}
                            title={color.name}
                          />
                        ))}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={handleUpdateTeam}
                          className="flex items-center"
                        >
                          <FiCheck className="mr-1" />
                          保存
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setEditingTeam(false);
                            setNewTeamName('');
                          }}
                          className="flex items-center"
                        >
                          <FiX className="mr-1" />
                          キャンセル
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium flex items-center">
                        <span 
                          className="w-5 h-5 rounded-full mr-2"
                          style={{ backgroundColor: selectedTeam.color?.bg || '#CBD5E1' }}
                        />
                        {selectedTeam.name}
                      </h3>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={handleEditTeam}
                          className="flex items-center"
                        >
                          <FiEdit className="mr-1" />
                          編集
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={handleDeleteTeam}
                          className="flex items-center"
                        >
                          <FiTrash2 className="mr-1" />
                          削除
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mb-4 pr-2">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      placeholder="新しいメンバー名"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Button 
                      onClick={handleAddMember} 
                      size="sm"
                      className="flex items-center"
                    >
                      <FiUserPlus />
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-y-auto flex-1">
                  <h4 className="font-medium mb-2 flex items-center">
                    <FiUsers className="mr-2" />
                    メンバー一覧
                  </h4>
                  {selectedTeam.members.length === 0 ? (
                    <p className="text-gray-500 text-sm">メンバーがいません</p>
                  ) : (
                    <ul className="space-y-1">
                      {selectedTeam.members.map(member => (
                        <li 
                          key={member.id}
                          className="px-3 py-2 rounded-md flex justify-between items-center hover:bg-gray-100"
                        >
                          <span className="flex items-center">
                            <FiUser className="mr-2 text-gray-500" />
                            {member.name}
                          </span>
                          <Button 
                            size="sm" 
                            variant="danger"
                            onClick={() => handleDeleteMember(member.id)}
                            className="flex items-center"
                          >
                            <FiUserX />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FiUsers size={48} className="mb-4" />
                <p>左側のリストから班を選択してください</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-4 pt-4 border-t">
          <Button 
            onClick={onClose}
            className="flex items-center"
          >
            <FiCheck className="mr-1" />
            完了
          </Button>
        </div>
      </div>
    </div>
  );
} 