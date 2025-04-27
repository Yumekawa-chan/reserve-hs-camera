import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Event } from './mockData';

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