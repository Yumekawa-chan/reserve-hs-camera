import { FiCamera } from 'react-icons/fi';

export function Header() {
  return (
    <header className="bg-pink-500 text-white shadow-lg">
      <div className="max-w-6xl mx-auto py-5 px-4 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="bg-white p-2 rounded-full shadow-md mr-3">
          <FiCamera className="text-2xl text-pink-500" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold">
          ハイパースペクトルカメラ 予約システム
        </h1>
      </div>
    </header>
  );
} 