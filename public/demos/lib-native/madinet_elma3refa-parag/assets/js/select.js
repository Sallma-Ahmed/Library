export function SelectText(question, iphoneDevice) {
  let selectionTextq = "";
  let rangeSele = null;
  let spanSelectedText= null;
  setTimeout(() => {
    const selection = window.getSelection();
    selectionTextq = selection.toString();
    console.log(selection);
    console.log(selectionTextq);
    console.log(iphoneDevice);
    if (iphoneDevice) {
      spanSelectedText = document.createElement("span");
      if (selection.rangeCount > 0 && selectionTextq) {
        rangeSele = selection.getRangeAt(0);
        const rangeText = rangeSele.toString();
        selectionTextq = rangeText;
      }
      question.selectionText = selectionTextq.trim();

      console.log(selectionTextq);
      console.log(iphoneDevice);
    }
    return selectionTextq;
  }, 100);
}
export function CheckText(question, iphoneDevice, selectionTextq) {
  let passage = document.querySelectorAll(".active .passage");
  passage.forEach((el) => {
    el.classList.add("poniterEvent");
  });
  const selection = window.getSelection();
  let success = false;
  let spanSelectedText = document.createElement("span");
  let rangeSele = null;

  if (!iphoneDevice) {
    console.log(selectionTextq);
    if (selection.rangeCount > 0 && selectionTextq) {
      rangeSele = selection.getRangeAt(0);
      const rangeText = rangeSele.toString();
      selectionTextq = rangeText;
    }
    question.selectionText = selectionTextq.trim();
  }
  if (selectionTextq != "") {
    let loop = true;
    question.correctAnswer.forEach((text, index) => {
      if (loop) {
        if (selectionTextq.toString().trim() == text.toString().trim()) {
          spanSelectedText.className = "trueText";
          const extractedContents = rangeSele.extractContents();
          spanSelectedText.appendChild(extractedContents);
          rangeSele.insertNode(spanSelectedText);
          loop = false;
          success = true;
        } else if (
          selectionTextq.toString().trim() != text.toString().trim() &&
          index + 1 == question.correctAnswer.length
        ) {
          spanSelectedText.className = "falseText";
          const extractedContents = rangeSele.extractContents();
          spanSelectedText.appendChild(extractedContents);
          rangeSele.insertNode(spanSelectedText);
          success = false;
        }
      }
    });
  }
  return success;
}
