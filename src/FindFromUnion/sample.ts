// prettier-ignore
type FindFromUnion<
  Target extends {},
  KeyProp extends keyof Target,
  Key extends Target[KeyProp]
> = Target extends { [x in KeyProp]: Key } ? Target : never

// type FindFromUnion<
//   Target extends {},
//   KeyProp extends keyof Target,
//   Key extends Target[KeyProp]
// > = Extract<Target, Record<KeyProp, Key>>

type SuccessResult = {
  status: "success"
}

type ErrorResult = {
  status: "error"
  errorCode: number
  errorMessage: string
}

type AbortResult = {
  status: "abort"
}

type Result = SuccessResult | ErrorResult | AbortResult

type ResultMap = {
  [ResultStatus in Result["status"]]: FindFromUnion<Result, "status", ResultStatus>
}

/*
ResultMap = {
  success: SuccessResult;
  error: ErrorResult;
  abort: AbortResult;
}
*/

type ResultFuncMap = {
  [ResultStatus in Result["status"]]?: (result: FindFromUnion<Result, "status", ResultStatus>) => void
}
/*
ResultFuncMap = {
  success?: ((result: SuccessResult) => void) | undefined;
  error?: ((result: ErrorResult) => void) | undefined;
  abort?: ((result: AbortResult) => void) | undefined;
}
*/

function createResultHandler(handlerMap: ResultFuncMap): (_: Result) => void {
  return (result) => {
    // キャストしないとエラーになる
    const func = handlerMap[result.status] as ((_: Result) => void) | undefined
    func?.(result)
  }
}

const handler = createResultHandler({
  success() {
    console.log("case success")
  },
  error({ errorCode, errorMessage }) {
    // ↑ 引数の型がちゃんと`ErrorResult`型から推測されている
    console.log("case error", { errorCode, errorMessage })
  },
  abort() {
    console.log("case abort")
  },
})

handler({
  status: "success",
})
// → case success

handler({
  status: "error",
  errorCode: 401,
  errorMessage: "Unauthorized",
})
// → case error { errorCode: 401, errorMessage: 'Unauthorized' }

handler({
  status: "abort",
})
// → case abort
