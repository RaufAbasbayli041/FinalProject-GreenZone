import fs from "fs";
import translate from "@vitalets/google-translate-api";

const filePath = './contexts/language-context.tsx'; // путь к твоему файлу
const outputPath = "./language-context-updated.tsx"; // куда сохранять новый файл

async function autoTranslate() {
  const content = fs.readFileSync(filePath, "utf-8");

  // Ищем объект translations внутри файла
  const match = content.match(/const translations = ({[\s\S]*?});/);
  if (!match) {
    console.error("Не удалось найти объект translations в файле.");
    return;
  }

  const translationsObj = eval("(" + match[1] + ")"); // получаем объект translations
  const english = translationsObj.en;

  const languages = ["az", "ru"];

  for (const lang of languages) {
    if (!translationsObj[lang]) translationsObj[lang] = {};
    for (const key in english) {
      if (!translationsObj[lang][key]) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const res = await translate(english[key], { to: lang });
          translationsObj[lang][key] = res.text;
        } catch (err) {
          console.error(`Ошибка перевода "${key}" на ${lang}:`, err);
          translationsObj[lang][key] = english[key]; // оставляем оригинал
        }
      }
    }
  }

  // Создаём новый текст файла
  const newContent = content.replace(
    /const translations = ({[\s\S]*?});/,
    `const translations = ${JSON.stringify(translationsObj, null, 2)};`
  );

  fs.writeFileSync(outputPath, newContent, "utf-8");
  console.log("Файл с обновлёнными переводами сохранён как", outputPath);
}

autoTranslate();
