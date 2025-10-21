let Penguin = document.querySelector("#penguin");
let pageUrl = Penguin.getAttribute("data-urlpage");
new Vue({
  el: "#penguin",
  data: {
    posts: [],
    startLo: false,
    setInterval: null,
    question: false,
    counter: 0,
    music: false,
    count: (number = 0),
    bgAudio: new Audio(),
    clickBtn: new Audio(),
    wrongAnswer: new Audio(),
    rightAnswer: new Audio(),
    sound: new Audio(),
    screenClick: (number = 0),
    sec: null,
    character: (boolean = true),
    border: null,
    shuffled: [],
    click: false,
    result: (number = 0),
    loQuestion: (number = null),
    finalProgress: null,
    Estimation: null,
    hint: new Audio(),
    sechint: null,
    popupOpened: (boolean = false),
    correctChoose: "",
    correctChooseText: null,
    typeChoose: "",
    selectChoose: "",
    informationLO: "",
    upper: boolean,
    isEng: null,
    infotmationClick: false,
    // --------------------------------------------------------
    isLoading: false,
    isSuccess: false,
    activityId: 0,
    currentdate: "",
    date: null,
    QustionStart: false,
    firstQ: 0,
    // --------------------------------------------------------
  },
  created() {},
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
    this.wrongAnswer.src =
      "../../../lib-native/penguin/assets/audios/wronganswer.mp3";
    this.rightAnswer.src =
      "../../../lib-native/penguin/assets/audios/rightanswer.mp3";
    this.clickBtn.src =
      "../../../lib-native/penguin/assets/audios/click_btn.mp3";
    this.nextQuestion();

    finalResponse.submitData(JSON.stringify(this.posts[0]), 1, 0);
  },
  methods: {
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
    // --------------------------------------------------------
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
      // --------------------------------------------------------
      this.upper = this.posts[0].upper;
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
    checkChoose(event, answer) {
      this.sound.pause();
      this.sound.currentTime = 0;
      clearInterval(this.setInterval);
      this.clickBtn.play();
      let chooses = document.querySelectorAll(".active .choose");
      let correct = document.querySelectorAll(".active .choose.correct");
      this.infotmationClick = false;
      chooses.forEach((el) => {
        el.classList.remove("false");
      });

      if (answer.answer) {
        this.result += 1;
        this.rightAnswer.play();
        this.typeChoose = "true";

        this.isAllQuestionsRight();
        correct.forEach((ela) => {
          ela.classList.add("true");
        });
        // console.log(this.counter)
        this.posts[0].items[this.counter - 1].numberOfTrial = 0;

        this.posts[0].items[this.counter - 1].choose.forEach((el) => {
          if (el.answer) {
            this.correctChoose = true;
            this.correctChooseText = el.select;
            this.selectChoose = answer.select;
            if (!this.posts[0].upper) {
              correct.forEach((ela) => {
                ela.classList.add("true");
              });
            }
          }
        });
      } else {
        event.target.classList.add("false");
        this.wrongAnswer.play();
        penguinCharacter.playSegments([265, 350], true);
        this.typeChoose = "false";
        this.posts[0].items[this.counter - 1].numberOfTrial = 1;
        setTimeout(() => {
          this.calculate();
          this.nextQuestion();
          if (this.counter != this.loQuestion) {
            this.mover();
          }
          this.character = false;
        }, 4000);

        this.posts[0].items[this.counter - 1].choose.forEach((el) => {
          setTimeout(() => {
            if (el.answer) {
              this.correctChoose = true;
              this.correctChooseText = el.select;
              this.selectChoose = answer.select;
              if (!this.posts[0].upper) {
                correct.forEach((ela) => {
                  ela.classList.add("true");
                });
              }
            }
          }, 1000);
        });
      }
      this.UpdateStudentActivity();
      chooses.forEach((el) => {
        el.style.cssText = "pointer-events:none";
      });
      this.firstQ += 1;
    },
    // --------------------------------------------------------
    start() {
      this.informationLO = this.posts[0].informationLO;
      this.bgAudio.src = "../../../lib-native/penguin/assets/audios/music.mp3";
      this.bgAudio.loop = true;
      this.startLo = true;
      this.showInformation();
      this.music = true;
      this.bgAudio.play();
      this.addFont();
    },
    muteMusic() {
      this.music = !this.music;
      // console.log(this.music);
      this.music ? this.bgAudio.play() : this.bgAudio.pause();
    },
    nextQuestion() {
      this.firstQ += 1;
      clearInterval(this.setInterval);
      this.screenClick = 0;
      this.question = false;
      this.click = false;
      if (this.counter <= this.loQuestion) {
        if (this.counter < this.loQuestion) {
          this.posts[0].questionAudio
            ? (this.sound.src =
                "audio/q" + this.posts[0].items[this.counter].id + ".mp3")
            : "",
            (this.border = document.getElementsByClassName("border"));
          this.posts[0].items[this.counter].active
            ? (this.posts[0].items[this.counter].startTime = this.getDate())
            : "";
        } else if (this.loQuestion == this.counter) {
          this.question = true;
          this.bgAudio.pause();
          clearInterval(this.setInterval);
          this.screenClick = 0;
        }
        setTimeout(() => {
          if (this.counter < this.loQuestion) {
            this.posts[0].items.forEach((element) => {
              element.active = false;
            });
            this.posts[0].items[this.counter].active = true;
          }
          this.counter += 1;
        }, 3500);
      }
      if (this.posts[0].isEng) {
        document.querySelector(".progress")?.classList.add("eng");
      }
      // --------------------------------------------------------
      penguinCharacter.playSegments([0, 50], true);
    },

    mover() {
      this.border[0]?.classList.remove("back");
      this.border[0]?.classList.add("go");
      setTimeout(() => {
        this.border[0]?.classList.remove("go");
        this.border[0]?.classList.add("back");
        this.correctChoose = false;
        this.selectChoose = "";
        this.typeChoose = "";
        let correct = document.querySelectorAll(".active .choose.correct");
        correct.forEach((ela) => {
          ela.classList.remove("true");
        });
        // --------------------------------------------------------
        let chooses = document.querySelectorAll(".active .choose");
        chooses.forEach((el) => {
          el.style.cssText = "pointer-events:unset";
        });
        setTimeout(() => {
          this.infotmationClick = true;
          this.sound.play();
          this.soundPlay();
          this.hint.pause();
          this.hint.currentTime = 0;
        }, 4000);
      }, 3500);
    },
    moverStart() {
      this.border[0]?.classList.remove("go");
      this.border[0]?.classList.add("back");
      this.QustionStart = true;
      this.selectChoose = "";
      this.typeChoose = "";
      let correct = document.querySelectorAll(".active .choose.correct");
      correct.forEach((ela) => {
        ela.classList.remove("true");
      });
      // --------------------------------------------------------
      let chooses = document.querySelectorAll(".active .choose");
      chooses.forEach((el) => {
        el.style.cssText = "pointer-events:unset";
      });
      setTimeout(() => {
        this.infotmationClick = true;
        this.sound.play();
        this.soundPlay();
        this.hint.pause();
        this.hint.currentTime = 0;
      }, 3000);
    },
    reload() {
      location.reload();
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
    isAllQuestionsRight() {
      // --------------------------------------------------------
      this.posts[0].endTime = this.getDate();
      this.posts[0].items[this.counter - 1].endTime = this.posts[0].endTime;
      // --------------------------------------------------------
      this.posts[0].LOcorrectcounter += 1;
      this.character = true;
      this.finished();
      this.rightAnswer.play();
      penguinCharacter.playSegments([130, 195], true);
      setTimeout(() => {
        this.click = true;
        penguinCharacter.playSegments([0, 50], true);
        this.calculate();
        clearInterval(this.setInterval);
        this.screenClick = 0;
        this.nextQuestion();
        if (this.counter != this.loQuestion) {
          this.mover();
        }
      }, 4000);
      // --------------------------------------------------------
     
      // --------------------------------------------------------
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
    showInformation() {
      this.sound.pause();
      this.sound.currentTime = 0;
      clearInterval(this.setInterval);
      this.screenClick = 0;
      this.popupOpened = true;
      this.posts[0].hint
        ? [
            (this.hint.src = "audio/hint.mp3"),
            this.hint.play(),
            this.sound.pause(),
          ]
        : "";
    },
    closePopup() {
      this.popupOpened = false;
      this.posts[0].hint
        ? [(this.hint.src = "audio/hint.mp3"), this.hint.pause()]
        : "";
      if (this.firstQ == 1) {
        this.moverStart();
        this.posts[0].startTime = this.getDate();
        this.posts[0].items[0].startTime = this.posts[0].startTime;
        penguinCharacter.playSegments([0, 50], true);
        this.firstQ += 1;
      } else {
        this.sound.play();
        this.soundPlay();
        this.hint.pause();
        this.hint.currentTime = 0;
      }
    },
    setclick() {
      this.hint.pause();
      // this.sound.pause();
      this.hint.currentTime = 0;
      // this.sound.currentTime = 0;
      this.screenClick = 0;
    },
    soundPlay() {
      this.sec = this.sound.duration + 25;
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
