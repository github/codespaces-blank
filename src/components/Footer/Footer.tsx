import styles from "./Footer.module.css";

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<a href="https://github.com" className={styles.link}>
				GitHub
			</a>
			<p className={styles.text}>© 2020-2025 Kensuke Mishima</p>
		</footer>
	);
};

export default Footer;
