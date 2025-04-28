import { FiCamera } from 'react-icons/fi';

export function Header() {
  return (
    <header className="bg-pink-500 text-white shadow-lg flex-shrink-0">
      <div className="max-w-6xl mx-auto py-3 px-4 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white p-1.5 rounded-full shadow-md mr-3">
          <FiCamera className="text-xl text-pink-500" />
        </div>
        <h1 className="text-lg md:text-xl font-bold">
          ハイパースペクトルカメラ 予約システム
        </h1>
      </div>
    </header>
  );
} 