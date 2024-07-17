import type { OmitWithTag2 } from './core/types.js';
import type { GetTag, GetTagProperty, SomeTaggedRecord } from './record/types/controller.js';
export type SomeTag = string;
export type SomeMatchHandler = (data: string | object) => unknown;
export interface TagMatcherDefinition {
    _tag: 'TagMatcherDefinition';
    tag: string;
    handler: SomeMatchHandler;
}
export interface DataMatcherDefinition {
    _tag: 'DataMatcherDefinition';
    tag: string;
    dataPattern: object;
    handler: SomeMatchHandler;
}
interface Match {
    <Tag extends SomeTag>(tag: Tag): ChainTagPreMatcher<Tag, never>;
    <AlgebraicDataType extends SomeTaggedRecord>(algebraicDataType: AlgebraicDataType): ChainPreMatcher<AlgebraicDataType, never>;
}
export declare const match: Match;
type PickWithTag<Tag extends string, ADT extends SomeTaggedRecord> = ADT extends SomeTaggedRecord<Tag> ? ADT : never;
type ChainPreMatcher<ADT extends SomeTaggedRecord, Result> = {
    [Tag in GetTag<ADT>]: (<ThisResult extends unknown, Pattern extends Partial<OmitWithTag2<PickWithTag<Tag, ADT>>>>(dataPattern: Pattern, handler: (data: Pattern & PickWithTag<Tag, ADT>, test: Pattern) => ThisResult) => ChainPostMatcher<ADT, never, ThisResult | Result>) & (<ThisResult extends unknown>(handler: (data: PickWithTag<Tag, ADT>) => ThisResult) => ChainPostMatcher<ADT, Tag, ThisResult | Result>);
};
/**
 * 1. When an unqualified variant matcher has been defined then
 *    it should not be definable again in the chain since it would
 *    never be called at runtime
 */
type ChainPostMatcher<ADT extends SomeTaggedRecord, TagsPreviouslyMatched extends string, Result> = {
    [Tag in Exclude<GetTag<ADT>, TagsPreviouslyMatched>]: ((<ThisResult extends unknown, Pattern extends Partial<OmitWithTag2<PickWithTag<Tag, ADT>>>>(dataPattern: Pattern, handler: (data: Pattern & PickWithTag<Tag, ADT>) => ThisResult) => ChainPostMatcher<ADT, TagsPreviouslyMatched, '__init__' extends Result ? ThisResult : ThisResult | Result>) & (<ThisResult extends unknown>(handler: (data: PickWithTag<Tag, ADT>) => ThisResult) => ChainPostMatcher<ADT, Tag | TagsPreviouslyMatched, ThisResult | Result>));
} & (Exclude<GetTag<ADT>, TagsPreviouslyMatched> extends never ? {
    done: () => Result;
} : {
    else: <ThisResult extends unknown>(value: ThisResult | ((data: ExcludeByTag<ADT, TagsPreviouslyMatched>) => ThisResult)) => Result | ThisResult;
});
type ChainTagPreMatcher<Tags extends SomeTag, Result> = {
    [ThisTag in Tags]: (<ThisResult extends unknown>(handler: () => ThisResult) => ChainTagPostMatcher<Tags, ThisTag, ThisResult | Result>);
};
type ChainTagPostMatcher<Tags extends SomeTag, TagsPreviouslyMatched extends string, Result> = {
    [ThisTag in Exclude<Tags, TagsPreviouslyMatched>]: (<ThisResult extends unknown>(handler: () => ThisResult) => ChainTagPostMatcher<Tags, ThisTag | TagsPreviouslyMatched, ThisResult | Result>);
} & (Exclude<Tags, TagsPreviouslyMatched> extends never ? {
    done: () => Result;
} : {
    else: <ThisResult extends unknown>(value: ThisResult | ((data: Exclude<Tags, TagsPreviouslyMatched>) => ThisResult)) => Result | ThisResult;
});
type ExcludeByTag<TaggedRecord extends SomeTaggedRecord, Tag extends string> = TaggedRecord extends {
    [k in GetTagProperty<TaggedRecord>]: Tag;
} ? never : TaggedRecord;
export {};
//# sourceMappingURL=match.d.ts.map