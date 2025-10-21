import { loadAnimations } from "./animation.js";

new Vue({
  el: "#buzz",
  data() {
    return {
      showHand: true,
      animations: null,
      isEqual: false,
      isLoaded: false,
      isSuccess: false,
      isAutoStart: false,
      enterPressed: false,
      loaderFinished: false,
      selectedCharIndex: null,
      autoStart: true,
      showHintScreen: false,
      showBuzzButton: true,
      keyboardDimmed: false,
      showKeyboard: false,
      showLang: false,
      showClose: false,
      showAvatar: false,
      showResultScreen: false,
      lastComputerGotPoint: false,
      feedbackWinnerCharFlag: "",
      feedbackLoserCharFlag: "",
      isLightOn: false,
      showVsLightAnimation: false,
      showleftLightAnimation: false,
      autoStartTimeout: null,
      autoStartInProgress: false,
      showComputerTyping: false,
      currentKeyboardLayout: "alphabetic",
      keyboardStatus: "keyboard-normal",
      isShiftActive: false,
      keyboardTimeout: null,
      keyboard: {
        alphabetic: [],
        numeric: [],
      },
      currentInput: "",
      keyStates: {},
      keyboardLampState: "dimmed",
      timeLeft: 60,
      timerInterval: null,
      timerTimeout: null,
      timerDuration: 60000,
      currentQuestion: "",
      currentQuestionIndex: -1,
      allQuestions: [],
      askedQuestions: [],
      answerStatus: null,
      isComputerTurn: false,
      computerStart: [false, false, false, false, false, false],
      studentScore: 0,
      computerScore: 0,
      consecutiveCorrectAnswers: 0,
      hints: [],
      hintShowAnswer: {
        unlocked: false,
        used: false,
        class: "hint1-dim",
      },
      hintPlusTime: {
        unlocked: false,
        used: false,
        class: "hint2-dim",
      },
      ComputerChar: "",
      hintAudio: null,
      currentLang: "en",
      langClass: "langAra",
      selectedAvatar: "girl",
      avatarOptions: ["girl", "boy"],
      currentAvatarIndex: 0,
      congratsMessage: "",
      activeComputerCharFlag: "",
      isGirlStageLoaded: false,
      isBoyStageLoaded: false,
      isChooseAvatarLoaded: false,
      isIntroStageLoaded: false,
      isBuzzScreenLoaded: false,
      showGirlStage: false,
      showBoyStage: false,
      showBoyCharVs2: false,
      showBoyRight: false,
      showGirlCharVs: false,
      showBoyCharVs1: false,
      computerAvatar: null,
      feedbackId: null,
      animationSegments: {
        avatarTransitionPrev: [0, 1],
        avatarTransitionNext: [1, 7],
        avatarSelectHighlight: [0, 9],
      },
      questionAlreadyLoaded: false,
      audio: {
        backgroundMusic: null,
        wrongSound: null,
        correctSound: null,
      },
      isMuted: false,
      lamps: Array.from({ length: 6 }, (_, i) => ({
        state: 0,
        x: 38 + 5 * i,
        y: 61,
      })),
      lampsRight: Array.from({ length: 6 }, (_, i) => ({
        state: 0,
        x: 63 - 5 * i,
        y: 61,
      })),
      leftLampStates: ["dim-lamp", "r-lamp", "w-lamp"],
      rightLampStates: ["rdim-lamp", "rr-lamp", "rw-lamp"],
      posts: [
        {
          questions: [],
          counterCorrect: 0,
          LOcorrectcounter: 0,
          loTargets: null,
          SubType: "Input",
          subjectId: "",
          conceptId: "",
          unitId: "",
          lessonId: "",
          title: "",
          keywords: "",
          learningObjectives: "",
          bloomLevels: [],
          type: "",
          loDegree: null,
          UserDegree: 0,
          startTime: "",
          endTime: "",
          numberOfquestion: 6,
          hint: true,
          items: [],
        },
      ],
      paused: false,
      timerId: null,
      timeoutIds: [],
    };
  },
  computed: {
    activeKeyboardKeys() {
      return this.keyboard[this.currentKeyboardLayout] || [];
    },
    keyboardDimmed() {
      return this.autoStartActive;
    },
    keyboardRows() {
      const keys = this.activeKeyboardKeys;
      const rows = [];

      if (this.currentKeyboardLayout === "alphabetic") {
        rows.push(keys.slice(0, 10));
        rows.push(keys.slice(10, 19));
        rows.push(keys.slice(19, 26));
        rows.push(keys.slice(26, 31));
      } else {
        rows.push(keys.slice(0, 10));
        rows.push(keys.slice(10, 20));
        rows.push(keys.slice(20, 30));
        rows.push(keys.slice(30, 35));
      }
      return rows;
    },
  },
  mounted() {
    this.animations = loadAnimations();
    window.animations = this.animations;
    this.initAudio();
    this.initApp();
    
  },
  beforeDestroy() {
    this.cleanupEventListeners();
    this.cleanupTimers();
    this.cleanupAnimations();
  },
  methods: {
    initApp() {
      try {
        this.updateSafeArea();
        this.postQuestions();
      } catch (error) {
        console.error("Error in initApp:", error);
      }
    },
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
    initAudio() {
      this.audio.backgroundMusic = new Audio(
        "../../../lib-native/buzzTime/audio/audio_bg.mp3"
      );
    },
    updateSafeArea() {
      const container = document.getElementById("container");
      const safeArea = document.getElementById("safeArea");
      if (!container || !safeArea) return;

      const rect = container.getBoundingClientRect();
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
    handleResize() {
      this.updateSafeArea();
    },
    toggleMute() {
      const audio = new Audio(
        "../../../lib-native/buzzTime/audio/button_click1.mp3"
      );
      audio.play();
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        this.audio.backgroundMusic.pause();
      } else {
        this.audio.backgroundMusic
          .play()
          .catch((e) => console.log("no sound found", e));
      }
    },
    playSound(soundType) {
      if (this.isMuted) return;
      try {
        const sound = this.audio[soundType];
        sound.currentTime = 0;
        sound
          .play()
          .catch((e) => console.log(`Cannot play ${soundType} sound:`, e));
      } catch (e) {
        console.error("Sound error:", e);
      }
    },
    initializeQuizUI() {
      this.showBuzzButton = false;
      this.showleftLightAnimation = true;
      this.showVsLightAnimation = false;
      this.keyboardLampState = "on";
    },
    setupQuizTimer() {
      this.startTimer();
    },
    cleanupTimers() {
      clearInterval(this.timerInterval);
      clearTimeout(this.autoStartTimeout);
      clearTimeout(this.startButtonTimeout);
      this.timerInterval = null;
      this.autoStartTimeout = null;
      this.startButtonTimeout = null;
    },
    handleKeyPress(ev, keyId) {
      const audio = new Audio("../../../lib-native/buzzTime/audio/click.mp3");
      audio.play();
      if (keyId === "backspace") {
        this.handleBackspace();
        return;
      }
      if (this.isComputerTurn) return;
      if (!keyId) return;

      this.animateKeyPress(ev.currentTarget);
      switch (keyId) {
        case "shift":
          if (this.currentKeyboardLayout === "alphabetic") {
            this.toggleShift();
          }
          break;
        case "backspace":
          this.handleBackspace();
          break;
        case "enter":
          this.handleEnter();
          break;
        case "space":
          this.appendChar(" ");
          break;
        case "?/,":
          this.currentKeyboardLayout = "numeric";
          this.isShiftActive = false;
          break;
        case "abc":
          this.currentKeyboardLayout = "alphabetic";
          break;
        default:
          this.appendChar(
            this.isShiftActive ? keyId.toUpperCase() : keyId.toLowerCase()
          );
          break;
      }
    },
    toggleShift() {
      this.isShiftActive = !this.isShiftActive;
    },
    handleBackspace() {
      if (this.selectedCharIndex !== null && this.selectedCharIndex >= 0) {
        this.currentInput =
          this.currentInput.slice(0, this.selectedCharIndex) +
          this.currentInput.slice(this.selectedCharIndex + 1);

        this.selectedCharIndex = null;
      } else {
        this.currentInput = this.currentInput.slice(0, -1);
      }
    },
    selectChar(index) {
      this.selectedCharIndex = index;
    },

    startTimer() {
      this.cleanupTimers();

      let currentFrame = 60 - this.timeLeft;
      const totalFrames = 60;

      this.timerAudio = new Audio(
        "../../../lib-native/buzzTime/audio/time.mp3"
      );
      this.timerAudio.loop = false;

      if (typeof Timer !== "undefined" && this.animations.Timer.stop)
        this.animations.Timer.stop();
      if (typeof Timer !== "undefined" && this.animations.Timer.goToAndStop)
        this.animations.Timer.goToAndStop(currentFrame, true);

      this.timerInterval = setInterval(() => {
        if (!this.paused) {
          if (
            typeof Timer !== "undefined" &&
            this.animations.Timer.goToAndStop
          ) {
            this.animations.Timer.goToAndStop(currentFrame, true);
          }
          currentFrame++;
          this.timeLeft--;

          if (this.timeLeft === 16) {
            try {
              this.timerAudio.play();
            } catch (e) {
              console.warn("Failed to play sound:", e);
            }
          }
          if (currentFrame >= totalFrames || this.timeLeft <= 0) {
            clearInterval(this.timerInterval);
            this.handleTimeOut(false);
          }
        }
      }, 600);
    },
    resetTimerState() {
      clearInterval(this.timerInterval);
      this.timeLeft = 60;
      if (typeof Timer !== "undefined" && this.animations.Timer.goToAndStop) {
        this.animations.Timer.goToAndStop(0, true);
      }
    },
    postQuestions() {
      this.loaderFinished = false;
      fetch("./data.json")
        .then((res) => res.json())
        .then((data) => {
          let all = data.questions || [];
          this.hints = data.hints || [];

          const validQuestions = all.filter(
            (q) => q.text && q.questionType === "text"
          );

          this.allQuestions = this.shuffleArray(validQuestions).slice(0, 6);

          if (data.keyboard) {
            this.keyboard.alphabetic = data.keyboard.alphabetic || [];
            this.keyboard.numeric = data.keyboard.numeric || [];
          }

          this.isSuccess = true;
          this.loaderFinished = true;

          setTimeout(() => {
            this.animations.introStage.playSegments([0, 70], true);
            this.animations.introStage.loop = true;
          }, 500);

          if (!this.questionAlreadyLoaded && this.allQuestions.length > 0) {
            this.loadRandomQuestion();
          }

          this.allQuestions.length != 0
            ? setTimeout(() => {
                this.isLoaded = true;
              }, 1000)
            : (this.isLoaded = false);
        })
        .catch((error) => {
          console.error("Error fetching data.json:", error);
          this.isLoaded = false;
          this.isSuccess = false;
        });
    },

    shuffleArray(arr) {
      return arr
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    },

    loadRandomQuestion() {
      this.animations.buzzScreen.playSegments([0, 20], true);
      this.animations.buzzScreen.loop = true;
      this.resetTimerState();

      const toggleButton = document.querySelector(".toggle-light-button");
      if (toggleButton) {
        toggleButton.style.pointerEvents = "auto";

        toggleButton.addEventListener("click", () => {
          this.animations.buzzScreen.playSegments([20, 36], true);
          this.animations.buzzScreen.loop = false;

          this.animations.buzzScreen.addEventListener(
            "complete",
            () => {
              this.animations.buzzScreen.playSegments([0, 20], true);
              this.animations.buzzScreen.loop = true;
            },
            { once: true }
          );
        });
      }

      try {
        this.resetAnmination();

        this.currentKeyboardLayout = "alphabetic";
        this.isShiftActive = false;

        clearInterval(this.timerInterval);

        if (this.timerInterval) clearInterval(this.timerInterval);
        this.remainingTime = this.timerDuration;

        this.timerInterval = setInterval(() => {
          if (this.remainingTime > 0) {
            this.remainingTime--;
          } else {
            clearInterval(this.timerInterval);
            this.handleEnter();
          }
        }, 1000);

        const availableQuestions = this.allQuestions.filter(
          (q) =>
            !this.askedQuestions.includes(q.id) &&
            q.text &&
            q.id !== undefined &&
            q.id !== null
        );

        if (availableQuestions.length === 0) {
          this.currentQuestion = "No questions";
          this.showResultScreen = true;
          this.showKeyboard = false;

          clearInterval(this.timerInterval);
          this.playDynamicFeedback();

          this.calculateScore();
          this.studentScore = this.finalScore;
          return;
        }

        const randomIndex = Math.floor(
          Math.random() * availableQuestions.length
        );
        const selectedQuestion = availableQuestions[randomIndex];
        const questionEl = document.querySelector(".question-text");
        if (questionEl) {
          questionEl.classList.remove("show");
          this.currentQuestion = selectedQuestion.text;

          this.$nextTick(() => {
            const newEl = document.querySelector(".question-text");
            if (newEl) {
              newEl.classList.add("show");
            }
          });
        } else {
          this.currentQuestion = selectedQuestion.text;
        }

        this.currentQuestionIndex = this.allQuestions.findIndex(
          (q) => q.id === selectedQuestion.id
        );
        this.askedQuestions.push(selectedQuestion.id);
        this.questionAlreadyLoaded = true;
        this.lampUpdatedForIndex = null;
        this.enterPressed = false;
      } catch (error) {
        console.error("Error in loadRandomQuestion:", error);
      }

      this.allQuestions[this.currentQuestionIndex].startTime = this.getDate();
      this.posts[0].startTime = this.getDate();
      this.posts[0].questions[this.currentQuestionIndex] =
        this.allQuestions[this.currentQuestionIndex];
      this.UpdateStudentActivity();
    },
    handleEnter() {
      this.resetTimerState();
      clearInterval(this.timerInterval);
      if (this.timerAudio) {
        this.timerAudio.pause();
        this.timerAudio.currentTime = 0;
      }
      if (this.enterPressed) return;
      this.enterPressed = true;

      const isCorrect = this.checkAndSetAnswerStatus();
      console.log("enter enterrrr");

      if (isCorrect) {
        this.handleCorrectAnswer();
        this.showCongratsMessage(true);
      } else {
        this.handleWrongAnswer();
        this.showCongratsMessage(false);
      }

      setTimeout(() => {
        this.finalizeTurn(isCorrect);
      }, 2500);
      this.allQuestions[this.currentQuestionIndex].endTime = this.getDate();
      this.posts[0].questions[this.currentQuestionIndex] =
        this.allQuestions[this.currentQuestionIndex];
      console.log(this.posts[0].questions);
    },
    handleCorrectAnswer() {
      this.congratsMessage = this.getRandomCongratsMessage(true);
      this.updateKeyboardFeedback(true);

      this.updatePlayerLamps(true);
      this.playPlayerAnimation(true);

      this.updateScoreAndHints(true);

      if (this.isAutoStart) {
        this.isAutoStart = false;
      } else {
        this.handleComputerResponse(true);
        this.isAutoStart = false;
      }
    },

    handleWrongAnswer() {
      const wrongAudio = new Audio(
        "../../../lib-native/buzzTime/audio/wrong.mp3"
      );
      wrongAudio.play();

      this.congratsMessage = this.getRandomCongratsMessage(false);
      this.updateAutoKeyboardFeedback(false);

      this.updatePlayerLamps(false);

      this.startComputerTurnAnimation();

      setTimeout(() => {
        this.stopComputerTurnAnimation();
      }, 2500);

      this.showleftLightAnimation = false;
      this.updateScoreAndHints(false);

      if (!this.computerStart[this.currentQuestionIndex]) {
        this.handleComputerResponse(false);
        this.isAutoStart = false;
      } else {
        setTimeout(() => {
          this.showKeyboard = false;
        }, 2500);
      }
    },

    stopComputerTurnAnimation() {
      this.animations.boyStage.playSegments([0, 48], true);
      this.animations.girlStage.playSegments([0, 48], true);
    },

    finalizeTurn(isCorrect) {
      this.completeTurn(isCorrect);
      this.resetTimerState();
    },
    handleEnterPress(event) {
      if (event.key === "Enter" && !this.enterPressed && this.showKeyboard) {
        this.handleEnter();
      }
    },
    checkAndSetAnswerStatus() {
      const isCorrect = this.checkAnswer(this.currentInput);
      this.answerStatus = isCorrect ? "correct" : "wrong";
      return isCorrect;
    },
    checkAnswer(input) {
      const current = this.allQuestions[this.currentQuestionIndex];
      if (!current || (!current.answer && !current.answers)) return false;

      const normalize = (str) =>
        (str ?? "")
          .toString()
          .trim()
          .toLowerCase()
          .replace(/[\u2019\u2018]/g, "'");

      const userAnswer = normalize(input);

      if (Array.isArray(current.answers)) {
        return current.answers.some((ans) => normalize(ans) === userAnswer);
      }

      if (current.answer) {
        return userAnswer === normalize(current.answer);
      }

      return false;
    },
    updateScoreAndHints(isCorrect) {
      const currentQ = this.allQuestions[this.currentQuestionIndex];

      const getCorrectAnswer = () => {
        if (Array.isArray(currentQ.answers)) {
          return currentQ.answers.map((a) => a.trim()).join(" / ");
        }
        if (currentQ.answer) {
          return currentQ.answer.trim();
        }
        return "";
      };

      if (isCorrect) {
        this.studentScore += 1;
        this.animations.boyStage.stop();
        this.animations.girlStage.stop();

        this.animations.boyStage.playSegments([48, 100], true);
        this.animations.girlStage.playSegments([48, 100], true);

        let successAudio;
        if (this.selectedAvatar === "girl") {
          successAudio = new Audio(
            "../../../lib-native/buzzTime/audio/girl_yes.mp3"
          );
        } else if (this.selectedAvatar === "boy") {
          successAudio = new Audio(
            "../../../lib-native/buzzTime/audio/boy_yes.mp3"
          );
        }
        successAudio?.play();

        setTimeout(() => {
          this.animations.boyStage.playSegments([0, 48], true);
          this.animations.girlStage.playSegments([0, 48], true);
        }, 2500);

        this.consecutiveCorrectAnswers++;
        this.posts[0].LOcorrectcounter++;

        this.posts[0].items.push({
          questionId: currentQ.id,
          userAnswer: this.currentInput.trim(),
          correctAnswer: getCorrectAnswer(),
          winner: "correct",
        });

        this.currentInput = "";
        this.checkAndUnlockHints();
        currentQ.endTime = this.getDate();
      } else {
        let failAudio;
        if (this.selectedAvatar === "girl") {
          failAudio = new Audio(
            "../../../lib-native/buzzTime/audio/girl_oh_no.mp3"
          );
        } else if (this.selectedAvatar === "boy") {
          failAudio = new Audio(
            "../../../lib-native/buzzTime/audio/boy_oh_no.mp3"
          );
        }
        failAudio?.play();

        this.posts[0].items.push({
          questionId: currentQ.id,
          userAnswer: this.currentInput.trim(),
          correctAnswer: getCorrectAnswer(),
          winner: "wrong",
        });

        currentQ.endTime = this.getDate();
        currentQ.numberOfTrial = 1;
        this.currentInput = "";
        this.consecutiveCorrectAnswers = 0;
      }
      setTimeout(() => {
        this.animations.boyStage.playSegments([0, 48], true);
        this.animations.girlStage.playSegments([0, 48], true);
      }, 3500);

      this.posts[0].endTime = this.getDate();
      this.posts[0].questions[this.currentQuestionIndex] = currentQ;
      this.UpdateStudentActivity();
    },
    calculateScore() {
      const totalQuestions = 6;

      if (totalQuestions === 0) {
        this.finalScore = 0;
        this.scorePercentage = 0;
        return;
      }

      const maxScore = totalQuestions * 10;

      this.finalScore = this.studentScore;

      this.scorePercentage = Math.round((this.studentScore / maxScore) * 100);
    },
    // ========== HINT METHODS ==========
    checkAndUnlockHints() {
      setTimeout(() => {
        if (
          this.consecutiveCorrectAnswers >= 3 &&
          !this.hintPlusTime.unlocked
        ) {
          this.hintPlusTime.unlocked = true;
          this.hintPlusTime.class = "hint2";
        }

        if (
          this.consecutiveCorrectAnswers >= 5 &&
          !this.hintShowAnswer.unlocked
        ) {
          this.hintShowAnswer.unlocked = true;
          this.hintShowAnswer.class = "hint1";
        }
      }, 5000);
    },

    setupAnimationCompletionHandler(callback) {
      if (!buzzScreen) {
        if (typeof callback === "function") callback();
        return;
      }
      this.animations.buzzScreen.stop();
      this.animations.buzzScreen.removeEventListener(
        "complete",
        this._buzzScreenCompletionHandler
      );
      this._buzzScreenCompletionHandler = () => {
        if (typeof callback === "function") callback();
      };

      this.animations.buzzScreen.addEventListener(
        "complete",
        this._buzzScreenCompletionHandler,
        { once: true }
      );
    },
    handleComputerResponse(isCorrect) {
      if (!isCorrect) {
        this.handlePlayerIncorrect();
      } else {
        this.handlePlayerCorrect();
      }
    },
    handleAutoComputerResponse() {
      this.handlePlayerCorrect();
    },
    handlePlayerIncorrect() {
      const wrongAudio = new Audio(
        "../../../lib-native/buzzTime/audio/wrong.mp3"
      );
      wrongAudio.play();
      setTimeout(() => {
        const computerAudio = new Audio(
          "../../../lib-native/buzzTime/audio/computeranswer.mp3"
        );
        computerAudio.play();

        setTimeout(() => {
          computerAudio.pause();
          computerAudio.currentTime = 0;
        }, 1500);

        this.isComputerTurn = true;
        this.keyboardDimmed = true;
        this.showComputerTyping = true;
        this.showVsLightAnimation = true;
      }, 2500);
      setTimeout(() => {
        if (this.isAutoStart == false) {
          this.executeComputerTurn();
        }
        this.showComputerTyping = false;
        let feedbackAudio;
        let audioFile;

        if (this.isComputerCorrect) {
          audioFile = "right.mp3";
        } else {
          audioFile = "wrong.mp3";
        }

        const audio = new Audio(
          `../../../lib-native/buzzTime/audio/${audioFile}`
        );
        console.log("تشغيل صوت النتيجة:", audioFile);
        audio.play();
        console.log("قيمة characterConfig حالياً:", this.characterConfig);

        if (this.characterConfig === "showGirlCharVs") {
          const fileName = `girl_${
            this.isComputerCorrect ? "yes" : "oh_no"
          }.mp3`;
          console.log("تشغيل صوت البنت:", fileName);
          feedbackAudio = new Audio(
            `../../../lib-native/buzzTime/audio/${fileName}`
          );
        } else if (
          this.characterConfig === "showBoyCharVs2" ||
          this.characterConfig === "showBoyCharVs1"
        ) {
          const fileName = `boy_${
            this.isComputerCorrect ? "yes" : "oh_no"
          }.mp3`;
          console.log("تشغيل صوت الولد:", fileName);
          feedbackAudio = new Audio(
            `../../../lib-native/buzzTime/audio/${fileName}`
          );
        }

        this.updateAutoKeyboardFeedback(this.isComputerCorrect);
        this.showCongratsMessage(this.isComputerCorrect);

        if (feedbackAudio) feedbackAudio.play();
      }, 4500);

      setTimeout(() => {
        this.hideCongratsMessage();
      }, 5500);
      setTimeout(() => {
        this.showKeyboard = false;
      }, 6500);
      setTimeout(() => {
        this.isComputerTurn = false;
        this.keyboardDimmed = false;
      }, 7000);
    },

    hideCongratsMessage() {
      const message = document.querySelector(".congrats-message");
      if (message) {
        message.remove();
      }
    },
    handlePlayerCorrect() {
      const audio = new Audio("../../../lib-native/buzzTime/audio/right.mp3");
      audio.play();

      this.showComputerTyping = false;
      this.lastComputerGotPoint = false;
      this.updateComputerLamps();
    },

    startComputerTurnAnimation() {
      this.animations.boyStage.playSegments([100, 148], true);
      this.animations.girlStage.playSegments([100, 148], true);
    },
    executeComputerTurn() {
      this.showComputerTyping = false;
      this.isComputerCorrect = Math.random() < 0.2;
      this.updateComputerScore(this.isComputerCorrect);
      this.updateComputerLamps();
    },

    updateComputerScore(isCorrect) {
      if (isCorrect) {
        this.playComputerAnimation(isCorrect);
        this.computerScore += 1;
        this.UpdateStudentActivity();

        this.allQuestions[this.currentQuestionIndex].numberOfTrial = 1;
      } else {
        this.playComputerAnimation(false);
      }
      this.lastComputerGotPoint = isCorrect;
      this.posts[0].questions[this.currentQuestionIndex] =
        this.allQuestions[this.currentQuestionIndex];
    },

    processComputerTurn(isCorrect) {
      this.lastComputerGotPoint = isCorrect;
      this.updateComputerLamps();

      if (isCorrect) {
        this.computerScore += 1;
      }
      this.playComputerAnimation(isCorrect);
    },
    playComputerAnimation(isCorrect) {
      let compSegment = isCorrect ? [49, 100] : [100, 150];
      setTimeout(() => {
        compSegment = [0, 48];
        this.animations.BoyCharVs2.playSegments(compSegment, true);
        this.animations.GirlCharVs.playSegments(compSegment, true);
        this.animations.BoyCharVs1.playSegments(compSegment, true);
      }, 2500);
      this.animations.BoyCharVs2.playSegments(compSegment, true);
      this.animations.GirlCharVs.playSegments(compSegment, true);
      this.animations.BoyCharVs1.playSegments(compSegment, true);
    },
    usePlusTime() {
      if (this.hintPlusTime.unlocked && !this.hintPlusTime.used) {
        const audio = new Audio(
          "../../../lib-native/buzzTime/audio/button_click1.mp3"
        );
        audio.play();
        this.timeLeft += 10;
        if (this.timeLeft > 60) this.timeLeft = 60;

        clearInterval(this.timerInterval);
        this.startTimer();

        this.hintPlusTime.used = true;
        this.hintPlusTime.class = "hint2-dim";
      }
    },
    useShowAnswer() {
      if (this.hintShowAnswer.unlocked && !this.hintShowAnswer.used) {
        const audio = new Audio(
          "../../../lib-native/buzzTime/audio/button_click1.mp3"
        );
        audio.play();
        const currentQuestionData =
          this.allQuestions[this.currentQuestionIndex];

        if (currentQuestionData) {
          let answer = "";
          if (Array.isArray(currentQuestionData.answers)) {
            answer = currentQuestionData.answers[0];
          } else if (currentQuestionData.answer) {
            answer = currentQuestionData.answer;
          }

          answer = (answer ?? "").toString().trim();

          if (answer) {
            const normalize = (s) =>
              (s ?? "")
                .toString()
                .trim()
                .toLowerCase()
                .replace(/[\u2019\u2018]/g, "'");

            const normalizedAnswer = normalize(answer);
            const current = this.currentInput ?? "";
            const normalizedCurrent = normalize(current);

            const revealCount = 2;
            if (
              normalizedCurrent &&
              !normalizedAnswer.startsWith(normalizedCurrent)
            ) {
              this.currentInput = answer.substring(
                0,
                Math.min(revealCount, answer.length)
              );
            } else {
              const currentLength = this.currentInput
                ? this.currentInput.length
                : 0;
              this.currentInput = answer.substring(
                0,
                Math.min(answer.length, currentLength + revealCount)
              );
            }
          }
        }

        this.hintShowAnswer.used = true;
        this.hintShowAnswer.class = "hint1-dim";
      }
    },
    prepareAutoStart() {
      if (this.autoStartedForIndex === this.currentQuestionIndex) return;
      this.keyboardDimmed = true;
      this.showComputerTyping = true;

      this.autoStartedForIndex = this.currentQuestionIndex;
      this.autoStartInProgress = true;
      this.isAutoStart = true;
      this.isComputerTurn = true;
    },
    finishAutoStart() {
      let feedbackAudio;
      setTimeout(() => {
        const isCorrect = this.checkAndSetAnswerStatus();
        this.showComputerTyping = false;
        this.autoStartInProgress = false;

        if (isCorrect) {
          const audio = new Audio(
            "../../../lib-native/buzzTime/audio/right.mp3"
          );
          audio.play();
          if (this.characterConfig === "showGirlCharVs") {
            feedbackAudio = new Audio(
              "../../../lib-native/buzzTime/audio/girl_yes.mp3"
            );
          } else if (this.characterConfig === "showBoyCharVs1") {
            feedbackAudio = new Audio(
              "../../../lib-native/buzzTime/audio/boy_yes.mp3"
            );
          } else if (this.characterConfig === "showBoyCharVs2") {
            feedbackAudio = new Audio(
              "../../../lib-native/buzzTime/audio/boy_yes.mp3"
            );
          }
          if (feedbackAudio) feedbackAudio.play();
          this.handleComputerResponse();

          this.allQuestions[this.currentQuestionIndex].endTime = this.getDate();
          this.posts[0].endTime = this.getDate();
          this.posts[0].questions[this.currentQuestionIndex] =
            this.allQuestions[this.currentQuestionIndex];

          this.finalizeTurn(true);
        } else {
          const wrongAudio = new Audio(
            "../../../lib-native/buzzTime/audio/wrong.mp3"
          );
          wrongAudio.play();
          if (this.characterConfig === "showGirlCharVs") {
            feedbackAudio = new Audio(
              "../../../lib-native/buzzTime/audio/girl_oh_no.mp3"
            );
          } else if (this.characterConfig === "showBoyCharVs1") {
            feedbackAudio = new Audio(
              "../../../lib-native/buzzTime/audio/boy_oh_no.mp3"
            );
          } else if (this.characterConfig === "showBoyCharVs2") {
            feedbackAudio = new Audio(
              "../../../lib-native/buzzTime/audio/boy_oh_no.mp3"
            );
          }

          if (feedbackAudio) feedbackAudio.play();

          this.lastComputerGotPoint = false;
          this.updateComputerLamps();
          this.playComputerAnimation(false);
          if (this.enterPressed) return;
          this.enterPressed = true;
          this.showCongratsMessage(false);
          this.updateAutoKeyboardFeedback(false);
          this.showVsLightAnimation = false;

          setTimeout(() => {
            this.enterPressed = false;
            this.isComputerTurn = false;
          }, 1800);
          setTimeout(() => {
            this.keyboardLampState = "on";
            this.startTimer();
            this.showleftLightAnimation = true;
          }, 10);
        }
        this.showVsLightAnimation = false;
        this.keyboardLampState = "off";
      }, 4500);
    },
    handleTimeOut(isComputeTry) {
      this.clearAllTimers();
      isComputeTry
        ? [
            (this.showComputerTyping = true),
            this.simulateComputerTurn(),
            this.showCongratsMessage(false),
          ]
        : this.handleWrongAnswer();
      this.updateUIOnTimeout();
      this.finalizeTimeout();
      this.allQuestions[this.currentQuestionIndex].numberOfTrial = 1;
      this.allQuestions[this.currentQuestionIndex].endTime = this.getDate();
      this.posts[0].questions[this.currentQuestionIndex] =
        this.allQuestions[this.currentQuestionIndex];
      this.UpdateStudentActivity();
    },

    updateUIOnTimeout() {
      this.showCongratsMessage(false);

      this.updateLampState(false);
      document.getElementById("buzzScreen").style.backgroundColor = "#cc0000";
      this.showleftLightAnimation = false;
    },

    finalizeTimeout() {
      setTimeout(() => {
        this.showleftLightAnimation = false;
        this.showComputerTyping = true;
        this.keyboardDimmed = true;
        this.keyboardLampState = "dimmed";
      }, 1500);

      setTimeout(() => {
        this.showKeyboard = false;
        this.autoStart = false;
        this.completeTurn();
      }, 6000);
    },
    completeTurn(isCorrect) {
      this.updateLampState(isCorrect);
      this.keyboardLampState = "dimmed";

      if (!isCorrect) {
        this.handleIncorrectAnswer();
      }

      this.scheduleNextAutoStart();
      this.resetTurnState();
    },

    resetTurnState() {
      setTimeout(() => {
        this.keyboardStatus = "keyboard-normal";
        this.enterPressed = false;
      }, 3000);
      setTimeout(() => {
        this.loadRandomQuestion();
      }, 4000);
    },
    scheduleNextAutoStart() {
      if (this.autoStartTimeout) clearTimeout(this.autoStartTimeout);

      const delays = [10000];
      const randomDelay = delays[Math.floor(Math.random() * delays.length)];

      this.autoStartTimeout = setTimeout(() => {
        console.log("this.showBuzzButton");
        if (this.showBuzzButton) this.autoStartQuiz();
      }, randomDelay);
    },
    handleIncorrectAnswer() {
      this.currentInput = "";
      if (vsLight) {
        this.animations.vsLight.playSegments([0, 10], true);
      }
      this.calculateScore();

      setTimeout(() => {
        this.showVsLightAnimation = false;
        this.showComputerTyping = false;
        this.showKeyboard = false;
      }, 3000);
    },
    updateLampState(isPlayerCorrect) {
      if (this.lampUpdatedForIndex === this.currentQuestionIndex) {
        return;
      }
      this.lampUpdatedForIndex = this.currentQuestionIndex;
    },

    updatePlayerLamps(isCorrect) {
      const nextLampIndex = this.lamps.findIndex((lamp) => lamp.state === 0);
      console.log("lamp " + nextLampIndex);
      if (nextLampIndex !== -1) {
        this.$set(this.lamps, nextLampIndex, {
          ...this.lamps[nextLampIndex],
          state: isCorrect ? 1 : 2,
        });
      }
    },
    updateComputerLamps() {
      const nextLampIndex = this.lampsRight.findIndex(
        (lamp) => lamp.state === 0
      );
      console.log(this.lampsRight);
      console.log("lamp computer " + nextLampIndex);

      if (nextLampIndex === -1) return;

      if (this.lastComputerGotPoint) {
        this.$set(this.lampsRight, nextLampIndex, {
          ...this.lampsRight[nextLampIndex],
          state: this.lastComputerGotPoint ? 1 : 2,
        });
      } else {
        this.$set(this.lampsRight, nextLampIndex, {
          ...this.lampsRight[nextLampIndex],
          state: 2,
        });
      }
    },
    getRandomGameConfig() {
      this.startComputerTurnAnimation();

      const audio = new Audio("../../../lib-native/buzzTime/audio/vs.mp3");
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 5000);

      const vsSegments = [
        [0, 94],
        [95, 189],
        [190, 284],
      ];
      const characterConfigs = [
        { name: "BoyCharVs1", flag: "showBoyCharVs1" },
        { name: "BoyCharVs2", flag: "showBoyCharVs2" },
        { name: "GirlCharVs", flag: "showGirlCharVs" },
      ];
      const randomIndex = Math.floor(Math.random() * vsSegments.length);

      console.log("frames = ", vsSegments[randomIndex]);
      console.log("characterConfigs = ", characterConfigs[randomIndex]);

      return {
        vsSegment: vsSegments[randomIndex],
        characterConfig: characterConfigs[randomIndex],

        vsAudio: audio,
      };
    },
    resetAllCharacterStages() {
      this.showGirlStage = false;
      this.showBoyStage = false;
      this.showGirlCharVs = false;
      this.showBoyCharVs1 = false;
      this.showBoyCharVs2 = false;
    },
    handleVsAnimationCompletion(characterConfig, vsInstance) {
      document.getElementById(`${this.selectedAvatar}Vs`).style.display =
        "none";
      document.getElementById("buzzScreen").style.display = "block";

      const buzzAnim = this.animations.buzzScreen;
      buzzAnim.stop();

      buzzAnim.playSegments([0, 20], true);
      buzzAnim.loop = true;
      const toggleButton = document.querySelector(".toggle-light-button");
      if (toggleButton) {
        toggleButton.style.pointerEvents = "auto";
        toggleButton.addEventListener("click", () => {
          buzzAnim.loop = false;
          buzzAnim.playSegments([20, 36], true);

          buzzAnim.removeEventListener("complete", this._buzzResetHandler);
          this._buzzResetHandler = () => {
            buzzAnim.playSegments([0, 20], true);
            buzzAnim.loop = true;
          };
          buzzAnim.addEventListener("complete", this._buzzResetHandler, {
            once: true,
          });
        });
      }
      this.$nextTick(() => {
        this[characterConfig.flag] = true;
        this.activeComputerCharFlag = characterConfig.flag;

        const charAnim = window[characterConfig.name];
        const segments = this.animationSegments[characterConfig.name];

        if (charAnim && typeof charAnim.play === "function") {
          if (segments?.length) {
            const randomSeg =
              segments[Math.floor(Math.random() * segments.length)];
            charAnim.playSegments(randomSeg, true);
          } else {
            charAnim.play();
          }
        }
      });
      vsInstance.removeEventListener("complete", this.onVsAnimationComplete);
      this.showHintScreen = true;
    },
    toggleLang() {
      if (this.langToggleInProgress) return;

      this.langToggleInProgress = true;

      const audio = new Audio(
        "../../../lib-native/buzzTime/audio/button_click1.mp3"
      );
      audio.play();

      this.currentLang = this.currentLang === "en" ? "ar" : "en";
      this.langClass = this.currentLang === "ar" ? "langEng" : "langAra";

      this.animations.introStage.playSegments(
        this.currentLang === "ar" ? [120, 170] : [170, 120],
        true
      );
      setTimeout(() => {
        this.langToggleInProgress = false;
      }, 1000);
    },

    toggleLangAudio() {
      if (this.langToggleInProgress || !this.showHintScreen) return;

      this.langToggleInProgress = true;
      this.showHintScreen = true;
      if (this.hintAudio) {
        this.hintAudio.pause();
        this.hintAudio.currentTime = 0;
      }

      this.hintAudio = new Audio(
        this.currentLang === "en"
          ? "../../../lib-native/buzzTime/audio/arabic_hint.mp3"
          : "../../../lib-native/buzzTime/audio/eng_hint.mp3"
      );
      this.hintAudio.play();

      this.currentLang = this.currentLang === "en" ? "ar" : "en";
      this.langClass = this.currentLang === "ar" ? "langEng" : "langAra";

      this.animations.introStage.playSegments(
        this.currentLang === "ar" ? [120, 170] : [170, 120],
        true
      );
      setTimeout(() => {
        this.langToggleInProgress = false;
      }, 1000);
    },
    changeAvatar() {
      const audio = new Audio("../../../lib-native/buzzTime/audio/click.mp3");
      audio.play();
      if (this.currentAvatarIndex === 0) {
        this.animations.chooseAvatar.playSegments([0, 9], true);
        this.currentAvatarIndex = 1;
        this.selectedAvatar = "boy";
      } else {
        this.animations.chooseAvatar.playSegments([9, 0], true);
        this.currentAvatarIndex = 0;
        this.selectedAvatar = "girl";
      }
    },
    startGame() {
      const audio = new Audio("../../../lib-native/buzzTime/audio/start.mp3");
      const config = this.getRandomGameConfig(); // استدعاء دالة getRandomGameConfig مرة واحدة
      this.characterConfig = config.characterConfig.flag; // استخدام النتيجة
      this.showAvatar = false;

      setTimeout(() => {
        this.showHintScreen = true;
        if (this.hintAudio) {
          this.hintAudio.pause();
          this.hintAudio.currentTime = 0;
        }

        this.hintAudio = new Audio(
          this.currentLang === "en"
            ? "../../../lib-native/buzzTime/audio/eng_hint.mp3"
            : "../../../lib-native/buzzTime/audio/arabic_hint.mp3"
        );
        this.hintAudio.play();
      }, 4600);

      const { vsSegment, characterConfig } = config; // استرجاع القيم من المتغير config

      this.resetAllCharacterStages();

      const vsInstance =
        this.selectedAvatar === "girl"
          ? this.animations.girlVs
          : this.animations.boyVs;
      document.getElementById(`${this.selectedAvatar}Vs`).style.display =
        "block";
      vsInstance.stop();
      vsInstance.playSegments(vsSegment, true);
      this.selectedAvatar === "girl"
        ? (this.showGirlStage = true)
        : (this.showBoyStage = true);
      vsInstance.removeEventListener("complete", this.onVsAnimationComplete);
      this.onVsAnimationComplete = () => {
        this.handleVsAnimationCompletion(characterConfig, vsInstance);
        const allCharacters = [
          this.animations.girlStage,
          this.animations.boyStage,
          this.animations.GirlCharVs,
          this.animations.BoyCharVs2,
          this.animations.BoyCharVs1,
        ];
        allCharacters.forEach((char) => {
          setTimeout(() => {
            char.loop = true;
            char.playSegments([0, 45], true);
          }, 5);
        });
      };

      vsInstance.addEventListener("complete", this.onVsAnimationComplete);
    },
    playDynamicFeedback() {
      this.cleanupTimers();

      const myAdjusted = this.getAdjustedScore(this.studentScore);
      const computerAdjusted = this.getAdjustedScore(this.computerScore);

      let playerRange = this.getAnimationRangeByLevel(myAdjusted);
      let computerRange = this.getAnimationRangeByLevel(computerAdjusted);

      if (this.selectedAvatar === "girl") {
        this.animations.girlStageFeedback.playSegments(playerRange, true);
      } else {
        this.animations.boyStageFeedback.playSegments(playerRange, true);
      }

      if (this.activecomputerCharFlag === "showBoyCharVs1") {
        this.animations.boyVs1Feedback.playSegments(computerRange, true);
      } else if (this.activecomputerCharFlag === "showBoyCharVs2") {
        this.animations.boyVs2Feedback.playSegments(computerRange, true);
      } else if (this.activecomputerCharFlag === "showGirlCharVs") {
        this.animations.girlVsFeedback.playSegments(computerRange, true);
      }
      if (myAdjusted > computerAdjusted && myAdjusted == 6) {
        this.animations.festival.playSegments([0, 30], true);
      }
      if (myAdjusted === computerAdjusted) {
        this.isEqual = true;
      } else {
        this.isEqual = false;
      }
    },
    getAdjustedScore(score) {
      if (score > 0 && score < 3) return 1;
      if (score == 3) return 3;
      return score;
    },
    getAnimationRangeByLevel(level) {
      switch (level) {
        case 6:
          return [0, 69]; // ممتاز
        case 5:
          return [140, 209]; // جيد جدًا
        case 4:
          return [70, 130]; // جيد
        case 3:
          return [210, 279]; // silver
        case 2:
          return [280, 319]; // ضعيف
        default:
          return [320, 349]; // ضعيف جدًا
      }
    },
    getBadgeClass(score) {
      if (score >= 60) return "badge-5";
      if (score >= 50) return "badge-4";
      if (score >= 40) return "badge-3";
      if (score >= 30) return "badge-2";
      return "badge-1";
    },
    // ========== GAME RESET METHODS ==========
    resetGame() {
      location.reload();
    },

    resetAnmination() {
      this.showBuzzButton = true;
      const allCharacters = [
        this.animations.girlStage,
        this.animations.boyStage,
        this.animations.GirlCharVs,
        this.animations.BoyCharVs2,
        this.animations.BoyCharVs1,
      ];

      allCharacters.forEach((char) => {
        setTimeout(() => {
          char.loop = true;
          char.playSegments([0, 45], true);
        }, 5);
      });
      this.animations.vsLight.playSegments([0, 10], true);
      this.animations.leftLight.playSegments([0, 10], true);
    },

    appendChar(char) {
      if (this.currentInput.length < 30) {
        this.currentInput += char;
      }
    },
    getRandomCongratsMessage(isCorrect) {
      const correctMessages = ["Great Job", "Excellent", "Perfect", "Amazing"];
      const incorrectMessages = ["Good Try", "Don't Give Up", "Keep Going"];

      return isCorrect
        ? correctMessages[Math.floor(Math.random() * correctMessages.length)]
        : incorrectMessages[
            Math.floor(Math.random() * incorrectMessages.length)
          ];
    },

    showCongratsMessage(isCorrect) {
      if (this.showResultScreen || !this.isLoaded) return;
      clearInterval(this.timerInterval);

      const messageText = this.getRandomCongratsMessage(isCorrect);

      const message = document.createElement("div");
      message.classList.add(
        "congrats-message",
        isCorrect ? "congrats-correct" : "congrats-wrong"
      );
      message.innerText = messageText;

      document.body.appendChild(message);

      setTimeout(() => {
        if (document.body.contains(message)) {
          document.body.removeChild(message);
        }
      }, 2000);
    },
    animateKeyPress(el) {
      if (!el) return;
      el.classList.add("key-pressed");
      setTimeout(() => {
        el.classList.remove("key-pressed");
      }, 150);
    },
    updateKeyboardFeedback(isCorrect) {
      this.keyboardStatus = isCorrect ? "keyboard-correct" : "keyboard-wrong";
      setTimeout(() => {
        this.showKeyboard = false;
      }, 3000);
    },
    updateAutoKeyboardFeedback(isCorrect) {
      this.keyboardStatus = isCorrect ? "keyboard-correct" : "keyboard-wrong";
      setTimeout(() => {
        this.keyboardStatus = "keyboard-normal";
      }, 2000);
    },
    toggleKeyboardVisibility(show) {
      this.showKeyboard = show;
    },
    getLampStyle(index, side) {
      let lampList;
      let zIndex;
      if (side === "left") {
        lampList = this.lamps;
        zIndex = 100 - index;
      } else {
        lampList = this.lampsRight;
        zIndex = 100 - index;
      }
      const lamp = lampList[index];
      const sizeVW = 2.6;
      return {
        position: "absolute",
        top: `${lamp.y}%`,
        left: `${lamp.x}%`,
        width: `${sizeVW}vw`,
        height: `${sizeVW}vw`,
        zIndex: zIndex,
        transform: "translate(-50%, -50%)`",
        cursor: "pointer",
      };
    },
    getLampImage(lampState) {
      if (this.selectedAvatar === "girl") {
        return this.leftLampStates[lampState];
      } else {
        return this.rightLampStates[lampState];
      }
    },
    getKeyImage(keyId) {
      const isDimmed = this.isComputerTurn || this.autoStartActive;

      let imageName = "";
      switch (keyId) {
        case "?/,":
          imageName = "123";
          break;
        case "space":
          imageName = "space";
          break;

        case "abc":
          imageName = "abc";
          break;

        case "enter":
          imageName = "enter";
          break;
        case "shift":
          imageName = "shift";
          break;
        case "backspace":
          imageName = "backspace";
          break;
        default:
          imageName = "keyboardbutton";
      }
      return `../../../lib-native/buzzTime/images/${imageName}${
        isDimmed ? "_dim" : ""
      }.png`;
    },
    getKeyboardImage() {
      switch (this.keyboardStatus) {
        case "keyboard-correct":
          return "keyboard-correct";
        case "keyboard-wrong":
          return "keyboard-wrong";
        default:
          return "keyboard-normal";
      }
    },
    cleanupEventListeners() {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener("keydown", this._boundEnterPress);

      if (buzzScreen && this._buzzScreenCompletionHandler) {
        this.animations.buzzScreen.removeEventListener(
          "complete",
          this._buzzScreenCompletionHandler,
          { once: true }
        );
      }
    },
    cleanupAnimations() {
      if (vsInstance && this.onVsAnimationComplete) {
        vsInstance.removeEventListener("complete", this.onVsAnimationComplete);
      }
    },
    clearAllTimers() {
      clearInterval(this.timerInterval);
      clearTimeout(this.autoStartTimeout);
      clearTimeout(this.startButtonTimeout);
    },
    goToNext(ev) {
      const audio = new Audio("../../../lib-native/buzzTime/audio/buzz.mp3");
      audio.play();
      ev.target.style.display = "none";
      let captured = false;
      let currentFrame = 0;

      this.animations.introStage.addEventListener("enterFrame", (e) => {
        if (!captured && e.currentTime > 0) {
          currentFrame = e.currentTime;
          this.animations.introStage.stop();
          captured = true;
          this.animations.introStage.playSegments([currentFrame, 120], true);
          this.animations.introStage.setSpeed(1.5);
          this.animations.introStage.loop = false;
        }
      });
      setTimeout(() => {
        this.showClose = true;
      }, 1705);
    },
    closeIntro() {
      const audio = new Audio(
        "../../../lib-native/buzzTime/audio/button_click1.mp3"
      );
      audio.play();
      this.animations.introStage.playSegments([170, 170], true);
      this.animations.introStage.addEventListener(
        "complete",
        () => {
          const introEl = document.getElementById("introStage");
          if (introEl) {
            this.animations.introStage.destroy();
            introEl.remove();
          }
          this.showLang = false;
          this.showClose = false;
          this.showAvatar = true;
        },
        { once: true }
      );
      this.currentLang = "en";
      this.langClass = "langAra";
    },
    closeHint() {
      const audio = new Audio(
        "../../../lib-native/buzzTime/audio/button_click1.mp3"
      );
      audio.play();
      this.showHintScreen = false;
      if (this.hintAudio) {
        this.hintAudio.pause();
        this.hintAudio.currentTime = 0;
      }
      if (this.startButtonTimeout) {
        clearTimeout(this.startButtonTimeout);
      }
      this.startButtonTimeout = setTimeout(() => {
        document.querySelector(".toggle-light-button").style.pointerEvents =
          "none";
        console.log("closeHint");
      }, 15000);
      this.startButtonTimeout = setTimeout(() => {
        this.showHand = false;
        this.autoStartQuiz();
      }, 20000);
      this.resumeGame();
      this.allQuestions[this.currentQuestionIndex].startTime = this.getDate();
      this.posts[0].questions[this.currentQuestionIndex] =
        this.allQuestions[this.currentQuestionIndex];
      this.UpdateStudentActivity();
      if (this.audio && this.audio.backgroundMusic) {
        this.audio.backgroundMusic.loop = true;
        this.audio.backgroundMusic
          .play()
          .catch((e) => console.log("background play blocked", e));
      }
    },
    pauseGame() {
      this.paused = true;
    },
    resumeGame() {
      this.paused = false;
    },
    openHint() {
      this.showHintScreen = true;
      this.pauseGame();
      this.toggleLangAudio();
    },
    async startQuiz() {
      this.isAutoStart = false;
      const audio = new Audio("../../../lib-native/buzzTime/audio/buzz.mp3");
      audio.play();
      clearTimeout(this.startButtonTimeout);
      this.showHand = false;
      this.clearExistingTimeouts();
      this.initializeQuizUI();
      await this.playBuzzIntro();
      this.toggleKeyboardVisibility(true);
      this.showleftLightAnimation = true;
      this.setupQuizTimer();
    },
    clearExistingTimeouts() {
      if (this.startButtonTimeout) {
        clearTimeout(this.startButtonTimeout);
        this.startButtonTimeout = null;
      }
      if (this.autoStartTimeout) {
        clearTimeout(this.autoStartTimeout);
        this.autoStartTimeout = null;
      }
    },
    async autoStartQuiz() {
      this.computerStart[this.currentQuestionIndex] = true;
      const audio = new Audio(
        "../../../lib-native/buzzTime/audio/computeranswer.mp3"
      );
      audio.play();
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, 5000);
      this.prepareAutoStart();
      await this.playBuzzIntro();
      document.querySelector(".toggle-light-button").style.pointerEvents =
        "none";
      this.toggleKeyboardVisibility(true);
      this.finishAutoStart();
    },
    playBuzzIntro(callback) {
      this.showleftLightAnimation = true;
      if (this.isAutoStart) {
        this.playAutoStartAnimation(callback);
      } else {
        this.playManualStartAnimation(callback);
      }
    },
    playAutoStartAnimation(callback) {
      this.showVsLightAnimation = true;
      this.showleftLightAnimation = false;

      if (vsLight) {
        this.animations.vsLight.stop();
        this.animations.vsLight.playSegments([0, 10], true);
      }
      this.setupAnimationCompletionHandler(callback);
    },
    playManualStartAnimation(callback) {
      this.showleftLightAnimation = true;
      if (leftLight) {
        this.animations.leftLight.playSegments([0, 10], true);
      }
      this.setupAnimationCompletionHandler(callback);
    },
    playPlayerAnimation(isCorrect) {
      this.showleftLightAnimation = false;
      if (leftLight) this.animations.leftLight.stop();
      const playerSegment = isCorrect ? [48, 100] : [100, 148];
      const vsInstance =
        this.selectedAvatar === "girl"
          ? this.animations.girlVs
          : this.selectedAvatar === "boy"
          ? this.animations.boyVs
          : null;
      if (vsInstance) {
        vsInstance.stop();
        vsInstance.playSegments(playerSegment, true);
      }
    },
    UpdateStudentActivity() {
      direction != ""
        ? globalFunctions.UpdateStudentActivity(this.activityId, this.posts[0])
        : "";
    },
  },
});
