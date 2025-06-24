import type { Plan } from "../../../../types/plan";
import PlanCard from "../PlanCard";
import styles from "./FeaturedPlan.module.css";

interface FeaturedPlanProps {
	plan: Plan;
}

export const FeaturedPlan = ({ plan }: FeaturedPlanProps) => {
	return (
		<div className={styles.container}>
			<PlanCard plan={plan} isFeatured={true} />
		</div>
	);
};

export default FeaturedPlan;
