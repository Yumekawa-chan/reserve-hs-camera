import { NextRequest, NextResponse } from "next/server";
import { incrementFailedAttempts, resetFailedAttempts } from "@/middleware";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const requestData = await request.json();
    const { password, type } = requestData;
    
    let correctPassword;
    if (type === 'enter') {
      correctPassword = process.env.NEXT_PUBLIC_ENTER_PASSWORD;
    } else if (type === 'csv') {
      correctPassword = process.env.NEXT_PUBLIC_CSV_PASSWORD;
    } else {
      return NextResponse.json(
        { success: false, message: '無効な認証タイプです' },
        { status: 400 }
      );
    }
    
    if (password === correctPassword) {
      resetFailedAttempts(ip);
      
      return NextResponse.json(
        { success: true, message: '認証成功' },
        { status: 200 }
      );
    } else {
      const attempts = incrementFailedAttempts(ip);
      
      const remainingAttempts = Math.max(0, 5 - attempts);
      
      return NextResponse.json(
        { 
          success: false, 
          message: '認証失敗',
          remainingAttempts
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('認証処理エラー:', error);
    return NextResponse.json(
      { success: false, message: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 