import styles from "./PageTitle.module.css";

interface PageTitleProps {
	title: string;
}

export const PageTitle = ({ title }: PageTitleProps) => {
	return <h2 className={styles.title}>{title}</h2>;
};

export default PageTitle;
