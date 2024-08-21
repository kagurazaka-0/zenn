---
title: "TypeScriptで型安全かつ可変長引数に対応したzip関数を実装する"
emoji: "📂"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["TypeScript"]
published: true
---

```ts
type UnwrapTupleArray<T extends any[][]> = {
  [Index in keyof T]: T[Index][number]
}

function zip<T extends any[][]>(...tupleArray: T): UnwrapTupleArray<T>[] {
  // 最も短いlengthを取得
  const length = Math.min(...tupleArray.map(array => array.length))

  // 各配列の対応する要素をまとめて配列にする
  return Array.from({ length }, (_, i) => tupleArray.map(array => array[i]) as UnwrapTupleArray<T>)
}

// 使用例
const _1To100 = Array.from({ length: 100 }, (_, i) => i + 1)
const _aToZ = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97))

const result1 = zip(_1To100, _aToZ)
// result1 is [string, number][]
console.log(result1)
// output: [[1, 'a'], [2, 'b'], [3, 'c'], ... [26, 'z']]

const result2 = zip(_1To100, _aToZ, ["@1", "@2", "@3"])
// result2 is [string, number, string[]][]
console.log(result2)
// output: [[1, 'a', '@1'], [2, 'b', '@2'], [3, 'c', '@3']]

const result3 = zip(_1To100, _aToZ, ["@1", "@2", "@3"] as const)
// result3 is [string, number, "@1" | "@2" | "@3][]
console.log(result3)
// output: [[1, 'a', '@1'], [2, 'b', '@2'], [3, 'c', '@3']]
```

[Playground](https://www.typescriptlang.org/play/#code/C4TwDgpgBAqgdgdwE4EMwBUCuYA2ECCSqIAPOlBAB7ARwAmAzlCnCANoC6nAfFALxQA3gCgoUNgEl6VKAEs4UANYQQAewBmUdBwBcWydMpc4mALYAjCEg7CAvsOHrMcAMbBZqhQC9ZYMhWpaRmZWTh4ACgA6aOBsPEJiPXQASj14ZDQsXAIiFFJ0bk4hUSgAelKoQABzQCCGQFv3QBEGPDgAc2AAC0AkhkA15UB0-RKXTwZgKCbWtv4oAFkUdsjTeSiYuJziObRw8JRckGT+Xi3V0fbk5IcxcqhAEBVAWUTAdCVAOwZAP+1AHf1ATQZAaIZAQMjAAl8OwD8GQAWDIBAhkAZgx3QDWDB8SkgILEkAoEnlIuokKpTOFBCNaGMoLYADRQcIAfQJsl2fF4sWyiJAazAGwOeXJ+22bFkHF2KCY6VQGGWNLI3FO9mEF0A-vKACldANHywgGcCGUCJAEZ0KolQAGdUTGnI1HozFHNp6DVa-GEklyZlyKAAaigStOcoVRJQqoAWtrtrq0RisS12noAEwANlxBOJpKtAGVgEh5M1vaYAMJtLZJ1R0CDhWS2qAATgA7CcHE7hjCGJgcMAlRMfPTlaqTQSXe7Thdy5Xq3ImGwhnGWgSTBYrFwbE7VHhIjhVM1wh2qw7RRVVJhgGBV3o2GwlQSAOQoXccAlsQN78yH48AZj3LgvUGikXEIb3XkPNllgzLEArVcDtd8xIqmqmrNq6qhuseABEAACSqQQSMGBvBUAwZekEckuUDzsAf6yD2fbxoOZiWEgBIES0nCjh+8oThAU4znO36doGbbLqu67AJu257gee6wXeJ5nrufGBgJ15QLut58Zeb4lp+WFMVWl7-vWQFNoqYEQeIMFwQh0FIXpaEcMwTClqxCk-sAyl4eI5HNERw6kShsGQVAAA+zlIe5zmXlR46TtOs7YZe5krmuG7iNxEm8RJ-FHk+QkiWJN7CbFMkcDYQA)

## UnwrapTupleArrayの解説

```ts
type UnwrapTupleArray<T extends any[][]> = {
  [Index in keyof T]: T[Index][number]
}
```

`UnwrapTupleArray`は配列(`T[]`とする)を含むtuple型から、`T`だけ取り出したtuple型を生成する
例えば`[number[], string[], Date[]]`という型が与えられた場合、`[number, string, Date]`という型が生成される

## zip関数の解説(by ChatGPT)

この関数は、複数の配列を受け取り、それらの配列の対応する要素をまとめた新しい配列を返します。例えば、`zip([1, 2], ['a', 'b'])`とすると、`[[1, 'a'], [2, 'b']]`が返されます。
