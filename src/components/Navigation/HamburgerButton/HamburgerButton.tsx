import styles from "./HamburgerButton.module.css";

interface HamburgerButtonProps {
	isOpen: boolean;
	onClick: () => void;
}

export const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => {
	return (
		<button
			type="button"
			className={styles.button}
			onClick={onClick}
			aria-label="メニューを開閉"
			aria-expanded={isOpen}
		>
			<span className={styles.line} />
			<span className={styles.line} />
			<span className={styles.line} />
		</button>
	);
};

export default HamburgerButton;
