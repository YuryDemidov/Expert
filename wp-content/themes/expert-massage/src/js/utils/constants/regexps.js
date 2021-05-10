export const REGEXPS = {
  AUTH_CODE: /^[0-9]{4}$/,
  EMAIL: /^[A-Za-z0-9\-_.]+@[A-Za-z0-9\-_.]+\.[A-Za-z]{2,}$/,
  HAS_DIGIT: /\d/,
  NON_DIGIT: /^\D*$/,
  PHONE_SYMBOLS: /^[0-9+()\s-]+$/,
  SPAM_SYMBOLS_COMBINATION: /(((\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2})|(<[A-z])|(\.php)|(\.html)|(\.рф\/)|(\.su)|(Азия-Трейдинг)|(\(точка\))|(\(тире\))|((www\.)(?!expert-massage-clinic))|((http)(?!s:\/\/expert-massage-clinic)))/
}
