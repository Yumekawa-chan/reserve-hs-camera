'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h2>
        <p className="text-gray-700 mb-6">
          申し訳ありませんが、予期せぬエラーが発生しました。もう一度お試しいただくか、問題が解決しない場合は管理者にお問い合わせください。
        </p>
        <div className="flex justify-center">
          <Button onClick={reset} variant="primary">
            もう一度試す
          </Button>
        </div>
      </div>
    </div>
  );
} 