let Penguin = document.querySelector("#penguin");
let pageUrl = Penguin.getAttribute("data-urlpage");
new Vue({
  el: "#penguin",
  data: {
    posts: [],
    startLo: false,
    informationLO: null,
    popupOpened: false,
    music: false,
    bgAudio: new Audio(),
    clickBtn: new Audio(),
    wrongAnswer: new Audio(),
    rightAnswer: new Audio(),
    hint: new Audio(),
    sound: new Audio(),
    firstQ: 0,
    questionStart: false,
    shuffled: [],
    counter: 0,
    content: null,
    activeQuestion: null,
    checkInput: true,
    feedBackShow: false,
    finalProgress: null,
    result: (number = 0),
    Estimation: null,
    upper: null,
    isEng: null,
    checkbtn: null,
    answerbtn: null,
    screenClick: (number = 0),
    sec: null,
    checkHand: false,
    answerHand: false,
    helpHand: false,
    roundTwo: false,
    infotmationClick: false,
    roundNum: null,

    // --------------------------------------------------------
    isLoading: false,
    isSuccess: false,
    activityId: 0,
    currentdate: "",
    loQuestion: null,
    // --------------------------------------------------------
  },
  created() { },
  async mounted() {
    if (
      !window.location.hostname.includes(
        "127.0.0.1" || "stblobstrgeaccount.blob.core.windows.net"
      )
    ) {
      document.addEventListener("contextmenu", function (event) {
        event.preventDefault();
      });
    }
    await this.getData();
    this.shuffle(this.posts[0].items);
    this.nextQuestion();
    this.clickBtn.src =
      "../../../lib-native/penguin/assets/audios/click_btn.mp3";
  },
  methods: {
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
      // --------------------------------------------------------
      if (direction == "2") {
        await returnData.then((response) => {
          this.isSuccess = response.isSuccess;
          this.data = response.value;

          this.activityId = this.data.activityId;
          if (
            this.data.learningObjectAsJson != null &&
            this.data.learningObjectAsJson != ""
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);

            // this.posts[0].items.forEach((e) => {
            //   e.correctCounter = 0;
            // });
            // this.posts[0].items = jsonData;
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
      }
      !this.dataLoaded
        ? await fetch(pageUrl + ".json")
          .then((res) => res.json())
          .then((data) => {
            this.posts = data;
            this.loQuestion = this.posts[0].numberOfquestion;
          })
        : "";

      // --------------------------------------------------------
      this.posts[0].length != 0
        ? setTimeout(() => {
          this.isLoading = true;
          this.posts[0].startTime = this.getDate();
          this.loQuestion = this.posts[0].numberOfquestion;
        }, 1000)
        : (this.isLoading = false);

      checkQuestions() ? (this.loQuestion = this.posts[0].items.length) : "";
      let params = getURLParameters();
      if (params.numberOfQuestions) {
        this.posts[0].upper = params.upper;
        this.posts[0].isEng = params.lang;
        this.posts[0].numberOfquestion = params.numberOfQuestions;
        this.loQuestion = params.numberOfQuestions;
        this.posts[0].hint = params.hint;
        this.posts[0].questionAudio = params.questionAudio;
      }
      this.upper = this.posts[0].upper;
      this.isEng = this.posts[0].isEng;
    },
    addFont() {
      if (this.posts[0].isEng) {
        document.querySelectorAll("*").forEach((el) => {
          el.style.fontFamily = "ArialRounded";
        });
        document.querySelectorAll("input").forEach((el) => {
          el.style.fontFamily = "Amin";
        });
        document.querySelectorAll(".number").forEach((el) => {
          el.style.fontFamily = "Amin";
        });
        document.querySelectorAll(".text").forEach((el) => {
          el.style.fontFamily = "ArialRounded";
        });
      } else {
        if (this.posts[0].upper) {
          document.querySelectorAll("*").forEach((el) => {
            el.style.fontFamily = "samim";
          });
          document.querySelectorAll("input").forEach((el) => {
            el.style.fontFamily = "ArialRounded";
          });
          document.querySelectorAll(".number").forEach((el) => {
            el.style.fontFamily = "ArialRounded";
          });
          document.querySelectorAll(".text").forEach((el) => {
            el.style.fontFamily = "samim";
          });
        } else {
          document.querySelectorAll("*").forEach((el) => {
            el.style.fontFamily = "AraJozoor";
          });
        }
      }
    },
    start() {
      this.informationLO = this.posts[0].informationLO;
      this.startLo = true;
       if (this.informationLO != "") {
        this.showInformation();
      } else {
        this.moverStart();
        penguinCharacter.playSegments([0, 50], true);
        this.firstQ += 1;
        document.querySelectorAll(".information").forEach((el) => {
          el.style.display = "none";
        });
      }
      this.muteMusic();
      this.addFont();
    },
    showInformation() {
      this.popupOpened = true;
      this.sound.pause();
      this.sound.currentTime = 0;
      clearInterval(this.setInterval);
      this.screenClick = 0;
      if (this.posts[0].hint) {
        this.hint.src = "audio/hint.mp3";
        this.hint.play();
      }
    },
    closePopup() {
      this.popupOpened = false;
      if (this.firstQ == 1) {
        this.moverStart();
        penguinCharacter.playSegments([0, 50], true);
        this.firstQ += 1;
      } else {
        this.sound.play();
        this.soundPlay();
        // console.log("this.soundPlay" + "1");
        this.hint.pause();
        this.hint.currentTime = 0;
      }
      if (this.posts[0].hint) {
        this.hint.pause();
      }
    },
    muteMusic() {
      this.bgAudio.src = "../../../lib-native/penguin/assets/audios/music.mp3";
      this.music = !this.music;
      this.bgAudio.loop = true;
      this.music ? this.bgAudio.play() : this.bgAudio.pause();
    },
    shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      this.shuffled = a.slice(0, this.loQuestion);
    },
    nextQuestion() {
      this.firstQ += 1;
      clearInterval(this.setInterval);
      this.screenClick = 0;
      this.roundNum = 1;
      if (this.counter <= this.loQuestion) {
        if (this.counter < this.loQuestion) {
          this.posts[0].questionAudio
            ? (this.sound.src =
              "audio/q" + this.posts[0].items[this.counter].id + ".mp3")
            : "",
            (this.border = document.getElementsByClassName("border"));
          this.posts[0].items.forEach((element) => {
            element.active = false;
          });
          this.posts[0].items[this.counter].active = true;
          this.posts[0].items[this.counter].active
            ? (this.posts[0].items[this.counter].startTime = this.getDate())
            : "";

          this.activeQuestion = this.posts[0].items[this.counter];
        } else if (this.loQuestion == this.counter) {
          this.feedBackShow = true;
          this.bgAudio.pause();
          clearInterval(this.setInterval);
          this.screenClick = 0;
        }
      }
      // --------------------------------------------------------
      this.addFont();

      penguinCharacter.playSegments([0, 50], true);
    },
    moverStart() {
      this.border[0]?.classList.remove("go");
      this.border[0]?.classList.add("back");
      this.questionStart = true;
      setTimeout(() => {
        this.infotmationClick = true;
        if (this.posts[0].questionAudio) {
          this.sound.play();
          this.soundPlay();
          // console.log("this.soundPlay" + "2");
          this.hint.pause();
          this.hint.currentTime = 0;
          if (this.roundNum == 1) {
            this.helpHand = true;
          }
        }
        document
          .querySelector(".question.active")
          .classList.remove("disPointer");
      }, 3000);
    },
    clickInput() {
      this.helpHand = false;
      this.clickBtn.play();
      this.sound.currentTime = 0;
      this.sound.pause();
    },
    changeValue() {
      this.clickBtn.play();
      this.checkbtn = document.querySelector(".check");
      this.checkbtn.classList.add("btn-check-active");
      this.checkbtn.classList.remove("btn-check");
      if (this.roundNum == 1) {
        this.checkHand = true;
      }
    },
    checkInputALL() {
      this.infotmationClick = false;
      this.checkHand = false;
      clearInterval(this.setInterval);
      this.screenClick = 0;
      this.clickBtn.play();
      this.checkbtn.classList.add("btn-check");
      this.checkbtn.classList.remove("btn-check-active");
      numOfInput(this.activeQuestion, this.roundNum);
      let Success = checkInputALL(this.activeQuestion, this.roundNum, this.isEng,this.upper);
      if (this.roundNum == 1) {
        Success ? this.trueAnswerInput() : this.falseAnswerInput();
      } else if (this.roundNum == 2) {
        Success
          ? this.trueAnswerInputRoundTwo()
          : this.falseAnswerInputRoundTwo();
      }
    },
    showAnswer() {
      this.answerHand = false;
      this.posts[0].items[this.counter].numberOfTrial += 1;
      this.UpdateStudentActivity();
      this.clickBtn.play();
      showAnswer(this.activeQuestion, this.roundNum);
      penguinCharacter.playSegments([0, 50], true);
      this.answerbtn.classList.remove("btn-answer-active");
      this.answerbtn.classList.add("btn-answer");
      setTimeout(() => {
        if (this.roundNum == 1) {
          this.roundTwo = true;
          this.roundNum = 2;
          this.posts[0].questionAudioRoundTwo
            ? (this.sound.src =
              "audio/r" + this.posts[0].items[this.counter].id + ".mp3")
            : "";
          setTimeout(() => {
            this.infotmationClick = true;
            if (this.posts[0].questionAudioRoundTwo) {
              this.sound.play();
              this.soundPlay();
              // console.log("this.soundPlay" + "3");
              this.hint.pause();
              this.hint.currentTime = 0;
            }
          }, 3000);
          this.calculate();
        } else if (this.roundNum == 2) {
          this.counter += 1;
          setTimeout(() => {
            this.mover();
          }, 3000);
        }
        penguinCharacter.playSegments([0, 50], true);
      }, 3000);
    },
    trueAnswerInput() {
      this.result += 0.5;
      this.posts[0].LOcorrectcounter += 0.5;
      this.posts[0].items[this.counter].numberOfTrial += 0;
      this.UpdateStudentActivity();
      this.finished();
      penguinCharacter.playSegments([130, 195], true);
      this.rightAnswer.src =
        "../../../lib-native/penguin/assets/audios/rightanswer.mp3";
      this.rightAnswer.play();
      setTimeout(() => {
        this.roundTwo = true;
        this.roundNum = 2;
        this.calculate();
        penguinCharacter.playSegments([0, 50], true);
        this.posts[0].questionAudioRoundTwo
          ? (this.sound.src =
            "audio/r" + this.posts[0].items[this.counter].id + ".mp3")
          : "";
        setTimeout(() => {
          this.infotmationClick = true;
          if (this.posts[0].questionAudioRoundTwo) {
            this.sound.play();
            this.soundPlay();
            // console.log("this.soundPlay" + "4");
            this.hint.pause();
            this.hint.currentTime = 0;
          }
        }, 3000);
      }, 3000);
    },
    falseAnswerInput() {
      if (this.roundNum == 1) {
        this.answerHand = true;
      }
      penguinCharacter.playSegments([265, 350], true);
      this.answerbtn = document.querySelector(".answer");
      this.answerbtn.classList.add("btn-answer-active");
      this.answerbtn.classList.remove("btn-answer");
      this.wrongAnswer.src =
        "../../../lib-native/penguin/assets/audios/wronganswer.mp3";
      this.wrongAnswer.play();
    },
    mover() {
      if (this.counter < this.loQuestion) {
        this.border[0]?.classList.remove("back");
        this.border[0]?.classList.add("go");
      }
      // console.log("mover done");
      setTimeout(() => {
        this.nextQuestion();
        this.calculate();
        if (this.counter < this.loQuestion) {
          // console.log("mover done 2");

          this.border[0]?.classList.remove("go");
          this.border[0]?.classList.add("back");
          this.roundTwo = false;
          this.answerbtn?.classList.remove("btn-answer-active");
          this.answerbtn?.classList.add("btn-answer");
          this.checkbtn?.classList.remove("btn-check-active");
          this.checkbtn?.classList.add("btn-check");
          let inputs = document.querySelectorAll(".input");
          inputs.forEach((input) => {
            input.classList.remove("wrong");
            input.classList.remove("false");
            input.classList.remove("true");
            input.classList.remove("right");
          });
          setTimeout(() => {
            this.infotmationClick = true;
            if (this.posts[0].questionAudio) {
              this.sound.play();
              this.soundPlay();
              // console.log("this.soundPlay" + "5");
              this.hint.pause();
              this.hint.currentTime = 0;
            }
            document
              .querySelector(".question.active")
              .classList.remove("disPointer");
            // console.log("mover done 2");
          }, 3000);
        }
      }, 3500);
    },
    calculate() {
      this.Estimation = calculate(
        this.result,
        this.loQuestion,
        this.isEng,
        this.upper
      )[0];
      this.finalProgress = calculate(
        this.result,
        this.loQuestion,
        this.isEng,
        this.upper
      )[1];
    },
    finished() {
      let result = (this.posts[0].LOcorrectcounter / this.loQuestion) * 100;
      this.posts[0].counterCorrect =
        result == 0
          ? 0
          : result == 0
            ? 0
            : result <= 25
              ? 2.5
              : result <= 50
                ? 5
                : result <= 75
                  ? 7.5
                  : 10;
      finalResponse.submitData(
        JSON.stringify(this.posts[0]),
        (this.posts[0].counterCorrect * 4) / 10,
        this.posts[0].counterCorrect
      );
    },
    setclick() {
      this.hint.pause();
      this.hint.currentTime = 0;

      this.screenClick = 0;
    },
    soundPlay() {
      this.sec = this.sound.duration + 20;
      this.setInterval = setInterval(() => {
        this.screenClick += 1;
        // console.log(this.screenClick);
        if (this.screenClick == Math.floor(this.sec)) {
          setTimeout(() => {
            this.sound.play();
            this.screenClick = 0;
            this.hint.pause();
            this.hint.currentTime = 0;
          }, 10);
        }
      }, 1000);
    },

    UpdateStudentActivity() {
      this.posts[0].items[this.counter].active
        ? (this.posts[0].items[this.counter].endTime = this.getDate())
        : "";
        this.posts[0].endTime = this.getDate()
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
    finished() {
      let result = (this.posts[0].LOcorrectcounter / this.loQuestion) * 100;
      this.posts[0].counterCorrect =
        result == 0
          ? 0
          : result == 0
            ? 0
            : result <= 25
              ? 2.5
              : result <= 50
                ? 5
                : result <= 75
                  ? 7.5
                  : 10;
      finalResponse.submitData(
        JSON.stringify(this.posts[0]),
        (this.posts[0].counterCorrect * 4) / 10,
        this.posts[0].counterCorrect
      );
    },
    maxLength(event) {
      maxLength(event, this.activeQuestion, this.roundNum,
        this.posts[0].isEng,
        this.posts[0].upper);
    },
    reload() {
      location.reload();
    },

    trueAnswerInputRoundTwo() {
      this.result += 0.5;
      this.posts[0].LOcorrectcounter += 0.5;
      this.posts[0].items[this.counter].numberOfTrial += 0;
      this.UpdateStudentActivity();
      this.finished();
      this.counter += 1;
      penguinCharacter.playSegments([130, 195], true);
      this.rightAnswer.src =
        "../../../lib-native/penguin/assets/audios/rightanswer.mp3";
      this.rightAnswer.play();
      setTimeout(() => {
        this.mover();
      }, 3000);
    },
    falseAnswerInputRoundTwo() {
      penguinCharacter.playSegments([265, 350], true);
      this.answerbtn = document.querySelector(".answer");
      this.answerbtn.classList.add("btn-answer-active");
      this.answerbtn.classList.remove("btn-answer");
      this.wrongAnswer.src =
        "../../../lib-native/penguin/assets/audios/wronganswer.mp3";
      this.wrongAnswer.play();
    },
  },
});
