export interface DirectiveLike {
    name: string;
    args: Record<string, any>;
}
export declare const toGraphQLDirective: (directive: DirectiveLike) => string;
export declare const toGraphQLDirectiveArgs: (args: object) => string;
//# sourceMappingURL=directive.d.ts.map