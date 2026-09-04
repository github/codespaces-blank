interface Props {
    types: string[];
    onSelect: (type: string) => void;
}

const COMMAND_ICON_MAP: Record<string, string> = {
    "Essai": "🏉",
    "Transformation": "🎯",
    "Transformation manquée": "❌",
    "Pénalité réussie": "✅",
    "Drop": "🦶",
    "Essai de pénalité": "✅",
    "Pénalité manquée": "❌",
    "Carton jaune": "🟨",
    "Carton rouge": "🟥",
    "Carton orange": "🟧",
    "Changement": "🔁",
    "Saignement": "🩸",
    "Blessure": "🩹",
    "Arbitrage Vidéo": "📺",
};

export default function CommandPanel({ types, onSelect }: Props) {
    return (
        <section className="space-y-2">
        <h2 className="font-semibold">Actions</h2>
        <div className="grid grid-cols-2 items-stretch gap-2 sm:grid-cols-4">
            {types.map((label) => (
            <button
                key={label}
                className="sp-button sp-button-md sp-button-full sp-button-neutral h-full min-h-[4.75rem] flex-col px-2 py-2 text-center text-sm leading-tight whitespace-normal sm:text-base"
                onClick={() => onSelect(label)}
            >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none sm:text-lg" aria-hidden="true">
                    {COMMAND_ICON_MAP[label] ?? "⚪"}
                </span>
                <span className="block min-h-[2.2rem] w-full text-center">{label}</span>
            </button>
            ))}
        </div>
        </section>
    );
}
