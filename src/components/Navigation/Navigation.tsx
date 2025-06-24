import { useState } from "react";
import HamburgerButton from "./HamburgerButton/HamburgerButton";
import NavigationMenu from "./NavigationMenu/NavigationMenu";
import styles from "./Navigation.module.css";

export const Navigation = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<nav className={styles.nav}>
			<HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
			<NavigationMenu isOpen={isMenuOpen} />
		</nav>
	);
};

export default Navigation;
