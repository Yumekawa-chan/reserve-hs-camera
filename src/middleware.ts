import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ipThrottleMap = new Map();
const failedAttemptsMap = new Map();

const THROTTLE_LIMIT = 1000;
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPTS_RESET_TIME = 1800000;

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    const lastRequestTime = ipThrottleMap.get(ip) || 0;
    if (now - lastRequestTime < THROTTLE_LIMIT) {
      return new NextResponse(JSON.stringify({ 
        error: 'リクエストが多すぎます。しばらく経ってから再試行してください。' 
      }), { 
        status: 429, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    ipThrottleMap.set(ip, now);
    
    const attempts = failedAttemptsMap.get(ip);
    if (attempts && attempts.count >= MAX_FAILED_ATTEMPTS && now - attempts.timestamp < ATTEMPTS_RESET_TIME) {
      return new NextResponse(JSON.stringify({ 
        error: '認証に複数回失敗しました。しばらく経ってから再試行してください。' 
      }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*']
};

export function incrementFailedAttempts(ip: string) {
  const now = Date.now();
  const attempts = failedAttemptsMap.get(ip) || { count: 0, timestamp: now };
  
  if (now - attempts.timestamp > ATTEMPTS_RESET_TIME) {
    failedAttemptsMap.set(ip, { count: 1, timestamp: now });
  } else {
    failedAttemptsMap.set(ip, { 
      count: attempts.count + 1, 
      timestamp: now 
    });
  }
  
  return failedAttemptsMap.get(ip).count;
}

export function resetFailedAttempts(ip: string) {
  failedAttemptsMap.delete(ip);
} 