import "./App.css";
import { useState } from "react";


function App() {
const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="hotel-app">
			<header>
				<h1>HOTEL PLANISPHERE</h1>
				<nav className={isMenuOpen ? "menu-open" : ""}>
					<button
						type="button"
						className="hamburger-button"
						onClick={toggleMenu}
						aria-label="メニューを開閉"
						aria-expanded={isMenuOpen}
					>
						<span /><span /><span />
					</button>
					<ul>
						<li>
							<a href="/">ホーム</a>
						</li>
						<li>
							<a href="/reserve" className="active-link">宿泊予約</a>
						</li>
						<li>
							<a href="/register">会員登録</a>
						</li>
						<li>
							<a href="/login" className="login-btn">ログイン</a>
						</li>
					</ul>
				</nav>
			</header>
			<main>
				<div className="row">
					<h2>宿泊プラン一覧</h2>
				</div>

				{/* おすすめプラン */}
				<div className="row">
					<div className="featured">
						<div className="plan-card">
							<div className="plan-header">⭐おすすめプラン⭐</div>
							<div className="plan-content">
								<h3>お得な特典付きプラン</h3>
								<p>大人1名7,000円</p>
								<p>1名様から</p>
								<p>スタンダードツイン</p>
								<button type="button" className="reserve-btn">
									このプランで予約
								</button>
							</div>
							<div className="plan-footer">本日限り</div>
						</div>
					</div>
				</div>

				{/* 宿泊プラン一覧 */}
				<div className="row">
					<div className="plan-list">
						<div className="plan-column">
							<div className="plan-card">
								<div className="plan-content">
									<h3>素泊まり</h3>
									<p>大人1名5,500円</p>
									<p>1名様から</p>
									<p>シングル</p>
									<button type="button" className="reserve-btn">
										このプランで予約
									</button>
								</div>
							</div>
						</div>

						<div className="plan-column">
							<div className="plan-card">
								<div className="plan-content">
									<h3>出張ビジネスプラン</h3>
									<p>大人1名7,500円</p>
									<p>1名様から</p>
									<p>シングル</p>
									<button type="button" className="reserve-btn">
										このプランで予約
									</button>
								</div>
							</div>
						</div>

						<div className="plan-column">
							<div className="plan-card">
								<div className="plan-content">
									<h3>エステ・マッサージプラン</h3>
									<p>大人1名9,000円</p>
									<p>1名様から</p>
									<p>部屋指定なし</p>
									<button type="button" className="reserve-btn">
										このプランで予約
									</button>
								</div>
							</div>
						</div>

						<div className="plan-column">
							<div className="plan-card">
								<div className="plan-content">
									<h3>貸し切り露天風呂プラン</h3>
									<p>大人1名9,000円</p>
									<p>1名様から</p>
									<p>部屋指定なし</p>
									<button type="button" className="reserve-btn">
										このプランで予約
									</button>
								</div>
							</div>
						</div>

						<div className="plan-column">
							<div className="plan-card">
								<div className="plan-content">
									<h3>カップル限定プラン</h3>
									<p>大人1名8,000円</p>
									<p>2名様から</p>
									<p>プレミアムツイン</p>
									<button type="button" className="reserve-btn">
										このプランで予約
									</button>
								</div>
							</div>
						</div>

						<div className="plan-column">
							<div className="plan-card">
								<div className="plan-content">
									<h3>テーマパーク優待プラン</h3>
									<p>大人1名10,000円</p>
									<p>1名様から</p>
									<p>部屋指定なし</p>
									<button type="button" className="reserve-btn">
										このプランで予約
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
			<footer>
				<a href="https://github.com">GitHub</a>
				<p>© 2020-2025 Kensuke Mishima</p>
			</footer>
		</div>
	);
}

export default App;