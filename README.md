# HS カメラ 予約システム 📷📅

## 概要

本システムは、研究室で共有されているハイパースペクトルカメラ（HS カメラ）📷の予約管理を行うための Web アプリケーションです。複数の班が 1 台のカメラを利用するため、使用状況の管理・保存が必要となります。本システムでは、予約の登録から使用報告までを一元的に管理でき、管理者は各班の利用履歴を確認することができます。

## 使用技術 🛠️

- Next.js
- Firebase
- Tailwind CSS

## 使用方法 🔐

ログイン時には、**事前に共有されたパスワード**を入力してください。

---

### 👤 一般ユーザー向け

#### ✅ HSカメラの利用予約をする  
カレンダーから使用したい日付をクリック → 自分のチームを選択 → 利用日を登録します。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/fc172c9a-dac3-495c-bb79-9fa525783e7c" alt="予約画面" style="max-width: 80%; height: auto;" />
</div>

#### ▶️ 撮影を開始する  
カレンダー上の自分のチームの予約をクリックし、「使用開始」ボタンを押します。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/9c92439f-967b-4678-9029-1500492474db" alt="使用開始" style="max-width: 80%; height: auto;" />
</div>

使用中になると、予約の色が **赤色** に変わります。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/7b125165-350e-41ab-8d33-d63ab11a7013" alt="使用中" style="max-width: 80%; height: auto;" />
</div>

#### 📝 撮影報告をする  
赤くなっている自分のチームの予約をクリックし、「使用完了」ボタンを押してください。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/8a6b23e4-8b5e-4678-93b2-2f9dfac7a148" alt="使用完了" style="max-width: 80%; height: auto;" />
</div>

その後、**利用報告書**を記入します。撮影内容・対象・問題点など、本日の情報を正確に記録してください。

---

### 🛡️ 管理ユーザー向け  
※現在準備中です。今後追記予定です。

---

## 今後の TODO 🛠️

本システムは開発効率を重視し、**Cursor** などのツールを活用して短期間で構築しました。そのため、コードの可読性や構造に一部改善の余地があります。今後は、**長期的な運用を見据えて**、順次リファクタリングを進めていく予定です。
