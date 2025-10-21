export default {
  typeText(char) {
    const ids = this.BUTTON_IDS;
    const idx = this.activeIndex;

    if (this.inputs[idx] === undefined) {
      this.$set(this.inputs, idx, "");
    }

    const currentInput = this.inputs[idx];

    if (typeof currentInput === "object") {
      const obj = currentInput;

      if (obj.type === "mixed") {
        if (obj.activePart === "whole") {
          obj.whole += char;
        } else if (obj.activePart === "numerator") {
          obj.numerator += char;
        } else if (obj.activePart === "denominator") {
          obj.denominator += char;
        }
      } else if (obj.type === "fraction") {
        if (obj.activePart === "numerator") {
          obj.numerator += char;
        } else if (obj.activePart === "denominator") {
          obj.denominator += char;
        }
      } else if (obj.type === "mean") {
        if (char === ",") {
          obj.values.push("");
        } else {
          const last = obj.values.length - 1;
          obj.values[last] += char;
          this.autoAddInputForIndex(idx, last);
        }
      } else if (obj.type === "power") {
        if (!obj.exponent) {
          obj.exponent = char;
        } else {
          obj.exponent += char;
        }
      }
      return;
    }

    if (typeof currentInput === "string") {
      let cur = currentInput;

      if (char === ids.SUBTRACT) {
        if (cur === "") {
          this.$set(this.inputs, idx, "-");
          return;
        }
      }

      if (char === ids.DECIMAL) {
        if (cur.includes(".")) return;
        this.$set(this.inputs, idx, cur === "-" ? "-0." : cur + ".");
        return;
      }

      if (char === ids.PI) {
        this.$set(this.inputs, idx, "π");
        return;
      }

      if (char === ids.ABS) {
        this.$set(this.inputs, idx, cur === "" ? "||" : "|" + cur + "|");
        return;
      }

      if (char === ids.FRACTION) {
        this.$set(this.inputs, idx, {
          type: "fraction",
          numerator: "",
          denominator: "",
          activePart: "numerator",
        });
        return;
      }

      if (char === ids.MIXED_NUMBER) {
        this.$set(this.inputs, idx, {
          type: "mixed",
          whole: "",
          numerator: "",
          denominator: "",
          activePart: "whole",
        });
        return;
      }

      if (char === ids.POWER) {
        this.$set(this.inputs, idx, { type: "power", base: cur, exponent: "" });
        return;
      }

      this.$set(this.inputs, idx, cur + char);
      return;
    }

    if (char === ids.INFINITY) {
      this.$set(this.inputs, idx, "∞");
    }
  },
  setActiveFractionPart(idx, part) {
    const obj = this.inputs[idx];
    if (obj?.type === "fraction") {
      obj.activePart = part;
    }
  },
  deleteAllInputs() {
    this.inputs = this.inputs.map((input) => {
      if (typeof input === "string") {
        return "";
      } else if (typeof input === "object" && input.type) {
        if (input.type === "mixed") {
          return { type: "mixed", whole: "", numerator: "", denominator: "" };
        } else if (input.type === "fraction") {
          return { type: "fraction", numerator: "", denominator: "" };
        } else if (input.type === "mean") {
          return { type: "mean", values: [""] };
        } else if (input.type === "power") {
          return { type: "power", base: "", exponent: "" };
        }
      }
      return input;
    });

    this.result = "";
    this.activeIndex = 0;
  },

  clearOneInput() {
    if (this.activeIndex < 0 || this.activeIndex >= this.inputs.length) return;

    let currentInput = this.inputs[this.activeIndex];

    if (typeof currentInput === "string") {
      this.$set(this.inputs, this.activeIndex, currentInput.slice(0, -1));
    } else if (typeof currentInput === "object") {
      if (currentInput.type === "mean") {
        let lastIndex = currentInput.values.length - 1;
        if (currentInput.values[lastIndex].length > 0) {
          currentInput.values[lastIndex] = currentInput.values[lastIndex].slice(
            0,
            -1
          );
        } else if (currentInput.values.length > 1) {
          currentInput.values.pop();
        } else {
          this.$set(this.inputs, this.activeIndex, "");
        }
      } else {
        this.$set(this.inputs, this.activeIndex, "");
      }
    }
  },

  insertMean() {
    const cur = this.inputs[this.activeIndex];

    if (cur && typeof cur === "object") {
      if (cur.type === "mean") return;
    }

    let existingValues = [];
    if (typeof cur === "string" && cur.trim() !== "") existingValues.push(cur);

    this.$set(this.inputs, this.activeIndex, {
      type: "mean",
      values: existingValues.length ? existingValues : [""],
    });
  },

  calculate() {
    if (!this.canCheck()) {
      this.isIncomplete = true;
      return;
    }

    this.wrongInputs = [];

    const rows = this.limitedItems[this.counter]?.rows || [];
    let globalIndex = 0;
    rows.forEach((row) => {
      row.forEach((item) => {
        if (item.kind === "input") {
          const userVal = this.inputs[globalIndex];
          const correctVal = item.valid;

if (item.type === "text") {
  if (typeof userVal !== "string" || userVal.trim() !== correctVal) {
    this.wrongInputs.push(globalIndex);
  }
}
          if (item.type === "fraction") {
            const expected = correctVal.split("/");
            if (
              !userVal.numerator ||
              !userVal.denominator ||
              userVal.numerator !== expected[0] ||
              userVal.denominator !== expected[1]
            ) {
              this.wrongInputs.push(globalIndex);
            }
          }

          if (item.type === "mixed") {
            const parts = correctVal.split(" ");
            const whole = parts[0];
            const [num, den] = parts[1].split("/");

            if (
              !userVal.whole ||
              !userVal.numerator ||
              !userVal.denominator ||
              userVal.whole !== whole ||
              userVal.numerator !== num ||
              userVal.denominator !== den
            ) {
              this.wrongInputs.push(globalIndex);
            }
          }

          if (item.type === "mean") {
            if (
              !userVal ||
              !userVal.values ||
              !userVal.values.length ||
              userVal.values.some((v) => !v) ||
              String(
                Math.round(
                  userVal.values.reduce((a, b) => +a + +b, 0) /
                    userVal.values.length
                )
              ) !== correctVal
            ) {
              this.wrongInputs.push(globalIndex);
            }
          }

          if (item.type === "power") {
            const [expectedBase, expectedExp] = correctVal.split("^");
            if (
              !userVal.base ||
              !userVal.exponent ||
              userVal.base !== expectedBase ||
              userVal.exponent !== expectedExp
            ) {
              this.wrongInputs.push(globalIndex);
            }
          }

          globalIndex++;
        }
      });
    });

    this.isChecked = true;
    this.result =
      this.wrongInputs.length === 0 ? " correctAnswer " : " correctWrong";
  },

  isWrong(index) {
    const val = this.inputs[index];

    // في حال لم يتم التحقق بعد
    if (!this.isChecked) {
      if (val?.type === "mixed") {
        return !val.whole || !val.numerator || !val.denominator;
      }
      if (val?.type === "fraction") {
        return !val.numerator || !val.denominator;
      }
      if (val?.type === "mean") {
        return val.values.some((v) => !v);
      }
      if (val?.type === "power") {
        return !val.base || !val.exponent;
      }
      return !val;
    }

    // بعد التحقق
    return this.wrongInputs.includes(index);
  },
  canCheck() {
    return this.inputs.every((input) => {
      if (!input) return false;
      if (typeof input === "object") {
        if (input.type === "fraction") {
          return input.numerator && input.denominator;
        }
        if (input.type === "mixed") {
          return input.whole && input.numerator && input.denominator;
        }
        if (input.type === "mean") {
          return input.values.length > 0 && input.values.every((v) => v !== "");
        }
        if (input.type === "power") {
          return input.base && input.exponent;
        }
      }
      return typeof input === "string" ? input.trim() !== "" : true;
    });
  },

  checkAnswer() {
    const item = this.posts[0]?.items?.[this.counter];
    if (!item) return;

    let isCorrect = true;
    this.wrongInputs = [];
    const normalize = (val) => {
      if (val === undefined || val === null) return "";

      if (
        typeof val === "object" &&
        val.type === "fraction" &&
        val.numerator !== undefined &&
        val.denominator !== undefined
      ) {
        return `${val.numerator}/${val.denominator}`;
      }

      if (typeof val === "object" && val.type === "mixed") {
        return `${val.whole} ${val.numerator}/${val.denominator}`;
      }

      if (typeof val === "object" && val.type === "mean") {
        const nums = [...val.values]
          .map((v) => v.trim())
          .filter((v) => v !== "");
        return `mean(${nums.join(",")})`;
      }

      if (typeof val === "object" && val.type === "power") {
        return `${val.base}^${val.exponent}`;
      }

      return String(val);
    };

    if (item.correctInputs && Array.isArray(item.correctInputs)) {
      for (let i = 0; i < item.correctInputs.length; i++) {
        const expected = normalize(item.correctInputs[i]);
        const actual = normalize(this.inputs[i]);
        if (actual !== expected) {
          isCorrect = false;
          this.wrongInputs.push(i);
          break;
        }
      }
    }

    if (isCorrect && item.correctFinalResult !== undefined) {
      const expectedResult = normalize(item.correctFinalResult);
      const actualResult = normalize(this.result);
      if (actualResult !== expectedResult) isCorrect = false;
    }

    if (!isCorrect) {
      const correctRowsText = item.rows
        .map((row) =>
          row
            .map((cell) => {
              if (cell.kind === "input") {
                return cell.valid;
              } else {
                return cell.value;
              }
            })
            .join(" ")
        )
        .join("\n");

      this.wrongAnswers.push({
        question: item.question || "",
        rows: item.rows || [],
        userInputs: [...this.inputs],
      });
    } else {
      this.score++;
    }
    this.posts[0].items[this.counter].endTime = this.getDate();
    this.posts[0].endTime = this.getDate();
    this.counter++;
    if (this.counter >= (this.posts[0]?.items?.length || 0)) {
      this.quizFinished = true;
      this.playFeedbackAnimation();

      this.$nextTick(() => {
        const endScreen = document.getElementById("endScreen");
        if (endScreen) {
          endScreen.classList.add("show");
          endScreen.style.pointerEvents = "auto";
        }
      });
    } else {
      this.posts[0].items[this.counter].startTime = this.getDate();

      this.loadQuestion();
    }
    this.isChecked = false;
    console.log(this.posts[0]);
    this.UpdateStudentActivity();
  },
};
