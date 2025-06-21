import Card from "./Card";
import type { BedType } from "./Card";
import styles from "./SpecialCard.module.css";

type Props = {
    tomareru_ninzu: number;
    saitei_ninzu: number;
    plan_money: number;
    bed_type: BedType;
};

function SpecialCard(props: Props) {
    return (
        <div className={styles.wrapper}>
            <p className={styles.recommend}>⭐おすすめプラン⭐</p>
            <Card
                title="お得な特典付きプラン"
                tomareru_ninzu={props.tomareru_ninzu}
                saitei_ninzu={props.saitei_ninzu}
                plan_money={props.plan_money}
                bed_type={props.bed_type}
            />
            <p className={styles.limited}>本日限り</p>
        </div>
    );
}
export default SpecialCard;