import type { Plan } from "../../../types/plan";
import PlanCard from "../PlanCard/PlanCard";
import styles from "./PlanList.module.css";

interface PlanListProps {
	plans: Plan[];
}

export const PlanList = ({ plans }: PlanListProps) => {
	return (
		<div className={styles.grid}>
			{plans.map((plan) => (
				<div key={plan.id} className={styles.column}>
					<PlanCard plan={plan} />
				</div>
			))}
		</div>
	);
};

export default PlanList;
