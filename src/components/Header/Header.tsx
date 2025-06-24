import Navigation from "../Navigation/Navigation";
import styles from "./Header.module.css";

export const Header = () => {
	return (
		<header className={styles.header}>
			<h1 className={styles.title}>HOTEL PLANISPHERE</h1>
			<Navigation />
		</header>
	);
};

export default Header;
