export interface ICurrency {
  id: string
  symbol: string
  name: string
  precision: number
  code: string
  shortName: string
  sort: number
}

export interface ICurrencyFormatterParseResult {
    positive: boolean
    negative: boolean
    delimiter: string
    sign: string | false
    whole: string
    decimal: string | false
}

export type IParser = (value: string, selection: number) => IParserResult;

export interface IParserResult {
  value: string // значение которое парсим
  selection: number // element.selectionEnd - позиция каретки. При выделении - правая часть выделения
}

export interface ICurrency {
  id: string
  symbol: string
  name: string
  precision: number
  code: string
  shortName: string
  sort: number
}
