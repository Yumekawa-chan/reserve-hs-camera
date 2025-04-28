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
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    
    const correctPassword = process.env.NEXT_PUBLIC_CSV_PASSWORD;
    
    if (password === correctPassword) {
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPassword('');
    }
    
    setIsSubmitting(false);
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
                className={`pl-10 w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="パスワードを入力"
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">
                パスワードが正しくありません。再度お試しください。
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
              disabled={isSubmitting || !password}
            >
              {isSubmitting ? '認証中...' : '認証して出力'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 