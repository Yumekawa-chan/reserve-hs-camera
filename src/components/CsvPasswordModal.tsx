import { useState } from 'react';
import { Button } from './Button';
import { FiKey, FiFileText } from 'react-icons/fi';

interface CsvPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CsvPasswordModal({ isOpen, onClose, onSuccess }: CsvPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim() || isLocked) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          type: 'csv',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setPassword('');
        onSuccess();
        onClose();
      } else {
        if (data.remainingAttempts > 0) {
          setError(`パスワードが正しくありません。残り試行回数: ${data.remainingAttempts}回`);
        } else {
          setError('認証試行回数が上限に達しました。しばらく経ってから再試行してください。');
          setIsLocked(true);
        }
        setPassword('');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      setError('認証中にエラーが発生しました。再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="text-center mb-6">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="text-3xl text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">CSV出力認証</h2>
          <p className="text-gray-600 mt-2">
            CSVファイルを出力するには、パスワードを入力してください。
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="csv-password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiKey className="text-gray-400" />
              </div>
              <input
                id="csv-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pl-10 w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} ${isLocked ? 'bg-gray-100' : ''} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder={isLocked ? "アクセスがロックされています" : "パスワードを入力"}
                required
                autoFocus
                disabled={isLocked}
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              className="flex items-center"
              disabled={isSubmitting || !password || isLocked}
            >
              {isLocked ? 'アクセスがロックされています' : (isSubmitting ? '認証中...' : '認証して出力')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 