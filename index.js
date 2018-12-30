let readline = require('readline');
const translate = require('translate');
const fs = require('fs-extra')
const emojiFlags = require('emoji-flags');
const childProcess = require('child_process');
const path = require('path');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
if (!('api' in process.env)) throw 'Вы должны передать Yandex API key в системной переменной названной "api".';
rl.question('Введите слово на русском языке: ', word => {
  translate.engine = 'yandex';
  translate.key = process.env.api;
  let languages = {
    'ru': ['Русский', 'ru'],
    'uk': ['Украинский', 'ua'],
    'en': ['Английский', 'us'],
    'cs': ['Чешский', 'cz'],
    'es': ['Испанский', 'es'],
    'it': ['Итальянский', 'it'],
    'fi': ['Финский', 'fi'],
    'kk': ['Казахский', 'kz'],
    'ja': ['Японский', 'jp'],
    'pl': ['Польский', 'pl'],
  }
  // noinspection JSUnresolvedFunction
  fs.ensureDirSync('./results');
  async function translate_ (array, result = {}) {
    if (!Object.keys(array).length) {
      let result_ = [];
      Object.keys(result).forEach(lang => {
        result_.push(`${emojiFlags.countryCode(Object.values(languages).find(a => a[0] === lang)[1])['emoji']}\n${lang}: ${result[lang]}`);
      });
      console.log(`\n${result_.join('\n')}\n`);
      // noinspection JSUnresolvedFunction
      fs.writeFileSync(`./results/${word}.txt`, result_.join('\n'));
      childProcess.spawn(`${process.platform === 'win32' ? 'notepad' : 'gedit'}`, [`./results/${word}.txt`], {detached: true, stdio: 'ignore'}).unref();
      console.log(`Готово. Если результат не открылся сам - ищите его в results${path.sep}${word}.txt`);
      rl.close();
    } else {
      let language = array.shift();
      result[languages[language][0]] = await translate(word, { from: 'ru', to: language });
      translate_(array, result).catch(console.error);
    }
  }
  translate_(Object.keys(languages)).catch(console.error);
});
