import i18n, { InitOptions, ThirdPartyModule } from 'i18next';

import * as en from './json/en.json';
import * as ja from './json/ja.json';
import * as zhS from './json/zh-hans.json';
import * as zhT from './json/zh-hant.json';
import { inBrowser, inServer, isDevBuild } from '../config/build-env';
import { createLogger } from '../util/debug-logger';

const logger = createLogger(__filename);

export const enum LangCode {
  en = 'en',
  ja = 'ja',
  zhHanS = 'zh-hans',
  zhHanT = 'zh-hant',
}

export const LangMap = [
  /* [browser-language, our-language, label] */ [/^en/i, LangCode.en, 'English'],
  [/^zh-(cn|sg)/i, LangCode.zhHanS, '简体中文'],
  [/^zh/i, LangCode.zhHanT, '繁體中文'],
  [/^ja/i, LangCode.ja, '日本語'],
] as const;

function pickFallbackLanguages(wanted: LangCode) {
  switch (wanted) {
    case LangCode.ja:
      return [LangCode.zhHanT, LangCode.zhHanS, LangCode.en];
    case LangCode.zhHanT:
      return [LangCode.zhHanS, LangCode.ja, LangCode.en];
    case LangCode.zhHanS:
      return [LangCode.zhHanT, LangCode.ja, LangCode.en];
    case LangCode.en:
    default:
      return [LangCode.ja, LangCode.zhHanS, LangCode.zhHanT];
  }
}

const defaultI18nOptions: InitOptions = {
  defaultNS: 'all',
  ns: ['all'],
  resources: {
    /* eslint-disable @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    [LangCode.en]: { all: en.default },
    // @ts-ignore
    [LangCode.zhHanT]: { all: zhT.default },
    // @ts-ignore
    [LangCode.zhHanS]: { all: zhS.default },
    // @ts-ignore
    [LangCode.ja]: { all: ja.default },
    /* eslint-enable @typescript-eslint/ban-ts-ignore */
  },
};

export function createI18nInstance(lng: LangCode, forSsr: boolean, modules?: ThirdPartyModule[]) {
  const fallbackLangs = pickFallbackLanguages(lng);

  let boundInstance = i18n.createInstance({
    ...defaultI18nOptions,
    initImmediate: !forSsr,
    lng,
    fallbackLng: fallbackLangs,
  });

  modules?.forEach((m) => (boundInstance = boundInstance.use(m)));

  boundInstance.init();

  if (inBrowser && isDevBuild) {
    logger('inited i18n', boundInstance);
  }
  return boundInstance;
}
