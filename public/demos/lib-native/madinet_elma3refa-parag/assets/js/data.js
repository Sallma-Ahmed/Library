export function getStrings() {
  let correctWords = [
    {
      type: 1,
      text: "رائع! إجابتُك صحيحةٌ.",
    },
    {
      type: 2,
      text: "أحسَنْت!",
    },
    {
      type: 3,
      text: "ممتاز!",
    },
    {
      type: 4,
      text: "إجابةٌ صحيحةٌ. ",
    },
  ];
  let clickText = "هل تحتاجُ إلى بعضِ المُساعَدةِ؟ انقُرْ على المِصباحِ.";
  let wrogWordsSelect =
    "لمعرفةِ الإجابةِ الصحيحةِ؛ اضغَطْ على زِرِّ إظهارِ الإجابةِ.";
  let wrogWords = [
    {
      type: 1,
      text: "غَيرُ صحيحٍ! حافِظْ على تركيزِك.",
    },
    {
      type: 2,
      text: "غَيرُ صحيحٍ! فكِّرْ جيدًا قبلَ الإجابةِ.",
    },
    {
      type: 3,
      text: "إجابةٌ غَيرُ صحيحةٍ! ربما في المرةِ المُقبِلةِ.",
    },
    {
      type: 4,
      text: "إجابةٌ غَيرُ صحيحةٍ! لكن لا تدَعْ هذا يُوقِفُك.",
    },
    {
      type: 5,
      text: "غَيرُ صحيحٍ! استمِرَّ في المُحاوَلةِ.",
    },
  ];
  let readText = "اقرَأ الفِقرةَ جيدًا";
  let questionHintTitle = [
    "اضغَطْ على الإجابةِ الصحيحةِ.",
    "اضغَطْ على العلامةِ المُناسِبة.",
    "ظلِّلِ الإجابةَ داخلَ الفِقرةِ.",
    "هناك أربعُ كَلِماتٍ خطأ في الفِقرةِ، ابحَثْ عنها.",
    "والآن اضغَطْ على التصويب المُناسِب للكَلِمة الخطأ.",
  ];
  let instractions = [
    {
      parag: "اضغط على هذا الرمز لفتح أو غلق الموسيقى.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/muisc.png",
    },
    {
      parag: "اضغط على هذا الرمز للعودة إلى الشاشة الرئيسة.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/home.png",
    },
    {
      parag: "اضغط على زر <span>تم</span> للذهاب إلى أسئلة القطعة. ",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/done.png",
      class: "done",
    },
    {
      parag:
        "اضغط على هذا الرمز للعودة إلى شاشة القطعة والذهاب للأسئلة مرة أخرى.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/min.png",
      class: "twoImg",
    },
    {
      parag: "اضغط على هذا الرمز لسماع أو إيقاف صوت القطعة.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/play.png",
      class: "twoImg",
    },
    {
      parag: "اضغط على هذا الرمز لإعادة سماع صوت القطعة من البداية.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/sound.png",
    },
    {
      parag: "اضغط على هذا الرمز للتأكد من صحة الإجابة.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/check.png",
    },

    {
      parag: "اضغط على هذا الرمز لمسح تحديد الكلمة.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/reload.png",
    },
    {
      parag: "اضغط على زر <span>إظهار الإجابة</span> عند الإجابة بشكل خطأ.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/showanswer.png",
      class: "showanswer",
    },
    {
      parag:
        "اضغط على هذا الرمز حتى تحصل على مساعدة واحدة في كل سؤال عدا سؤال «حدِّد الكلمات الخطأ» فلك فيها وسيلتان للمساعدة.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/msbaha.png",
      class: "masbah",
    },
    {
      parag: "يشير هذا الرمز إلى المدة الزمنية المخصصة لحل كل سؤال.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/timer.png",
      class: "timer",
    },
    {
      parag: "يشير هذا الرمز إلى مدى التقدم في حل الأسئلة.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/progress.png",
      class: "progress",
    },
    {
      parag:
        "اضغط على هذه الرموز للتنقل بين الشاشات لمراجعة إجاباتك عن الأسئلة.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/next.png",
      class: "twoImg",
    },
    {
      parag: "اضغط على هذا الرمز للعودة إلى الشاشة الرئيسة.",
      img: "../../../lib-native/madinet_elma3refa-parag/assets/images/icons/exit.png",
    },
  ];
 return {
    correctWords,
    clickText,
    wrogWordsSelect,
    wrogWords,
    readText,
    questionHintTitle,
    instractions,
  };
}
