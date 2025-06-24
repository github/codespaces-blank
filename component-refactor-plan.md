# React コンポーネント分割 & CSS Modules 実装計画

## プロジェクト概要
ホテル予約サイト（HOTEL PLANISPHERE）の単一コンポーネント（App.tsx）を細かい粒度で分割し、CSS ModulesによるスタイリングシステムをVite + React + TypeScript環境に適用する。

## 現在の状況
- **App.tsx**: 168行 - 全機能が集約
- **App.css**: 286行 - 全スタイル定義
- **技術スタック**: React 19, TypeScript, Vite
- **機能**: レスポンシブデザイン対応のホテル宿泊プラン一覧

## コンポーネント分割設計

### アーキテクチャ図
```
App
├── Header
│   ├── Navigation
│   │   ├── HamburgerButton
│   │   └── NavigationMenu
├── Main
│   ├── PageTitle
│   ├── FeaturedPlan
│   │   └── PlanCard (featured)
│   └── PlanList
│       └── PlanCard (regular) × 6
└── Footer
```

### コンポーネント詳細仕様

#### 1. Header コンポーネント
- **ファイル**: `src/components/Header/Header.tsx`
- **CSS**: `src/components/Header/Header.module.css`
- **役割**: サイトヘッダー全体の管理、タイトル表示
- **子コンポーネント**: Navigation

#### 2. Navigation コンポーネント
- **ファイル**: `src/components/Navigation/Navigation.tsx`
- **CSS**: `src/components/Navigation/Navigation.module.css`
- **役割**: ナビゲーション全体の状態管理
- **State**: `isMenuOpen` (boolean)
- **子コンポーネント**: HamburgerButton, NavigationMenu

#### 3. HamburgerButton コンポーネント
- **ファイル**: `src/components/Navigation/HamburgerButton/HamburgerButton.tsx`
- **CSS**: `src/components/Navigation/HamburgerButton/HamburgerButton.module.css`
- **Props**: 
  - `isOpen: boolean`
  - `onClick: () => void`
- **役割**: モバイル用ハンバーガーメニューボタン

#### 4. NavigationMenu コンポーネント
- **ファイル**: `src/components/Navigation/NavigationMenu/NavigationMenu.tsx`
- **CSS**: `src/components/Navigation/NavigationMenu/NavigationMenu.module.css`
- **Props**: 
  - `isOpen: boolean`
- **役割**: ナビゲーションメニューの表示制御

#### 5. PageTitle コンポーネント
- **ファイル**: `src/components/Main/PageTitle/PageTitle.tsx`
- **CSS**: `src/components/Main/PageTitle/PageTitle.module.css`
- **Props**: 
  - `title: string`
- **役割**: ページタイトルの表示

#### 6. FeaturedPlan コンポーネント
- **ファイル**: `src/components/Main/FeaturedPlan/FeaturedPlan.tsx`
- **CSS**: `src/components/Main/FeaturedPlan/FeaturedPlan.module.css`
- **役割**: おすすめプランセクションの管理
- **子コンポーネント**: PlanCard (featured版)

#### 7. PlanList コンポーネント
- **ファイル**: `src/components/Main/PlanList/PlanList.tsx`
- **CSS**: `src/components/Main/PlanList/PlanList.module.css`
- **Props**: 
  - `plans: Plan[]`
- **役割**: 通常プラン一覧の表示管理
- **子コンポーネント**: PlanCard × 6

#### 8. PlanCard コンポーネント
- **ファイル**: `src/components/PlanCard/PlanCard.tsx`
- **CSS**: `src/components/PlanCard/PlanCard.module.css`
- **Props**: 
  - `plan: Plan`
  - `isFeatured?: boolean`
- **役割**: 再利用可能なプランカード

#### 9. Footer コンポーネント
- **ファイル**: `src/components/Footer/Footer.tsx`
- **CSS**: `src/components/Footer/Footer.module.css`
- **役割**: サイトフッター

## CSS分割マッピング詳細

### 現在のApp.css (286行) → 各CSS Moduleへの分散

| 元のCSSセレクター | 行番号 | 移動先CSS Module | 新しいクラス名 |
|---|---|---|---|
| `.hotel-app` | 2-7 | App.module.css | `.container` |
| `header` | 9-15 | Header.module.css | `.header` |
| `header h1` | 17-23 | Header.module.css | `.title` |
| `nav` | 26-31 | Navigation.module.css | `.nav` |
| `.hamburger-button` | 34-44 | HamburgerButton.module.css | `.button` |
| `.hamburger-button span` | 46-54 | HamburgerButton.module.css | `.line` |
| `nav ul` | 56-62 | NavigationMenu.module.css | `.menu` |
| `nav ul li` | 64-67 | NavigationMenu.module.css | `.menuItem` |
| `nav ul li a` | 69-74 | NavigationMenu.module.css | `.menuLink` |
| `.login-btn` | 76-82 | NavigationMenu.module.css | `.loginButton` |
| `.active-link` | 84-86 | NavigationMenu.module.css | `.activeLink` |
| `main` | 89-94 | App.module.css | `.main` |
| `main h2` | 96-103 | PageTitle.module.css | `.title` |
| `.plan-list` | 106-113 | PlanList.module.css | `.grid` |
| `.plan-card` | 116-122 | PlanCard.module.css | `.card` |
| `.plan-column` | 125-127 | PlanList.module.css | `.column` |
| `.featured` | 129-135 | FeaturedPlan.module.css | `.container` |
| `.plan-header` | 137-141 | PlanCard.module.css | `.header` |
| `.plan-content` | 143-157 | PlanCard.module.css | `.content` |
| `.plan-content h3` | 147-152 | PlanCard.module.css | `.planTitle` |
| `.plan-content p` | 154-156 | PlanCard.module.css | `.planDetail` |
| `.plan-footer` | 158-163 | PlanCard.module.css | `.footer` |
| `.reserve-btn` | 166-180 | PlanCard.module.css | `.reserveButton` |
| `.reserve-btn:hover` | 182-184 | PlanCard.module.css | `.reserveButton:hover` |
| `footer` | 187-191 | Footer.module.css | `.footer` |
| `footer a` | 193-198 | Footer.module.css | `.link` |
| `footer p` | 200-203 | Footer.module.css | `.text` |

### レスポンシブデザインの分散

#### タブレット向け（768px〜991px）- 209-248行
- Header関連（211-223行） → Header.module.css
- HamburgerButton表示（225-228行） → HamburgerButton.module.css
- Navigation関連（230-242行） → Navigation.module.css, NavigationMenu.module.css
- PlanList関連（244-247行） → PlanList.module.css

#### モバイル向け（767px以下）- 251-286行
- NavigationMenu関連（253-258行） → NavigationMenu.module.css
- PlanList関連（260-263行） → PlanList.module.css
- PlanCard関連（265-276行） → PlanCard.module.css
- Main, Footer関連（278-285行） → App.module.css, Footer.module.css

## 型定義

### Plan型
```typescript
// src/types/plan.ts
export interface Plan {
  id: string;
  title: string;
  price: string;
  guests: string;
  roomType: string;
  isFeatured?: boolean;
  badge?: string;
}
```

### CSS Modules型定義
```typescript
// src/vite-env.d.ts に追加
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
```

## ディレクトリ構造

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   ├── Navigation/
│   │   ├── Navigation.tsx
│   │   ├── Navigation.module.css
│   │   ├── HamburgerButton/
│   │   │   ├── HamburgerButton.tsx
│   │   │   └── HamburgerButton.module.css
│   │   └── NavigationMenu/
│   │       ├── NavigationMenu.tsx
│   │       └── NavigationMenu.module.css
│   ├── Main/
│   │   ├── PageTitle/
│   │   │   ├── PageTitle.tsx
│   │   │   └── PageTitle.module.css
│   │   ├── FeaturedPlan/
│   │   │   ├── FeaturedPlan.tsx
│   │   │   └── FeaturedPlan.module.css
│   │   └── PlanList/
│   │       ├── PlanList.tsx
│   │       └── PlanList.module.css
│   ├── PlanCard/
│   │   ├── PlanCard.tsx
│   │   └── PlanCard.module.css
│   └── Footer/
│       ├── Footer.tsx
│       └── Footer.module.css
├── types/
│   └── plan.ts
├── App.tsx
├── App.module.css
├── main.tsx
└── vite-env.d.ts
```

## 実装フェーズ

### フェーズ1: 基盤整備
1. 型定義の作成 (`types/plan.ts`)
2. CSS Modules TypeScript設定
3. プランデータの定義

### フェーズ2: リーフコンポーネント
1. **PlanCard** - 最も再利用されるコンポーネント
2. **HamburgerButton** - 単純なUI要素
3. **PageTitle** - シンプルなプレゼンテーション

### フェーズ3: 中間コンポーネント
1. **NavigationMenu** - メニューリスト管理
2. **FeaturedPlan** - おすすめプランコンテナ  
3. **PlanList** - プラン一覧管理

### フェーズ4: 上位コンポーネント
1. **Navigation** - 状態管理を含む
2. **Header** - ナビゲーションを含む
3. **Footer** - 独立したフッター

### フェーズ5: 最終統合
1. **App.tsx** の更新 - 全コンポーネント統合
2. **App.css** の削除
3. 動作確認とテスト

## CSS Modules設定

### Vite設定追加
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
```

## 期待される効果

### 保守性向上
- コンポーネントごとの責任分離
- スタイルの局所化
- 再利用性の向上

### 開発体験向上
- TypeScript型安全性
- クラス名の自動補完
- 未使用スタイルの検出

### パフォーマンス向上
- 必要なCSSのみバンドル
- コードスプリット対応
- ツリーシェイキング効果

---

**作成日**: 2025/6/24
**プロジェクト**: HOTEL PLANISPHERE
**技術スタック**: React 19 + TypeScript + Vite + CSS Modules