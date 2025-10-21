export function checkAnswer(event, answer, answersChoose, correctChoose) {
  let success = false;
  let answers = answersChoose;
  let correct = correctChoose;
  answers.forEach((el) => {
    el.classList.remove("false");
  });
  answer.check = true;
  if (answer.answer) {
    event.target.classList.add("true");
    success = true;
  } else {
    event.target.classList.add("false");
    correct[0].classList.add("true");
    success = false;
  }
  answers.forEach((el) => {
    el.classList.add("poniterEvent");
  });

  return {success, answers, correct};
}

export function showChooseAnswer() {
  let correct = document.querySelector(".active .answersChoose.correct");
  correct.classList.add("true");
}

export function showTrueAnswer() {
  let correct = document.querySelector(".active .answersTrueFalse.correct");
  correct.classList.add("true");
}
