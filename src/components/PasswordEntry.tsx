import { useState } from 'react';
import { Button } from './Button';
import { FiLock, FiKey } from 'react-icons/fi';

interface PasswordEntryProps {
  onAuthenticated: () => void;
}

export function PasswordEntry({ onAuthenticated }: PasswordEntryProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(false);
    
    const correctPassword = process.env.NEXT_PUBLIC_ENTER_PASSWORD;
    
    if (password === correctPassword) {
      const now = new Date();
      const expiryDate = new Date(now);
      expiryDate.setDate(now.getDate() + 2); 
      
      const authData = {
        isAuthenticated: true,
        expiry: expiryDate.getTime() 
      };
      
      localStorage.setItem('authData', JSON.stringify(authData));
      onAuthenticated();
    } else {
      setError(true);
      setPassword('');
    }
    
    setIsSubmitting(false);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiLock className="text-3xl text-pink-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">認証が必要です</h2>
        <p className="text-gray-600 mt-2">
          本システムにアクセスするには、パスワードを入力してください。
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            パスワード
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiKey className="text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
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
        
        <Button
          type="submit"
          className="w-full flex items-center justify-center"
          disabled={isSubmitting || !password}
        >
          {isSubmitting ? '認証中...' : '認証'}
        </Button>
      </form>
    </div>
  );
} 