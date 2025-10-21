export function chooseWord(index, word, question, wordsPunctuate) {
  let child = index + 1;
  var nthChildSelector = "div:nth-child(" + child + ")";
  var divElement = document.querySelector(".active .question");
  let nthPElement = divElement.querySelector(nthChildSelector);
  let indexChoose = null;
  let success = false;
  let showChoosesPunctuate = false;
  let choosesPunctuate = [];
  let wrongWord = null;

  question.wrongWord.forEach((wrongWordx) => {
    if (wrongWordx.word == wordsPunctuate[index].trim()) {
      nthPElement.classList.add("true");
      indexChoose = index;
      success = true;
      showChoosesPunctuate = true;
      choosesPunctuate = wrongWordx.chooses;
      wrongWord = wrongWordx;
    }
  });
  return {
    success,
    indexChoose,
    showChoosesPunctuate,
    choosesPunctuate,
    wrongWord,
  };
}
export function checkChoose(
  event,
  choose,
  question,
  wordsPunctuate,
  wrongWord,
  indexChoose,
  solvedStyle
) {
  let child = indexChoose + 1;
  var nthChildSelector = "div:nth-child(" + child + ")";
  var divElement = document.querySelector(".active .question");
  let nthPElement = divElement.querySelector(nthChildSelector);
  choose.check = true;
  let success = false;

  if (choose.answer) {
    event.target.classList.add("true");
    wordsPunctuate[indexChoose] = choose.toChoose;
    solvedStyle[indexChoose] = true
    nthPElement.classList.add("trueWord");
    success = true;
  } else {
    event.target.classList.add("false");
    wrongWord.chooses.forEach((e) => {
      if (e.answer) {
        wordsPunctuate[indexChoose] = e.toChoose;
        solvedStyle[indexChoose] = false
      }
    });
    nthPElement.classList.add("falseWord");
  }

  event.stopPropagation();
  return {wordsPunctuate, success,solvedStyle};
}

export function showAnswerPun(wordsPunctuate, question,solvedStyle) {
  console.log(wordsPunctuate)
    console.log(solvedStyle)
  console.log(question)

  wordsPunctuate.forEach((e, index) => {
    question.wrongWord.forEach((wrong) => {
      if (e.trim() == wrong.word.trim()) {
        var correctAnswer = null;
        wrong.chooses.forEach((choose) => {
          if (choose.answer) {
            correctAnswer = choose;
          }
        });
        wrong.chooses.forEach((choose) => {
          let ifCHeck = true;
          if (ifCHeck) {
            if (choose.answer && choose.check) {
              wordsPunctuate[index] = choose.toChoose;
              ifCHeck = false;
              solvedStyle[index] = true;
            } else if (choose.answer && !choose.check) {
              wordsPunctuate[index] = choose.toChoose;
              solvedStyle[index] = false;
            } else if (!choose.answer && choose.check) {
              wordsPunctuate[index] = correctAnswer.toChoose;
              solvedStyle[index] = false;
            }
          }
        });
      }
    });
  });
  return {solvedStyle, wordsPunctuate};
}
