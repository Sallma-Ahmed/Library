// constants.js

export const BUTTON_IDS = Object.freeze({
  // Numbers
  ZERO: "0",
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",

  // Operators
  ADD: "+",
  SUBTRACT: "−",
  MULTIPLY: "×",
  DIVIDE: "÷",
  DECIMAL: ".",
  PERCENT: "%",
  COLON: ":",
  PLUS_MINUS: "±",
  POWER: "^",
  UNION: "∪",
  INTERSECTION: "∩",
  ABS: "||",
  OVERLINE: "̅",

  // Comparisons
  EQUALS: "=",
  NOT_EQUAL: "≠",
  GREATER: ">",
  LESS: "<",
  GREATER_EQUAL: "≥",
  LESS_EQUAL: "≤",
  ELEMENT_OF: "∈",
  NOT_ELEMENT_OF: "∉",
  SUBSET: "⊂",
  SUBSET_EQUAL: "⊆",
  NOT_SUBSET: "⊄",
  PI: "π",
  SITA: "⌀",
  // Brackets
  SQUARE_OPEN: "[",
  SQUARE_CLOSE: "]",
  CURLY_OPEN: "⦃",
  CURLY_CLOSE: "⦄",
  PAREN_OPEN: "(",
  PAREN_CLOSE: ")",
  FRACTION: "a/b",
  MIXED_NUMBER: "2½",
  Infinity: "∞",
  MEAN: "(()̅)",
  // Actions
  CLEAR_ALL: "AC",
  DELETE: "DEL",
});

export const OPERATION_TYPE = Object.freeze({
  ADDITION: "addition",
  SUBTRACTION: "subtract",
  MULTIPLICATION: "multiply",
  DIVISION: "divide",
  PERCENT: "percent",
  NONE: "none",
});

export const BUTTON_GROUPS = [
  {
    name: "measurment",
    buttons: [
      { label: "dm", labelAr: "ديسم", action: "typeText", class: "btn" },
      { label: "cm", labelAr: "سم", action: "typeText", class: "btn" },
      { label: "mm", labelAr: "مم", action: "typeText", class: "btn" },
      { label: "cm²", labelAr: "سم²", action: "typeText", class: "btn" },
      { label: "km", labelAr: "كم", action: "typeText", class: "btn" },
      { label: "m", labelAr: "م", action: "typeText", class: "btn" },
      { label: "km²", labelAr: "كم²", action: "typeText", class: "btn" },
      { label: "m²", labelAr: "م²", action: "typeText", class: "btn" },
      { label: "dm²", labelAr: "ديسم²", action: "typeText", class: "btn" },
      { label: "dm³", labelAr: "ديسم³", action: "typeText", class: "btn" },
      { label: "cm³", labelAr: "سم³", action: "typeText", class: "btn" },
      { label: "mm²", labelAr: "مم²", action: "typeText", class: "btn" },

      { label: "mm³", labelAr: "مم³", action: "typeText", class: "btn" },

      { label: "km³", labelAr: "كم³", action: "typeText", class: "btn" },
      { label: "m³", labelAr: "م³", action: "typeText", class: "btn" },
      { label: "s", labelAr: "ثانية", action: "typeText", class: "btn" },
      { label: "L", labelAr: "لتر", action: "typeText", class: "btn" },
      { label: "mL", labelAr: "ملل", action: "typeText", class: "btn" },

      { label: "d", labelAr: "يوم", action: "typeText", class: "btn" },

      { label: "h", labelAr: "ساعة", action: "typeText", class: "btn" },
      { label: "min", labelAr: "دقيقة", action: "typeText", class: "btn" },
      { label: "yr", labelAr: "سنة", action: "typeText", class: "btn" },

      { label: "mo", labelAr: "شهر", action: "typeText", class: "btn" },
      { label: "wk", labelAr: "أسبوع", action: "typeText", class: "btn" },
      { label: "g", labelAr: "جم", action: "typeText", class: "btn" },

      { label: "kg", labelAr: "كجم", action: "typeText", class: "btn" },
      { label: "°C", labelAr: "درجة", action: "typeText", class: "btn" },

      { label: "t", labelAr: "طن", action: "typeText", class: "btn" },
    ],
  },

  {
    name: "letters",
    buttons: [
      { label: "A", action: "typeText", class: "btn" },
      { label: "B", action: "typeText", class: "btn" },
      { label: "C", action: "typeText", class: "btn" },
      { label: "D", action: "typeText", class: "btn" },
      { label: "E", action: "typeText", class: "btn" },
      { label: "F", action: "typeText", class: "btn" },
      { label: "G", action: "typeText", class: "btn" },
      { label: "H", action: "typeText", class: "btn" },
      { label: "I", action: "typeText", class: "btn" },
      { label: "J", action: "typeText", class: "btn" },
      { label: "K", action: "typeText", class: "btn" },
      { label: "L", action: "typeText", class: "btn" },
      { label: "M", action: "typeText", class: "btn" },
      { label: "N", action: "typeText", class: "btn" },
      { label: "O", action: "typeText", class: "btn" },
      { label: "P", action: "typeText", class: "btn" },
      { label: "Q", action: "typeText", class: "btn" },
      { label: "R", action: "typeText", class: "btn" },
      { label: "S", action: "typeText", class: "btn" },
      { label: "T", action: "typeText", class: "btn" },
      { label: "U", action: "typeText", class: "btn" },

      { label: "V", action: "typeText", class: "btn" },
      { label: "W", action: "typeText", class: "btn" },
      { label: "X", action: "typeText", class: "btn" },
      { label: "Y", action: "typeText", class: "btn" },
      { label: "Z", action: "typeText", class: "btn" },
    ],
  },
  {
    name: "signs",
    buttons: [
      // Operators
      { label: ":", action: "typeText", class: "btn" },
      { label: "±", action: "typeText", class: "btn" },
      { label: "π", action: "typeText", class: "btn" },
      { label: "%", action: "typeText", class: "btn" },
      { label: "(", action: "typeText", class: "btn" },
      { label: ")", action: "typeText", class: "btn" },

      { label: "≠", action: "typeText", class: "btn" },

      { label: "+", action: "typeText", class: "btn" },
      { label: "−", action: "typeText", class: "btn" },
      { label: "⌀", action: "typeText", class: "btn" },

      { label: "×", action: "typeText", class: "btn" },
      { label: "÷", action: "typeText", class: "btn" },
      { label: "7", action: "typeText", class: "btn" },
      { label: "8", action: "typeText", class: "btn" },
      { label: "9", action: "typeText", class: "btn" },
      { label: "4", action: "typeText", class: "btn" },
      { label: "5", action: "typeText", class: "btn" },
      { label: "6", action: "typeText", class: "btn" },
      { label: "1", action: "typeText", class: "btn" },
      { label: "2", action: "typeText", class: "btn" },
      { label: "3", action: "typeText", class: "btn" },

      { label: ",", action: "typeText", class: "btn" },
      { label: "0", action: "typeText", class: "btn" },

      { label: ".", action: "typeText", class: "btn" },
      { label: "DEL", action: "clearOneInput", class: "del-btn" },
      { label: "AC", action: "deleteAllInputs", class: "del-btn" },
      { label: "=", action: "calculate", class: "btn" },
      {
        label: "",
        value: BUTTON_IDS.FRACTION,
        action: "typeText",
        class: " fraction-img",
      },
      {
        label: "",
        value: BUTTON_IDS.MIXED_NUMBER,
        action: "typeText",
        class: " mixed-img",
      },
      //power
      //       {
      //   label: "",
      //   action: "typeText",
      //   class: " power",
      // },
      // Brackets
 
      { label: "⦃", action: "typeText", class: "btn" },
      { label: "⦄", action: "typeText", class: "btn" },
      { label: "≅", action: "typeText", class: "btn" },
           { label: "[", action: "typeText", class: "btn" },
      { label: "]", action: "typeText", class: "btn" },
      // Special constants & symbols
      { label: "≆ ", action: "typeText", class: "btn" },

            { label: "∉ ", action: "typeText", class: "btn" },
      { label: "∈ ", action: "typeText", class: "btn" },
      { label: "⊆", action: "typeText", class: "btn" },
            { label: "⊂", action: "typeText", class: "btn" },
      { label: "≉ ", action: "typeText", class: "btn" },
      { label: "≈", action: "typeText", class: "btn" },

      { label: "||", action: "typeText", class: "btn" },
      { label: "∩", action: "typeText", class: "btn" },
                  { label: "∪", action: "typeText", class: "btn" },

      { label: ">", action: "typeText", class: "btn" },
      { label: "<", action: "typeText", class: "btn" },
      {
  label: "",              
  action: "insertMean",
  class: " mean",      
}
,

      { label: "≥", action: "typeText", class: "btn" },
      { label: "≤", action: "typeText", class: "btn" },
     
    ],
  },
];
