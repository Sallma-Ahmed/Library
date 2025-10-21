import { loadAnimations } from "./animation.js";
import calculator from "./calculator.js";
import { BUTTON_IDS, BUTTON_GROUPS } from "./constants.js";

const thinkingEl = document.querySelector("#thinking");
const pageUrl = thinkingEl?.getAttribute("data-urlpage") || "data";

new Vue({
  el: "#thinking",
  data() {
    return {
      isLoaded: false,
      isSuccess: false,
      inputs: [],
      wrongInputs: [],
      isChecked: false,
      activeIndex: null,
      result: "",
      showHint: false,
      showHintQuestion: false,
      started: false,
      quizFinished: false,
      isMuted: false,
      currentQuestion: "",
      currentDescription: "",
      posts: [],
      counter: 0,
      score: 0,
      isIncomplete: false,
      language: "en",
      currentLang: "arabic",
      isEnglish: true,
      BUTTON_IDS: BUTTON_IDS,
      wrongAnswers: [],
      currentWrongAnswerIndex: 0,
      activeGroup: null,
      buttonGroups: BUTTON_GROUPS,
      isDragging: false,
      startY: 0,
      scrollTop: 0,

      fraction: {
        numerator: "",
        input: "",
      },
      showCorrectAnswerScreen: false,
      animations: null,
      feedbackMessage: "",
    };
  },

  async mounted() {
    this.animations = loadAnimations();
    window.animations = this.animations;
    this.updateSafeArea();
    window.addEventListener("resize", this.updateSafeArea);
    await this.$nextTick();

    setTimeout(() => {
      this.updateSafeArea();
    }, 100);
    window.addEventListener("resize", this.updateSafeArea);
    await this.getData();
    const defaultIndex = this.buttonGroups.findIndex(
      (group) => group.name === "signs"
    );
    this.activeGroup = defaultIndex !== -1 ? defaultIndex : null;
  },

  beforeDestroy() {
    const container = this.$refs.scrollContainer;
    container.removeEventListener("scroll", this.updateScrollKey);
  },

  methods: {
    ...calculator,

    getDate() {
      this.currentdate = new Date();
      return (
        this.currentdate.getDate() +
        "/" +
        (this.currentdate.getMonth() + 1) +
        "/" +
        this.currentdate.getFullYear() +
        " " +
        this.currentdate.getHours() +
        ":" +
        this.currentdate.getMinutes() +
        ":" +
        this.currentdate.getSeconds()
      );
    },

    getData: async function () {
      if (direction == "2") {
        await returnData.then((response) => {
          this.isSuccess = response.isSuccess;
          this.data = response.value;
          // console.log(this.data);
          if (
            this.data.learningObjectAsJson != "" &&
            this.data.learningObjectAsJson != null
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);
            // this.posts[0] = jsonData;
            // this.dataLoaded = true;
          }
        });
      } else {
        if (runPage) {
          this.isSuccess = true;
        } else {
          await returnData.then((response) => {
            this.isSuccess = response.value;
          });
        }
        console.log(this.isSuccess);
      }

      if (!this.dataLoaded) {
        await fetch(pageUrl + ".json")
          .then((res) => res.json())
          .then((data) => {
            this.posts = data;
          });
      }

      if (this.posts.length != 0) {
        setTimeout(() => {
          this.posts[0].startTime = this.getDate();
          const numOfQuestion = this.posts[0]?.numOfQuestion || 10;
          const items = this.posts[0]?.items || [];
          this.limitedItems = items.slice(0, numOfQuestion);
          this.counter = 0;
          this.loadQuestion();
          this.isLoaded = true;
        }, 1000);
      } else {
        this.isLoaded = false;
      }
      console.log(this.isLoaded);
    },
    startGame() {
      if (!this.animations.intro) return;

      this.animations.intro.loop = false;
      this.animations.intro.stop();

      this.animations.intro.playSegments([35, 70], true);

      this.animations.intro.addEventListener(
        "complete",
        () => {
          this.showHint = true;
        },
        { once: true }
      );
      this.UpdateStudentActivity();
    },
    closeHint() {
      if (this.animations.intro) {
        this.animations.intro.goToAndStop(70, true);
      }

      const introEl = document.getElementById("intro");
      if (introEl) introEl.style.display = "none";
      this.showHintQuestion = false;
      this.showHint = false;
      this.started = true;
      this.posts[0].items[this.counter].startTime != ""
        ? ""
        : (this.posts[0].items[this.counter].startTime = this.getDate());
    },
    closeQuestionHint() {
      if (this.animations.intro) {
        this.animations.intro.goToAndStop(70, true);
      }

      const introEl = document.getElementById("intro");
      if (introEl) introEl.style.display = "none";
      this.showHintQuestion = false;
    },
    toggleHint() {
      this.showHintQuestion = !this.showHintQuestion;
    },
    toggleLanguage() {
      this.isEnglish = !this.isEnglish;
      this.language = this.isEnglish ? "en" : "ar";
      this.currentLang = this.isEnglish ? "arabic" : "english";
    },
    translatedButtons() {
      if (!this.buttonGroups[this.activeGroup]) return [];
      return this.buttonGroups[this.activeGroup].buttons.map((btn) => ({
        ...btn,
        text: this.isEnglish ? btn.label : btn.labelAr,
      }));
    },
    toggleMute() {
      this.isMuted = !this.isMuted;
    },

    setActiveInput(index) {
      this.activeIndex = index;
    },
    autoAddInputForIndex(inputIndex, valueIndex) {
      const values = this.inputs[inputIndex].values;
    },
    autoAddInput(valIdx) {
      this.autoAddInputForIndex(this.activeIndex, valIdx);
    },
    autoAddInputForIndex(inputIdx, valIdx) {
      const currentInput = this.inputs[inputIdx];
      if (currentInput?.type === "mean") {
        if (
          valIdx === currentInput.values.length - 1 &&
          currentInput.values[valIdx] !== ""
        ) {
          currentInput.values.push("");
        }
      }
    },
    getGlobalIndex(rIndex, idx) {
      const rows = this.posts[0]?.items?.[this.counter]?.rows || [];
      let count = 0;
      for (let i = 0; i < rIndex; i++) {
        count += rows[i].filter((cell) => cell.kind === "input").length;
      }
      const currentRowInputs = rows[rIndex].filter(
        (cell) => cell.kind === "input"
      );
      const inputOnlyIndex = currentRowInputs.indexOf(rows[rIndex][idx]);
      return count + inputOnlyIndex;
    },
    formatInput(input) {
      if (!input) return "";
      if (typeof input === "string") return input;
      if (
        input.whole !== undefined &&
        input.numerator !== undefined &&
        input.denominator !== undefined
      ) {
        return `${input.whole} ${input.numerator}/${input.denominator}`;
      }
      return "";
    },

    toggleGroup(index) {
      this.activeGroup = this.activeGroup === index ? null : index;
    },
    handleButton(btn) {
      if (btn.action === "calculate" || btn.action === "check") {
        if (!this.canCheck()) {
          this.isIncomplete = true;
          return;
        }
        this.calculate();
      } else if (btn.action === "typeText") {
        this.typeText(btn.value || btn.label);
      } else if (btn.action === "deleteAllInputs") {
        this.deleteAllInputs();
      } else if (btn.action === "clearOneInput") {
        this.clearOneInput();
      } else if (btn.action === "insertMean") {
        this.insertMean();
      }
    },

    nextWrongAnswer() {
      if (this.currentWrongAnswerIndex < this.wrongAnswers.length - 1) {
        this.currentWrongAnswerIndex++;
      }
    },
    prevWrongAnswer() {
      if (this.currentWrongAnswerIndex > 0) {
        this.currentWrongAnswerIndex--;
      }
    },
    loadQuestion() {
      this.animations.intro.playSegments([0, 35], true);
      this.animations.intro.loop = true;

      const questionElement = document.querySelector(".board .question");
      const descriptionElement = document.querySelector(".board .description");

      if (questionElement) questionElement.classList.remove("animate-in");
      if (descriptionElement) descriptionElement.classList.remove("animate-in");

      if (questionElement) questionElement.classList.add("animate-out");
      if (descriptionElement) descriptionElement.classList.add("animate-out");

      setTimeout(() => {
        if (this.limitedItems?.length) {
 const item = this.limitedItems[this.counter];


          if (item) {
            this.currentQuestion = item.question || "";
            this.currentDescription = item.text || "";

            this.result = "";
            this.isChecked = false;
            this.activeIndex = 0;

            const extractedInputs = [];

            if (Array.isArray(item.rows)) {
              item.rows.forEach((row) => {
                row.forEach((cell) => {
                  if (cell.kind === "input") {
                    switch (cell.type) {
                      case "text":
                        extractedInputs.push("");
                        break;
                      case "fraction":
                        extractedInputs.push({
                          type: "fraction",
                          numerator: "",
                          denominator: "",
                          activePart: "numerator",
                        });
                        break;
                      case "mixed":
                        extractedInputs.push({
                          type: "mixed",
                          whole: "",
                          numerator: "",
                          denominator: "",
                          activePart: "whole",
                        });
                        break;
                      case "mean":
                        extractedInputs.push({ type: "mean", values: [""] });
                        break;
                      case "power":
                        extractedInputs.push({
                          type: "power",
                          base: "",
                          exponent: "",
                        });
                        break;
                      default:
                        extractedInputs.push("");
                    }
                  }
                });
              });
            }

            this.inputs = extractedInputs.length ? extractedInputs : [""];
          }
        } else {
          this.quizFinished = true;
          return;
        }

        this.$nextTick(() => {
          if (questionElement) {
            questionElement.classList.remove("animate-out");
            questionElement.classList.add("animate-in");
          }
          if (descriptionElement) {
            descriptionElement.classList.remove("animate-out");
            descriptionElement.classList.add("animate-in");
          }
        });
      }, 400);

      setTimeout(() => {
        this.updateSafeArea();
      }, 500);
    },
    shuffleQuestions() {
      if (this.posts[0] && this.posts[0].items) {
        this.posts[0].items = this.posts[0].items.sort(
          () => Math.random() - 0.5
        );
      }
    },

    scorePercentage() {
      const total = this.posts[0]?.items?.length || 1;
      return Math.round((this.score / total) * 100);
    },

    updateSafeArea() {
      const container = document.getElementById("container");
      const safeArea = document.getElementById("safeArea");
      if (!container || !safeArea) return;
      const rect = container.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        setTimeout(() => this.updateSafeArea(), 50);
        return;
      }

      const width = rect.width;
      const height = rect.height;

      const safeWidth = (1550 / 1800) * width;
      const safeHeight = (835 / 1200) * height;

      safeArea.style.position = "absolute";
      safeArea.style.width = `${safeWidth}px`;
      safeArea.style.height = `${safeHeight}px`;
      safeArea.style.left = `${(width - safeWidth) / 2}px`;
      safeArea.style.top = `${(height - safeHeight) / 2}px`;
    },

    playFeedbackAnimation() {
      if (!this.animations.feedbackAnim) return;

      const pct = this.scorePercentage();
      let segment;

      if (pct <= 40) {
        segment = [0, 52];
      } else if (pct === 50) {
        segment = [53, 80];
      } else if (pct === 60 || pct === 70) {
        segment = [102, 150];
      } else if (pct === 80 || pct === 90) {
        segment = [150, 180];
      } else if (pct === 100) {
        segment = [190, 259];
      } else {
        segment = [0, 50];
      }
      console.log("pct:", pct, "segment:", segment);
      this.feedbackMessage = this.getFeedbackMessage(pct);
      this.animations.feedbackAnim.playSegments(segment, true);
    },
    getFeedbackMessage(pct) {
      if (pct === 0) {
        return "لا بأس، عليك المحاولة مرة أخرى.";
      } else if (pct === 10 || pct === 20) {
        return "لا بأس ببعض الأخطاء، عليك المحاولة مرة أخرى.";
      } else if (pct === 30 || pct === 40) {
        return "لا بأس ببعض الأخطاء، واصِل التقدم.";
      } else if (pct === 50) {
        return "أحسنت، لقد قطعت نصف الطريق وأنت أقرب إلى التميز.";
      } else if (pct === 60 || pct === 70) {
        return "مذهل! عليك الاستمرار لتحسين نتيجتك.";
      } else if (pct === 80 || pct === 90) {
        return "إنجاز عظيم! أنت قريب جدًّا من الوصول إلى القمة.";
      } else if (pct === 100) {
        return "عملك المذهل يُظهِر أنك الأفضل بلا منازع.";
      }
      return "";
    },
    retry() {
      location.reload();
    },
    UpdateStudentActivity() {
      // this.posts[0].items[this.counter].active
      //   ? (this.posts[0].items[this.counter].endTime = this.getDate())
      //   : "";

      direction != ""
        ? ((this.posts[0].title = this.data.title),
          (this.posts[0].bloomLevels = this.data.bloomLevels),
          (this.posts[0].learningObjectives = this.data.learningObjectives),
          (this.posts[0].loDegree = this.data.loDegree),
          (this.posts[0].keywords = this.data.keywords),
          (this.posts[0].type = this.data.type),
          (this.posts[0].unitId = this.data.unitId),
          globalFunctions.UpdateStudentActivity(this.activityId, this.posts[0]))
        : "";
    },
  },
});
