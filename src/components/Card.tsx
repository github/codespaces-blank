import styles from './Card.module.css';

export type BedType = 'シングル' | 'スタンダードツイン' | 'プレミアムツイン' | '部屋指定なし';

type Props = {
    title: string;
    tomareru_ninzu: number;
    saitei_ninzu: number;
    plan_money: number;
    bed_type: BedType;
};

function Card(props: Props) {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{props.title}</h3>
            <p className={styles.info}>大人{props.tomareru_ninzu}名 {props.plan_money}円</p>
            <p className={styles.info}>{props.saitei_ninzu}名様から</p>
            <p className={styles.bed}>{props.bed_type}</p>
            <button className={styles.button}>このプランで予約</button>
        </div>
    );
}

export default Card;