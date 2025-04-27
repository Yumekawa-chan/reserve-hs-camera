import { useEffect, useRef, useState } from 'react';
import { Team, TeamMember, addTeam, deleteTeam, generateId, getTeams, updateTeam } from '@/lib/mockData';
import { Button } from './Button';
import { FiUser, FiUsers, FiUserPlus, FiUserX, FiEdit, FiTrash2, FiPlus, FiCheck, FiX } from 'react-icons/fi';

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
  };

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;
    
    const newTeam: Team = {
      id: generateId(),
      name: newTeamName,
      members: []
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
    }
  };

  const handleUpdateTeam = () => {
    if (!selectedTeam || !newTeamName.trim()) return;
    
    const updatedTeam = {
      ...selectedTeam,
      name: newTeamName
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
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="新しい班名"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <Button 
                  onClick={handleAddTeam} 
                  size="sm"
                  className="flex items-center"
                >
                  <FiPlus />
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
                    <FiUsers className="mr-2 text-gray-500" />
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
                    <div className="flex space-x-2 items-center flex-1">
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={handleUpdateTeam}
                        className="flex items-center"
                      >
                        <FiCheck />
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
                        <FiX />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium">{selectedTeam.name}</h3>
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
                
                <div className="mb-4">
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