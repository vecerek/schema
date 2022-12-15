/**
 * @since 1.0.0
 */

import * as Order from "@fp-ts/core/typeclass/Order"
import { pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import type { Option } from "@fp-ts/data/Option"
import * as O from "@fp-ts/data/Option"
import * as RA from "@fp-ts/data/ReadonlyArray"
import type { Provider } from "@fp-ts/schema/Provider"

/**
 * @since 1.0.0
 */
export type AST =
  | TypeAliasDeclaration
  | LiteralType
  | UndefinedKeyword
  | NeverKeyword
  | UnknownKeyword
  | AnyKeyword
  | StringKeyword
  | NumberKeyword
  | BooleanKeyword
  | BigIntKeyword
  | SymbolKeyword
  | Struct
  | Tuple
  | Union
  | Lazy

/**
 * @since 1.0.0
 */
export interface TypeAliasDeclaration {
  readonly _tag: "TypeAliasDeclaration"
  readonly id: symbol
  readonly config: Option<unknown>
  readonly provider: Provider
  readonly typeParameters: ReadonlyArray<AST>
  readonly type: AST
}

/**
 * @since 1.0.0
 */
export const typeAliasDeclaration = (
  id: symbol,
  config: Option<unknown>,
  provider: Provider,
  typeParameters: ReadonlyArray<AST>,
  type: AST
): TypeAliasDeclaration => ({
  _tag: "TypeAliasDeclaration",
  id,
  config,
  provider,
  typeParameters,
  type
})

/**
 * @since 1.0.0
 */
export type Literal = string | number | boolean | null | bigint | symbol

/**
 * @since 1.0.0
 */
export interface LiteralType {
  readonly _tag: "LiteralType"
  readonly literal: Literal
}

/**
 * @since 1.0.0
 */
export const literalType = (literal: Literal): LiteralType => ({
  _tag: "LiteralType",
  literal
})

/**
 * @since 1.0.0
 */
export interface UndefinedKeyword {
  readonly _tag: "UndefinedKeyword"
}

/**
 * @since 1.0.0
 */
export const undefinedKeyword: UndefinedKeyword = {
  _tag: "UndefinedKeyword"
}

/**
 * @since 1.0.0
 */
export interface NeverKeyword {
  readonly _tag: "NeverKeyword"
}

/**
 * @since 1.0.0
 */
export const neverKeyword: NeverKeyword = {
  _tag: "NeverKeyword"
}

/**
 * @since 1.0.0
 */
export interface UnknownKeyword {
  readonly _tag: "UnknownKeyword"
}

/**
 * @since 1.0.0
 */
export const unknownKeyword: UnknownKeyword = {
  _tag: "UnknownKeyword"
}

/**
 * @since 1.0.0
 */
export interface AnyKeyword {
  readonly _tag: "AnyKeyword"
}

/**
 * @since 1.0.0
 */
export const anyKeyword: AnyKeyword = {
  _tag: "AnyKeyword"
}

/**
 * @since 1.0.0
 */
export interface StringKeyword {
  readonly _tag: "StringKeyword"
}

/**
 * @since 1.0.0
 */
export const stringKeyword: StringKeyword = {
  _tag: "StringKeyword"
}

/**
 * @since 1.0.0
 */
export interface NumberKeyword {
  readonly _tag: "NumberKeyword"
}

/**
 * @since 1.0.0
 */
export const numberKeyword: NumberKeyword = {
  _tag: "NumberKeyword"
}

/**
 * @since 1.0.0
 */
export interface BooleanKeyword {
  readonly _tag: "BooleanKeyword"
}

/**
 * @since 1.0.0
 */
export const booleanKeyword: BooleanKeyword = {
  _tag: "BooleanKeyword"
}

/**
 * @since 1.0.0
 */
export interface BigIntKeyword {
  readonly _tag: "BigIntKeyword"
}

/**
 * @since 1.0.0
 */
export const bigIntKeyword: BigIntKeyword = {
  _tag: "BigIntKeyword"
}

/**
 * @since 1.0.0
 */
export interface SymbolKeyword {
  readonly _tag: "SymbolKeyword"
}

/**
 * @since 1.0.0
 */
export const symbolKeyword: SymbolKeyword = {
  _tag: "SymbolKeyword"
}

/**
 * @since 1.0.0
 */
export interface Field {
  readonly key: PropertyKey
  readonly value: AST
  readonly optional: boolean
  readonly readonly: boolean
}

/**
 * @since 1.0.0
 */
export const field = (
  key: PropertyKey,
  value: AST,
  optional: boolean,
  readonly: boolean
): Field => ({ key, value, optional, readonly })

/**
 * @since 1.0.0
 */
export interface IndexSignature {
  readonly key: "string" | "symbol"
  readonly value: AST
  readonly readonly: boolean
}

/**
 * @since 1.0.0
 */
export const indexSignature = (
  key: "string" | "symbol",
  value: AST,
  readonly: boolean
): IndexSignature => ({ key, value, readonly })

/**
 * @since 1.0.0
 */
export interface Struct {
  readonly _tag: "Struct"
  readonly fields: ReadonlyArray<Field>
  readonly indexSignatures: ReadonlyArray<IndexSignature>
}

const getCardinality = (ast: AST): number => {
  switch (ast._tag) {
    case "TypeAliasDeclaration":
      return getCardinality(ast.type)
    case "NeverKeyword":
      return 0
    case "LiteralType":
    case "UndefinedKeyword":
      return 1
    case "BooleanKeyword":
      return 2
    case "StringKeyword":
    case "NumberKeyword":
    case "BigIntKeyword":
    case "SymbolKeyword":
      return 3
    case "UnknownKeyword":
    case "AnyKeyword":
      return 4
    default:
      return 5
  }
}

const sortByCardinalityAsc = RA.sort(
  pipe(Number.Order, Order.contramap(({ value }: { readonly value: AST }) => getCardinality(value)))
)

/**
 * @since 1.0.0
 */
export const struct = (
  fields: ReadonlyArray<Field>,
  indexSignatures: ReadonlyArray<IndexSignature>
): Struct => ({
  _tag: "Struct",
  fields: sortByCardinalityAsc(fields),
  indexSignatures: sortByCardinalityAsc(indexSignatures)
})

/**
 * @since 1.0.0
 */
export const isStruct = (ast: AST): ast is Struct => ast._tag === "Struct"

/**
 * @since 1.0.0
 */
export interface Component {
  readonly value: AST
  readonly optional: boolean
}

/**
 * @since 1.0.0
 */
export const component = (value: AST, optional: boolean): Component => ({
  value,
  optional
})

/**
 * @since 1.0.0
 */
export interface Tuple {
  readonly _tag: "Tuple"
  readonly components: ReadonlyArray<Component>
  readonly rest: Option<AST>
  readonly readonly: boolean
}

/**
 * @since 1.0.0
 */
export const tuple = (
  components: ReadonlyArray<Component>,
  rest: Option<AST>,
  readonly: boolean
): Tuple => ({ _tag: "Tuple", components, rest, readonly })

/**
 * @since 1.0.0
 */
export const isTuple = (ast: AST): ast is Tuple => ast._tag === "Tuple"

/**
 * @since 1.0.0
 */
export interface Union {
  readonly _tag: "Union"
  readonly members: readonly [AST, AST, ...Array<AST>]
}

const getWeight = (ast: AST): number => {
  switch (ast._tag) {
    case "TypeAliasDeclaration":
      return getWeight(ast.type)
    case "Tuple":
      return ast.components.length + (O.isSome(ast.rest) ? 1 : 0)
    case "Struct":
      return ast.fields.length + ast.indexSignatures.length
    case "Union":
      return ast.members.reduce((n, member) => n + getWeight(member), 0)
    case "Lazy":
      return 10
    default:
      return 0
  }
}

const sortByWeightDesc = RA.sort(
  Order.reverse(pipe(Number.Order, Order.contramap(getWeight)))
)

/**
 * @since 1.0.0
 */
export const union = (candidates: ReadonlyArray<AST>): AST => {
  const uniq = RA.uniq(pipe(
    candidates,
    RA.flatMap((ast: AST): ReadonlyArray<AST> => isUnion(ast) ? ast.members : [ast])
  ))
  switch (uniq.length) {
    case 0:
      return neverKeyword
    case 1:
      return uniq[0]
    default: {
      // @ts-expect-error (TypeScript doesn't know that `members` has >= 2 elements after sorting)
      return { _tag: "Union", members: sortByWeightDesc(uniq) }
    }
  }
}

/**
 * @since 1.0.0
 */
export const isUnion = (ast: AST): ast is Union => ast._tag === "Union"

/**
 * @since 1.0.0
 */
export interface Lazy {
  readonly _tag: "Lazy"
  readonly f: () => AST
}

/**
 * @since 1.0.0
 */
export const lazy = (f: () => AST): Lazy => ({ _tag: "Lazy", f })

/**
 * @since 1.0.0
 */
export const keyof = (ast: AST): ReadonlyArray<PropertyKey> => {
  switch (ast._tag) {
    case "TypeAliasDeclaration":
      return keyof(ast.type)
    case "Tuple":
      return ast.components.map((_, i) => String(i))
    case "Struct":
      return ast.fields.map((field) => field.key)
    case "Union": {
      let out: ReadonlyArray<PropertyKey> = keyof(ast.members[0])
      for (let i = 1; i < ast.members.length; i++) {
        out = RA.intersection(keyof(ast.members[i]))(out)
      }
      return out
    }
    case "Lazy":
      return keyof(ast.f())
    default:
      return []
  }
}

/**
 * @since 1.0.0
 */
export const pick = (ast: AST, keys: ReadonlyArray<PropertyKey>): Struct => {
  return struct(
    getFields(ast).filter((field) => keys.includes(field.key)),
    []
  )
}

/**
 * @since 1.0.0
 */
export const omit = (ast: AST, keys: ReadonlyArray<PropertyKey>): Struct => {
  return struct(
    getFields(ast).filter((field) => !keys.includes(field.key)),
    []
  )
}

/** @internal */
export const getFields = (
  ast: AST
): ReadonlyArray<Field> => {
  switch (ast._tag) {
    case "TypeAliasDeclaration":
      return getFields(ast.type)
    case "Tuple":
      return ast.components.map((c, i) => field(i, c.value, c.optional, true))
    case "Struct":
      return ast.fields
    case "Union": {
      const fields = pipe(ast.members, RA.flatMap(getFields))
      return keyof(ast).map((key) => {
        const members = fields.filter((field) => field.key === key)
        return field(
          key,
          union(members.map((field) => field.value)),
          members.some((field) => field.optional),
          members.some((field) => field.readonly)
        )
      })
    }
    case "Lazy":
      return getFields(ast.f())
    default:
      return []
  }
}

const orUndefined = (ast: AST): AST => union([undefinedKeyword, ast])

/**
 * @since 1.0.0
 */
export const partial = (ast: AST): AST => {
  if (isStruct(ast)) {
    return struct(
      ast.fields.map((f) => field(f.key, f.value, true, f.readonly)),
      ast.indexSignatures
    )
  } else if (isTuple(ast)) {
    return tuple(
      ast.components.map((c) => component(c.value, true)),
      pipe(ast.rest, O.map(orUndefined)),
      ast.readonly
    )
  } else if (isUnion(ast)) {
    return union(ast.members.map(partial))
  }
  return ast
}
