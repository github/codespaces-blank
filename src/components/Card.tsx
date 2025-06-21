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
        <div>
            <h3>{props.title}</h3>
            <p>大人{props.tomareru_ninzu}名 {props.plan_money}円</p>
            <p>{props.saitei_ninzu}名様から</p>
            <p>{props.bed_type}</p>
            <button>このプランで予約</button>
        </div>
    );
}

export default Card;