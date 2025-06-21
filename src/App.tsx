import './App.css'
import Card from './components/Card'
import SpecialCard from './components/SpecialCard'

function App() {

  return (
    <>
      <h1>HOTEL PLANISPHERE</h1>
      <nav>
        <li>
          ホーム
        </li>
        <li>
          宿泊予約
        </li>
        <li>
          会員登録
        </li>
        <li>
          ログイン
        </li>
      </nav>
      <h2>宿泊プラン一覧</h2>
      <SpecialCard tomareru_ninzu={1} saitei_ninzu={1} plan_money={7000} bed_type='スタンダードツイン' />
      <Card title="素泊まり" tomareru_ninzu={1} plan_money={5500} saitei_ninzu={1} bed_type='シングル' />
      <Card title="出張ビジネスプラン" tomareru_ninzu={1} plan_money={7500} saitei_ninzu={1} bed_type='シングル' />
      <Card title="エステ・マッサージプラン" tomareru_ninzu={1} plan_money={9000} saitei_ninzu={1} bed_type='部屋指定なし' />
      <Card title="貸し切り露天風呂プラン" tomareru_ninzu={1} plan_money={9000} saitei_ninzu={1} bed_type='部屋指定なし' />
      <Card title="カップル限定プラン" tomareru_ninzu={1} plan_money={8000} saitei_ninzu={2} bed_type='プレミアムツイン' />
      <Card title="テーマパーク優待プラン" tomareru_ninzu={1} plan_money={10000} saitei_ninzu={1} bed_type='部屋指定なし' />
    </>
  )
}

export default App
