import styles from "./NavigationMenu.module.css";

interface NavigationMenuProps {
	isOpen: boolean;
}

export const NavigationMenu = ({ isOpen }: NavigationMenuProps) => {
	return (
		<ul className={`${styles.menu} ${isOpen ? styles.menuOpen : ""}`}>
			<li className={styles.menuItem}>
				<a href="/" className={styles.menuLink}>
					ホーム
				</a>
			</li>
			<li className={styles.menuItem}>
				<a
					href="/reserve"
					className={`${styles.menuLink} ${styles.activeLink}`}
				>
					宿泊予約
				</a>
			</li>
			<li className={styles.menuItem}>
				<a href="/register" className={styles.menuLink}>
					会員登録
				</a>
			</li>
			<li className={styles.menuItem}>
				<a href="/login" className={`${styles.menuLink} ${styles.loginButton}`}>
					ログイン
				</a>
			</li>
		</ul>
	);
};

export default NavigationMenu;
