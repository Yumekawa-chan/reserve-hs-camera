import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Event, getTeamByName } from './mockData';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'reserved':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'in-use':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'reserved':
      return '予約中';
    case 'in-use':
      return '使用中';
    case 'completed':
      return '完了';
    default:
      return '不明';
  }
}

export function getTeamColor(teamName: string): { bg: string, border: string } {
  // チームデータから該当するチームを探す
  const team = getTeamByName(teamName);
  
  // チームが見つかり、カラー設定がある場合はそれを返す
  if (team && team.color) {
    return team.color;
  }
  
  // 以下は既存のフォールバックロジック
  switch (teamName) {
    case '第一研究班':
      return { bg: '#4F46E5', border: '#4338CA' }; // インディゴ (indigo-600, indigo-700)
    case '第二研究班':
      return { bg: '#0EA5E9', border: '#0284C7' }; // スカイブルー (sky-500, sky-600)
    case '第三研究班':
      return { bg: '#10B981', border: '#059669' }; // エメラルド (emerald-500, emerald-600)
    case '環境分析チーム':
      return { bg: '#8B5CF6', border: '#7C3AED' }; // バイオレット (violet-500, violet-600)
    case '材料研究班':
      return { bg: '#F59E0B', border: '#D97706' }; // アンバー (amber-500, amber-600)
    default:
      // ハッシュ値に基づいて色を生成（赤色を避ける）
      const hash = teamName.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      const hue = Math.abs(hash % 280); // 0-280の範囲（赤色の範囲を避ける）
      return { 
        bg: `hsl(${hue}, 70%, 60%)`, 
        border: `hsl(${hue}, 70%, 50%)` 
      };
  }
}

export function exportToCsv(events: Event[]): void {
  const completedEvents = events.filter(event => event.status === 'completed');
  
  const headers = [
    '日付',
    '撮影時間',
    '班名',
    'タイトル',
    '参加者',
    '撮影対象',
    '撮影枚数',
    '備考'
  ];

  const csvData = completedEvents.map(event => [
    event.date,
    event.time && event.endTime ? `${event.time}～${event.endTime}` : '',
    event.team,
    event.title,
    event.participants || '',
    event.target || '',
    event.shots?.toString() || '',
    event.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `カメラ利用記録_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 