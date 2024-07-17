import stringLength from 'string-length';
export type Line = string;
export type Column = Line[];
export type Row = Column[];
export declare const line: (text?: string) => string;
export declare const getLength: typeof stringLength;
export declare const mapLines: (text: string, fn: (line: string, index: number) => string) => string;
export declare const joinColumns: (cols: Row, separator: string) => string;
export declare const minSpan: (alignContent: 'left' | 'right', width: number, content: string) => string;
export declare const padWithin: (side: 'left' | 'right', size: number, char: string, text: string) => string;
export declare const pad: (side: 'left' | 'right', size: number, char: string, text: string) => string;
export declare const underline: (string: string) => string;
export declare const joinListEnglish: (list: string[]) => string;
interface ColSpec {
    lines: string[];
    width?: number | undefined;
    separator?: string | undefined;
}
export declare const col: (params: ColSpec) => ColSpec;
export declare const row: (columns: ColSpec[]) => string;
export declare const toEnvarNameCase: (name: string) => string;
export declare const lines: (width: number, text: string) => string[];
export declare const chars: {
    readonly arrowRight: "→";
    readonly borders: {
        readonly vertical: "│";
        readonly horizontal: "─";
        readonly leftTop: "┌";
        readonly leftBottom: "└";
        readonly rightTop: "┐";
        readonly rightBottom: "┘";
    };
    readonly lineH: "─";
    readonly lineHBold: "━";
    readonly x: "✕";
    readonly check: "✓";
    readonly newline: "\n";
    readonly space: " ";
    readonly pipe: "|";
};
export declare const indentBlock: (text: string, symbol?: string) => string;
export declare const fromLines: (column: Column) => string;
export declare const toLines: (text: string) => Column;
export declare const indentColumn: (column: Column, symbolOrSymbolMaker?: string | ((lineNumber: number) => string)) => Column;
export declare const indentBlockWith: (text: string, indenter: (line: Line, index: number) => Line) => string;
export declare const indentColumnWith: (column: Column, indenter: (line: Line, index: number) => Line) => Column;
export declare const defaultColumnSeparator: string;
export declare const visualStringTake: (string: string, size: number) => string;
export declare const maxWidth: (string: string) => number;
export declare const measure: (string: string) => {
    height: number;
    maxWidth: number;
};
export declare const visualStringTakeWords: (string: string, size: number) => {
    taken: string;
    remaining: string;
};
export {};
//# sourceMappingURL=Text.d.ts.map