export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-lg font-medium text-gray-700">読み込み中...</p>
      </div>
    </div>
  );
} 