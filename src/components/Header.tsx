import { FiCamera, FiShield } from 'react-icons/fi';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-pink-500 text-white shadow-lg flex-shrink-0">
      <div className="max-w-6xl mx-auto py-3 px-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white p-1.5 rounded-full shadow-md mr-3">
            <FiCamera className="text-xl text-pink-500" />
          </div>
          <h1 className="text-lg md:text-xl font-bold">
            ハイパースペクトルカメラ 予約システム
          </h1>
        </div>
        <Link 
          href="/admin" 
          className="bg-white/20 hover:bg-white/30 text-white rounded-md px-3 py-1.5 text-sm flex items-center transition-colors"
        >
          <FiShield className="mr-1.5" />
          管理者ページ
        </Link>
      </div>
    </header>
  );
} 