# HS カメラ 予約システム 📅

## 概要

本システムは、研究室で共有されているハイパースペクトルカメラ（HS カメラ）の予約管理を行うための Web アプリケーションです。複数の班が 1 台のカメラを利用するため、使用状況の管理・保存が必要となります。本システムでは、予約の登録から使用報告までを一元的に管理でき、管理者は各班の利用履歴を確認することができます。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/3c58ecef-b23d-4ce9-979c-288b348181d1" alt="カレンダー画面" style="max-width: 50%; height: auto;" />
</div>


---

## 使用技術 🛠️

- Next.js  
- Firebase  
- Tailwind CSS  

---

## 使用方法 🔐

ログイン時には、**事前に共有されたパスワード**を入力してください。

---

### 👤 一般ユーザー向け

#### ✅ HSカメラの利用予約をする  
カレンダーから使用したい日付をクリック → 自分のチームを選択 → 利用日と利用時間を登録します。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/fc172c9a-dac3-495c-bb79-9fa525783e7c" alt="予約画面" style="max-width: 80%; height: auto;" />
</div>

---

#### ▶️ 撮影を開始する  
カレンダー上の自分のチームの予約をクリックし、「使用開始」ボタンを押します。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/9c92439f-967b-4678-9029-1500492474db" alt="使用開始" style="max-width: 80%; height: auto;" />
</div>

使用中になると、予約の色が **赤色** に変わります。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/7b125165-350e-41ab-8d33-d63ab11a7013" alt="使用中" style="max-width: 80%; height: auto;" />
</div>

---

#### 📝 撮影報告をする  
赤くなっている自分のチームの予約をクリックし、「使用完了」ボタンを押してください。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/8a6b23e4-8b5e-4678-93b2-2f9dfac7a148" alt="使用完了" style="max-width: 80%; height: auto;" />
</div>

その後、**利用報告書**を記入します。撮影の参加者・撮影場所・枚数など、本日の情報を正確に記録してください。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/31863515-fbae-4d4a-a34f-29557ae2ce21" alt="利用報告書" style="max-width: 80%; height: auto;" />
</div>

---

### 🛡️ 管理ユーザー向け

#### 🆕 新しい班を追加する  
画面右上の「班管理」ボタンを押下し、チーム名とチームカラーを選択します。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/7fa3baf4-1baa-477b-87f7-c341602915f5" alt="新しい班の追加" style="max-width: 80%; height: auto;" />
</div>

---

#### 👥 班にメンバーを追加する  
班管理モーダルでフルネームの氏名と学籍番号を入力し、「メンバーを追加」ボタンをクリックします。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/51321794-8cba-4a80-9dc2-d21ea18d8fce" alt="班へのメンバー追加" style="max-width: 80%; height: auto;" />
</div>

---

#### ✏️ チーム名の変更・削除  
班管理モーダルで任意のチームを選択した状態で、「班名・色を編集」ボタンまたは「班を削除」ボタンをクリックします。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/ea1fa160-e5e3-4304-834f-e4eddb83efb9" alt="チーム名の編集・削除" style="max-width: 80%; height: auto;" />
</div>

---

#### ❌ 班のメンバーを削除する  
任意のチームを選択した状態で、メンバー一覧から削除したいユーザーの「メンバー削除」ボタンをクリックします。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/437293bf-91f7-476f-a843-1bdfc62c0a45" alt="メンバー削除" style="max-width: 80%; height: auto;" />
</div>

---

#### 📤 撮影履歴をCSVで出力する  
「CSV出力」ボタンをクリックすることで、全ての使用履歴をCSV形式でダウンロードできます。  
※出力処理には数秒〜数十秒かかる場合があります。

<div style="text-align: center;">
  <img src="https://github.com/user-attachments/assets/f3cb5f50-81bf-4b53-9f0d-6f01b46ccd7d" alt="CSV出力" style="max-width: 80%; height: auto;" />
</div>

---

## 今後の TODO 🛠️

本システムは開発効率を重視し、**Cursor** などのツールを活用して短期間で構築しました。そのため、コードの可読性や構造に一部改善の余地があります。今後は、**長期的な運用を見据えて**、順次リファクタリングを進めていく予定です。
