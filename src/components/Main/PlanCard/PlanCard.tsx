import type { Plan } from "../../../types/plan";
import styles from "./PlanCard.module.css";

interface PlanCardProps {
	plan: Plan;
	isFeatured?: boolean;
}

export const PlanCard = ({ plan, isFeatured = false }: PlanCardProps) => {
	return (
		<div className={styles.card}>
			{isFeatured && plan.badge && (
				<div className={styles.header}>⭐おすすめプラン⭐</div>
			)}
			<div className={styles.content}>
				<h3 className={styles.planTitle}>{plan.title}</h3>
				<p className={styles.planDetail}>{plan.price}</p>
				<p className={styles.planDetail}>{plan.guests}</p>
				<p className={styles.planDetail}>{plan.roomType}</p>
				<button type="button" className={styles.reserveButton}>
					このプランで予約
				</button>
			</div>
			{isFeatured && plan.badge && (
				<div className={styles.footer}>{plan.badge}</div>
			)}
		</div>
	);
};

export default PlanCard;
