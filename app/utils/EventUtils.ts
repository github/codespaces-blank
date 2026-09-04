import type { Team, Player, Event } from "~/types/tracker";
import { jsPDF } from "jspdf";
import { formatTime } from "./TimeUtils";

interface PdfColumnData {
    title: string;
    lines: string[];
}

interface PdfSynthesisLayout {
    dateLine?: string;
    scoreLine?: string;
    resumeColumns?: [PdfColumnData, PdfColumnData];
    statsColumns?: [PdfColumnData, PdfColumnData];
    factsTitle?: string;
    factLines?: string[];
}

interface PdfExportOptions {
    title?: string;
    fileName?: string;
    layout?: PdfSynthesisLayout;
}

function sanitizePdfText(value: string): string {
    return (value || "")
        .replace(/\uFE0F/g, "")
        .replace(/🏉/g, "[ESSAI]")
        .replace(/🎯/g, "[TRANSFO]")
        .replace(/✅/g, "[OK]")
        .replace(/❌/g, "[KO]")
        .replace(/🦶/g, "[DROP]")
        .replace(/⚖/g, "[PEN]")
        .replace(/🟨/g, "[CJ]")
        .replace(/🟥/g, "[CR]")
        .replace(/🟧/g, "[CO]")
        .replace(/🔁/g, "[CHG]")
        .replace(/🩸/g, "[SAIGN]")
        .replace(/🩹/g, "[BLES]")
        .replace(/📺/g, "[VIDEO]")
        .replace(/📝/g, "[RECAP]")
        .replace(/📍/g, "[EVT]")
        .replace(/🚨/g, "[ALERTE]")
        .replace(/[—–]/g, "-");
}

function displayTeamName(team: Team): string {
    return team.nickname || team.name.replace(/\s+J\d+$/, "");
}

/**
 * Create an event for a player action
 */
export function createPlayerEvent(
    type: string,
    currentTime: number,
    team: Team,
    player: Player | undefined,
    playerNumber: number | undefined,
    concussion: boolean
): Event {
    return {
        type,
        time: currentTime,
        team,
        player,
        playerNumber,
        concussion,
    };
}

/**
 * Create a substitution event
 */
export function createSubstitutionEvent(
    currentTime: number,
    team: Team,
    playerOut: Player | undefined,
    playerOutNumber: number | undefined,
    playerIn: Player | undefined,
    playerInNumber: number | undefined,
    concussion: boolean
): Event {
    return {
        type: "Changement",
        time: currentTime,
        team,
        playerOut,
        playerOutNumber,
        playerIn,
        playerInNumber,
        concussion,
    };
}

/**
 * Find player number in team composition
 */
export function findPlayerNumberInTeam(team: Team, playerId: string): number | undefined {
    const entry = [...team.starters, ...team.substitutes].find(
        (ent) => ent.player.id === playerId
    );
    return entry?.number;
}

/**
 * Export events summary to clipboard as text
 */
export function exportSummaryToClipboard(
    events: Event[],
    currentTime: number,
    summary: Record<string, number>
): void {
    const lines = [`Feuille de match (time ${formatTime(currentTime)})`];
    
    for (const [type, count] of Object.entries(summary)) {
        lines.push(`${type}: ${count}`);
    }
    
    lines.push("\nEvent timeline:");
    events.forEach((e) => {
        if (e.summary) {
            lines.push(`${formatTime(e.time)} - ${e.summary}`);
        } else {
            let line = `${formatTime(e.time)} - ${e.type}`;
            if (e.team) line += ` (${displayTeamName(e.team)})`;
            if (e.player)
                line += ` — ${e.player.name}${e.playerNumber ? ` (#${e.playerNumber})` : ""}`;
            if (e.playerOut && e.playerIn)
                line += ` — ${e.playerOutNumber ? `#${e.playerOutNumber} ` : ""}${e.playerOut.name} → ${e.playerInNumber ? `#${e.playerInNumber} ` : ""}${e.playerIn.name}`;
            if (e.videoReason)
                line += ` — TMO - ${e.videoReason}`;
            if (e.concussion) line += " 🚨 commotion";
            lines.push(line);
        }
    });
    
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
    alert("Ajouté au presse-papier !");
}

/**
 * Export events summary to PDF file
 */
export function exportSummaryToPdf(
    events: Event[],
    currentTime: number,
    summary: Record<string, number>,
    options?: PdfExportOptions
): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    const bottomLimit = pageHeight - margin;
    const defaultLineHeight = 5;
    let y = margin;

    const ensureSpace = (requiredHeight: number) => {
        if (y + requiredHeight <= bottomLimit) return;
        doc.addPage();
        y = margin;
    };

    const drawWrappedText = (
        text: string,
        opts?: {
            fontSize?: number;
            lineHeight?: number;
            x?: number;
            width?: number;
            bold?: boolean;
            color?: [number, number, number];
        }
    ) => {
        const fontSize = opts?.fontSize ?? 10;
        const lineHeight = opts?.lineHeight ?? defaultLineHeight;
        const x = opts?.x ?? margin;
        const width = opts?.width ?? contentWidth;
        const lines = doc.splitTextToSize(sanitizePdfText(text), width);

        doc.setFontSize(fontSize);
        doc.setFont("helvetica", opts?.bold ? "bold" : "normal");
        const [r, g, b] = opts?.color || [24, 24, 27];
        doc.setTextColor(r, g, b);
        ensureSpace(lines.length * lineHeight + 1);
        doc.text(lines, x, y);
        y += lines.length * lineHeight;
    };

    const drawSectionTitle = (title: string) => {
        y += 2;
        drawWrappedText(title, { fontSize: 11, lineHeight: 5.5, bold: true, color: [39, 39, 42] });
        doc.setDrawColor(212, 212, 216);
        ensureSpace(2);
        doc.line(margin, y + 0.5, margin + contentWidth, y + 0.5);
        y += 3;
    };

    const drawTwoColumns = (
        columns: [PdfColumnData, PdfColumnData],
        valueColors?: [[number, number, number], [number, number, number]]
    ) => {
        const [left, right] = columns;
        const gap = 6;
        const colWidth = (contentWidth - gap) / 2;
        const leftX = margin;
        const rightX = margin + colWidth + gap;
        const paddingX = 3;
        const paddingTop = 4;
        const titleLineHeight = 5;
        const bodyLineHeight = 4.6;

        const prepareColumn = (column: PdfColumnData, width: number) => {
            const titleLines = doc.splitTextToSize(column.title || "", width - paddingX * 2);
            const bodyLines = column.lines.flatMap((line) => doc.splitTextToSize(line || "", width - paddingX * 2));
            const height =
                paddingTop +
                titleLines.length * titleLineHeight +
                2 +
                Math.max(1, bodyLines.length) * bodyLineHeight +
                3;

            return { titleLines, bodyLines, height };
        };

        const leftPrepared = prepareColumn(left, colWidth);
        const rightPrepared = prepareColumn(right, colWidth);
        const blockHeight = Math.max(leftPrepared.height, rightPrepared.height);

        ensureSpace(blockHeight + 2);

        doc.setDrawColor(212, 212, 216);
        doc.setFillColor(250, 250, 250);
        doc.roundedRect(leftX, y, colWidth, blockHeight, 2, 2, "FD");
        doc.roundedRect(rightX, y, colWidth, blockHeight, 2, 2, "FD");

        const drawColumnContent = (
            prepared: { titleLines: string[]; bodyLines: string[] },
            x: number,
            color?: [number, number, number]
        ) => {
            let localY = y + paddingTop;

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(24, 24, 27);
            if (prepared.titleLines.length > 0) {
                doc.text(prepared.titleLines, x + paddingX, localY);
                localY += prepared.titleLines.length * titleLineHeight;
            }

            localY += 2;
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(color ? color[0] : 51, color ? color[1] : 51, color ? color[2] : 51);

            const linesToRender = prepared.bodyLines.length > 0 ? prepared.bodyLines : ["-"];
            doc.text(linesToRender, x + paddingX, localY);
        };

        drawColumnContent(leftPrepared, leftX, valueColors?.[0]);
        drawColumnContent(rightPrepared, rightX, valueColors?.[1]);
        doc.setTextColor(24, 24, 27);
        y += blockHeight + 4;
    };

    const documentTitle = options?.title?.trim() || `Feuille de match (${formatTime(currentTime)})`;
    drawWrappedText(documentTitle, { fontSize: 14, lineHeight: 6.5, bold: true, color: [17, 24, 39] });
    y += 0.5;

    if (options?.layout) {
        if (options.layout.dateLine) {
            drawWrappedText(options.layout.dateLine, { fontSize: 9, lineHeight: 4.5, color: [82, 82, 91] });
            y += 1;
        }

        if (options.layout.scoreLine) {
            drawWrappedText(options.layout.scoreLine, { fontSize: 9, lineHeight: 4.5, bold: true, color: [55, 65, 81] });
            y += 2;
        }

        if (options.layout.resumeColumns) {
            drawSectionTitle("Résumé");
            drawTwoColumns(options.layout.resumeColumns, [[74, 222, 128], [96, 165, 250]]);
        }

        if (options.layout.statsColumns) {
            drawSectionTitle("Statistiques équipes");
            drawTwoColumns(options.layout.statsColumns, [[74, 222, 128], [96, 165, 250]]);
        }

        drawSectionTitle(options.layout.factsTitle || "Faits de match");
        const facts = options.layout.factLines || [];
        if (facts.length === 0) {
                drawWrappedText("Aucun événement.", { fontSize: 9, lineHeight: 4.5, color: [82, 82, 91] });
        } else {
            facts.forEach((line) => {
                    drawWrappedText(`• ${line}`, { fontSize: 9, lineHeight: 4.5, color: [39, 39, 42] });
                y += 0.5;
            });
        }
    } else {
        for (const [type, count] of Object.entries(summary)) {
            drawWrappedText(`${type}: ${count}`, { fontSize: 10, lineHeight: 5 });
        }

        drawSectionTitle("Event timeline");
        events.forEach((e) => {
            if (e.summary) {
                drawWrappedText(`${formatTime(e.time)} - ${e.summary}`, { fontSize: 9, lineHeight: 4.5 });
                return;
            }

            let line = `${formatTime(e.time)} - ${e.type}`;
            if (e.team) line += ` (${displayTeamName(e.team)})`;
            if (e.player) line += ` - ${e.player.name}${e.playerNumber ? ` (#${e.playerNumber})` : ""}`;
            if (e.playerOut && e.playerIn)
                line += ` - ${e.playerOutNumber ? `#${e.playerOutNumber} ` : ""}${e.playerOut.name} -> ${e.playerInNumber ? `#${e.playerInNumber} ` : ""}${e.playerIn.name}`;
            if (e.videoReason) line += ` - TMO - ${e.videoReason}`;
            if (e.concussion) line += " - commotion";

            drawWrappedText(line, { fontSize: 9, lineHeight: 4.5 });
        });
    }
    
    const baseFileName = (options?.fileName?.trim() || "summary")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    doc.save(`${baseFileName || "summary"}.pdf`);
}

/**
 * Build event summary (count by type)
 */
export function buildEventSummary(events: Event[]): Record<string, number> {
    return events.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}

export function buildDetailedEventSummary(events: Event[]): Array<{
    type: string;
    team?: string;
    videoReason?: string;
    player?: string;
    playerNumber?: number;
    playerOut?: string;
    playerOutNumber?: number;
    playerIn?: string;
    playerInNumber?: number;
    concussion?: boolean;
    summary?: string;
}> {
    return events.map((e) => ({
        type: e.type,
        team: e.team ? displayTeamName(e.team) : undefined,
        videoReason: e.videoReason,
        player: e.player?.name,
        playerNumber: e.playerNumber,
        playerOut: e.playerOut?.name,
        playerOutNumber: e.playerOutNumber,
        playerIn: e.playerIn?.name,
        playerInNumber: e.playerInNumber,
        concussion: e.concussion,
        summary: e.summary,
    }));
}
