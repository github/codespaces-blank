import Header from "./components/Header/Header";
import PageTitle from "./components/Main/PageTitle/PageTitle";
import FeaturedPlan from "./components/Main/PlanCard/FeaturedPlan/FeaturedPlan";
import PlanList from "./components/Main/PlanList/PlanList";
import Footer from "./components/Footer/Footer";
import { featuredPlan, regularPlans } from "./types/plan";
import styles from "./App.module.css";

function App() {
	return (
		<div className={styles.container}>
			<Header />
			<main className={styles.main}>
				<div className={styles.row}>
					<PageTitle title="宿泊プラン一覧" />
				</div>

				{/* おすすめプラン */}
				<div className={styles.row}>
					<FeaturedPlan plan={featuredPlan} />
				</div>

				{/* 宿泊プラン一覧 */}
				<div className={styles.row}>
					<PlanList plans={regularPlans} />
				</div>
			</main>
			<Footer />
		</div>
	);
}

export default App;
