import { useEffect, useRef, useState } from 'react';
import { Team, TeamMember, addTeam, deleteTeam, generateId, getTeams, updateTeam } from '@/lib/firebaseData';
import { Button } from './Button';
import { updateTeamColorCache } from '@/lib/utils';
import { FiUser, FiUsers, FiUserPlus, FiUserX, FiEdit, FiTrash2, FiPlus, FiCheck, FiX, FiSettings, FiLoader, FiClipboard, FiPenTool, FiTag } from 'react-icons/fi';

const COLOR_PALETTE = [
  { name: 'オレンジ', bg: '#F59E0B', border: '#D97706' },    
  { name: 'イエロー', bg: '#ECC94B', border: '#D69E2E' },
  { name: 'ピンク', bg: '#EC4899', border: '#DB2777' },
  { name: 'レッド', bg: '#EF4444', border: '#DC2626' },
  { name: 'ブラウン', bg: '#92400E', border: '#78350F' },
  { name: 'ライム', bg: '#84CC16', border: '#65A30D' },      
  { name: 'グリーン', bg: '#10B981', border: '#059669' },    
  { name: 'ティール', bg: '#0EA5E9', border: '#0284C7' },    
  { name: 'シアン', bg: '#06B6D4', border: '#0891B2' },
  { name: 'ブルー', bg: '#4F46E5', border: '#4338CA' },      
  { name: 'パープル', bg: '#9F7AEA', border: '#805AD5' },    
  { name: 'マゼンタ', bg: '#D946EF', border: '#C026D3' },
];

interface TeamManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeamManagement({ isOpen, onClose }: TeamManagementProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [editingTeam, setEditingTeam] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [studentIdError, setStudentIdError] = useState<string | null>(null);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  const fetchTeams = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTeams = await getTeams();
      setTeams(fetchedTeams);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('チームデータの読み込み中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setEditingTeam(false);
    if (team.color) {
      const matchingColor = COLOR_PALETTE.find(
        color => color.bg === team.color?.bg && color.border === team.color?.border
      );
      if (matchingColor) {
        setSelectedColor(matchingColor);
      }
    }
  };

  const handleAddTeam = async () => {
    if (!newTeamName.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const newTeam: Omit<Team, 'id'> = {
        name: newTeamName,
        members: [],
        color: selectedColor
      };
      
      const addedTeam = await addTeam(newTeam);
      if (addedTeam) {
        updateTeamColorCache(addedTeam.name, selectedColor);
        
        const updatedTeams = await getTeams();
        setTeams(updatedTeams);
        setNewTeamName('');
        setSelectedTeam(addedTeam);
      } else {
        throw new Error('チームの追加に失敗しました');
      }
    } catch (err) {
      console.error('Error adding team:', err);
      alert('チームの追加中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
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

  const handleUpdateTeam = async () => {
    if (!selectedTeam || !newTeamName.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const updatedTeam = {
        ...selectedTeam,
        name: newTeamName,
        color: selectedColor
      };
      
      if (selectedTeam.name !== newTeamName) {
        updateTeamColorCache(selectedTeam.name, selectedColor);
      }
      updateTeamColorCache(newTeamName, selectedColor);
      
      const result = await updateTeam(updatedTeam);
      if (result) {
        const updatedTeams = await getTeams();
        setTeams(updatedTeams);
        setSelectedTeam(result);
        setEditingTeam(false);
        setNewTeamName('');
      } else {
        throw new Error('チームの更新に失敗しました');
      }
    } catch (err) {
      console.error('Error updating team:', err);
      alert('チームの更新中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async () => {
    if (!selectedTeam || isSubmitting) return;
    
    if (window.confirm(`「${selectedTeam.name}」を削除してもよろしいですか？`)) {
      setIsSubmitting(true);
      try {
        const success = await deleteTeam(selectedTeam.id);
        if (success) {
          const updatedTeams = await getTeams();
          setTeams(updatedTeams);
          setSelectedTeam(null);
        } else {
          throw new Error('チームの削除に失敗しました');
        }
      } catch (err) {
        console.error('Error deleting team:', err);
        alert('チームの削除中にエラーが発生しました。');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !newMemberName.trim() || !newStudentId.trim() || isSubmitting) return;
    
    let hasError = false;
    
    if (!newMemberName.includes(' ')) {
      setNameError('フルネームを入力してください（姓と名の間にスペースを入れてください）');
      hasError = true;
    } else {
      setNameError(null);
    }
    
    if (newStudentId.trim() === '') {
      setStudentIdError('学籍番号を入力してください');
      hasError = true;
    } else {
      setStudentIdError(null);
    }
    
    if (hasError) return;
    
    setIsSubmitting(true);
    try {
      const newMember: TeamMember = {
        id: generateId(),
        name: newMemberName,
        studentId: newStudentId
      };
      
      const updatedTeam = {
        ...selectedTeam,
        members: [...selectedTeam.members, newMember]
      };
      
      const result = await updateTeam(updatedTeam);
      if (result) {
        const updatedTeams = await getTeams();
        setTeams(updatedTeams);
        
        const freshSelectedTeam = updatedTeams.find(team => team.id === selectedTeam.id);
        if (freshSelectedTeam) {
          setSelectedTeam(freshSelectedTeam);
        }
        
        setNewMemberName('');
        setNewStudentId('');
      } else {
        throw new Error('メンバーの追加に失敗しました');
      }
    } catch (err) {
      console.error('Error adding member:', err);
      alert('メンバーの追加中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!selectedTeam || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const updatedTeam = {
        ...selectedTeam,
        members: selectedTeam.members.filter(m => m.id !== memberId)
      };
      
      const result = await updateTeam(updatedTeam);
      if (result) {
        const updatedTeams = await getTeams();
        setTeams(updatedTeams);
        
        const freshSelectedTeam = updatedTeams.find(team => team.id === selectedTeam.id);
        if (freshSelectedTeam) {
          setSelectedTeam(freshSelectedTeam);
        }
      } else {
        throw new Error('メンバーの削除に失敗しました');
      }
    } catch (err) {
      console.error('Error deleting member:', err);
      alert('メンバーの削除中にエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">班データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
          <h2 className="text-xl font-bold mb-4 text-red-600">エラーが発生しました</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex justify-end space-x-3">
            <Button onClick={() => fetchTeams()} variant="blue">再試行</Button>
            <Button variant="blue-outline" onClick={onClose}>閉じる</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden flex flex-col shadow-xl"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center text-blue-600">
          <FiSettings className="mr-2" />
          班管理
        </h2>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-1/3 border-r border-blue-100 pr-4 flex flex-col overflow-hidden">
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex-shrink-0">
              <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                <FiPlus className="mr-1" />
                新しい班を追加
              </h3>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <FiTag className="text-blue-500 mr-2" />
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="新しい班名を入力"
                    className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-blue-600 flex items-center mr-1">
                    <FiPenTool className="mr-1" size={12} />
                    班の色:
                  </span>
                  {COLOR_PALETTE.map((color, index) => (
                    <button
                      key={index}
                      className={`w-6 h-6 rounded-full ${color.bg === selectedColor.bg ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
                      style={{ backgroundColor: color.bg }}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      disabled={isSubmitting}
                    />
                  ))}
                </div>
                
                <Button 
                  onClick={handleAddTeam} 
                  className="flex items-center justify-center mt-2"
                  variant="blue"
                  disabled={isSubmitting || !newTeamName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <FiLoader className="mr-1 animate-spin" />
                      処理中...
                    </>
                  ) : (
                    <>
                      <FiPlus className="mr-1" />
                      新しい班を作成
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col overflow-hidden flex-1">
              <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center flex-shrink-0">
                <FiUsers className="mr-1" />
                班一覧
              </h3>
              <div className="overflow-y-auto flex-1">
                <ul className="space-y-1">
                  {teams.map(team => (
                    <li 
                      key={team.id}
                      className={`px-3 py-2 rounded-md cursor-pointer flex justify-between items-center transition-colors ${
                        selectedTeam?.id === team.id ? 'bg-blue-100 border border-blue-200' : 'hover:bg-blue-50 border border-transparent'
                      }`}
                      onClick={() => handleSelectTeam(team)}
                    >
                      <span className="flex items-center">
                        <span 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: team.color?.bg || '#CBD5E1' }}
                        />
                        <span className={`${selectedTeam?.id === team.id ? 'font-medium text-blue-800' : 'text-gray-700'}`}>
                          {team.name}
                        </span>
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                        {team.members.length}名
                      </span>
                    </li>
                  ))}
                  {teams.length === 0 && (
                    <li className="px-3 py-2 text-center text-gray-500 text-sm">
                      班が登録されていません
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="w-2/3 pl-4 flex flex-col overflow-hidden">
            {selectedTeam ? (
              <>
                <div className="border-b border-blue-100 pb-3 mb-3 flex-shrink-0">
                  {editingTeam ? (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                        <FiEdit className="mr-1" />
                        班の情報を編集
                      </h3>
                      <div className="flex flex-col space-y-3 w-full">
                        <div className="flex items-center">
                          <FiTag className="text-blue-500 mr-2" />
                          <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="班名を入力"
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div className="text-sm text-blue-600 flex items-center mr-2">
                            <FiPenTool className="mr-1" />
                            班の色:
                          </div>
                          {COLOR_PALETTE.map((color, index) => (
                            <button
                              key={index}
                              className={`w-6 h-6 rounded-full ${color.bg === selectedColor.bg ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
                              style={{ backgroundColor: color.bg }}
                              onClick={() => setSelectedColor(color)}
                              title={color.name}
                              disabled={isSubmitting}
                            />
                          ))}
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button 
                            variant="blue" 
                            size="sm" 
                            onClick={handleUpdateTeam}
                            className="flex items-center"
                            disabled={isSubmitting || !newTeamName.trim()}
                          >
                            {isSubmitting ? (
                              <>
                                <FiLoader className="mr-1 animate-spin" />
                                処理中...
                              </>
                            ) : (
                              <>
                                <FiCheck className="mr-1" />
                                変更を保存
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="blue-outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingTeam(false);
                              setNewTeamName('');
                            }}
                            className="flex items-center"
                            disabled={isSubmitting}
                          >
                            <FiX className="mr-1" />
                            キャンセル
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-medium flex items-center">
                        <span 
                          className="w-5 h-5 rounded-full mr-2"
                          style={{ backgroundColor: selectedTeam.color?.bg || '#CBD5E1' }}
                        />
                        <span className="text-blue-800">{selectedTeam.name}</span>
                      </h3>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="blue"
                          onClick={handleEditTeam}
                          className="flex items-center"
                          disabled={isSubmitting}
                        >
                          <FiEdit className="mr-1" />
                          班名・色を編集
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={handleDeleteTeam}
                          className="flex items-center"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <FiLoader className="animate-spin" />
                          ) : (
                            <>
                              <FiTrash2 className="mr-1" />
                              班を削除
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 flex-shrink-0">
                  <h3 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
                    <FiUserPlus className="mr-1" />
                    新しいメンバーを追加
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1 flex items-center">
                        <FiUser className="mr-1" size={14} />
                        氏名（フルネーム）
                      </label>
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => {
                          setNewMemberName(e.target.value);
                          setNameError(null);
                        }}
                        placeholder="例：山田 太郎"
                        className={`w-full px-3 py-2 border ${nameError ? 'border-red-500' : 'border-blue-200'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        disabled={isSubmitting}
                      />
                      {nameError && (
                        <p className="mt-1 text-xs text-red-500">{nameError}</p>
                      )}
                      <p className="mt-1 text-xs text-blue-600">※姓と名の間にスペースを入れてください</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-1 flex items-center">
                        <FiClipboard className="mr-1" size={14} />
                        学籍番号
                      </label>
                      <input
                        type="text"
                        value={newStudentId}
                        onChange={(e) => {
                          setNewStudentId(e.target.value);
                          setStudentIdError(null);
                        }}
                        placeholder="例：24AMJ21"
                        className={`w-full px-3 py-2 border ${studentIdError ? 'border-red-500' : 'border-blue-200'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        disabled={isSubmitting}
                      />
                      {studentIdError && (
                        <p className="mt-1 text-xs text-red-500">{studentIdError}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Button 
                      onClick={handleAddMember}
                      variant="blue"
                      className="w-full flex items-center justify-center"
                      disabled={isSubmitting || !newMemberName.trim() || !newStudentId.trim()}
                    >
                      {isSubmitting ? (
                        <FiLoader className="animate-spin" />
                      ) : (
                        <>
                          <FiUserPlus className="mr-2" />
                          メンバーを追加
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 bg-white rounded-lg border border-blue-100 flex flex-col overflow-hidden">
                  <div className="p-3 border-b border-blue-100 bg-blue-50 flex-shrink-0">
                    <h4 className="font-medium flex items-center text-blue-700">
                      <FiUsers className="mr-2" />
                      メンバー一覧（{selectedTeam.members.length}名）
                    </h4>
                  </div>
                  <div className="p-2 overflow-y-auto flex-1">
                    {selectedTeam.members.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-4">メンバーが登録されていません</p>
                    ) : (
                      <ul className="space-y-1">
                        {selectedTeam.members.map(member => (
                          <li 
                            key={member.id}
                            className="px-3 py-2 rounded-md flex justify-between items-center hover:bg-blue-50 border border-transparent hover:border-blue-100"
                          >
                            <span className="flex items-center">
                              <FiUser className="mr-2 text-blue-500" />
                              <span className="flex flex-col">
                                <span className="font-medium">{member.name}</span>
                                <span className="text-xs text-gray-500">学籍番号: {member.studentId}</span>
                              </span>
                            </span>
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => handleDeleteMember(member.id)}
                              className="flex items-center"
                              disabled={isSubmitting}
                              title="メンバーを削除"
                            >
                              {isSubmitting ? (
                                <FiLoader className="animate-spin" />
                              ) : (
                                <FiUserX />
                              )}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-blue-50 rounded-lg p-8">
                <FiUsers size={48} className="mb-4 text-blue-400" />
                <p className="text-blue-600 font-medium">左側のリストから班を選択するか、新しい班を作成してください</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-4 pt-4 border-t border-blue-100">
          <Button 
            onClick={onClose}
            className="flex items-center"
            variant="blue"
            disabled={isSubmitting}
          >
            <FiCheck className="mr-1" />
            設定を完了
          </Button>
        </div>
      </div>
    </div>
  );
} 