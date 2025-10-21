let soltan = document.querySelector("#Soltan");
let pageUrl = soltan.getAttribute("data-urlpage");
import { checkAnswer, showChooseAnswer, showTrueAnswer } from "./choose.js";
import { getStrings } from "./data.js";
import { chooseWord, checkChoose, showAnswerPun } from "./punctuate.js";
import { SelectText, CheckText } from "./select.js";
import { loadAnimations } from "./animation.js";

new Vue({
  el: "#Soltan",
  data: {
    posts: [],
    images: {
      doors: [
        {
          choose: {
            bgRoom: "",
            popUp: "",
            Paragraph: "",
            question: "",
            answer: "",
          },
          tureFalse: {
            bgRoom: "",
            popUp: "",
            Paragraph: "",
            question: "",
            answer: "",
          },
          selectText: {
            bgRoom: "",
            popUp: "",
            Paragraph: "",
            question: "",
          },
          punctuate: {
            bgRoom: "",
            popUp: "",
            Paragraph: "",
            question: "",
          },
        },
      ],
    },
    bgMusic: true,
    bgAudio: new Audio(),
    startLo: false,
    shadow: false,
    activeDoor: null,
    clickDoorAudio: new Audio(),
    doorAudio: new Audio(),
    doorOpened: [false, false, false],
    popupIcon: true,
    passageMusic: true,
    passage1Audio: new Audio(),
    passage2Audio: new Audio(),
    passage0Audio: new Audio(),
    questionAudio: new Audio(),
    starAudio: new Audio(),
    bgRoom: [],
    popUp: [],
    Paragraph: [],
    question: [],
    counterPopup: 0,
    solvedQuestion: false,
    CounterDoor: [1, 1, 1],
    CounterSolvedDoor: [0, 0, 0],
    numAllQuestionDoor: 0,
    chooseNumber: 0,
    tureFalseNumber: 0,
    selectWordNumber: 0,
    punctuateNumber: 0,
    shuffledWrogWords: null,
    shuffledCorrectWords: null,
    startQuestion: [false, false, false],
    counter: 1,
    studentAnswer: [],
    studentAnswerPunctuate: [[], [], []],
    counterOpenDoor: [0, 0, 0],
    correctWords: [],
    clickText: "",
    wrogWordsSelect: "",
    wrogWords: [],
    realWordWrong: null,
    rangeSele: null,

    readText: "",
    questionHintText: "",
    showreadText: false,
    showPOpUpText: false,
    wrongAudio: new Audio(),
    correctAudio: new Audio(),
    aduioListener: null,
    iphoneDevice: false,
    showSelected: false,
    selectionTextq: "",
    removeSelectDone: false,
    showAnswerSelect: false,
    showSelectAudio: new Audio(),
    readAudio: new Audio(),
    showCorrectText: false,
    showWrongText: false,
    wordsPunctuate: "",
    allSolvedStyle: [[], [], []],
    solvedStyle: [],
    indexChoose: null,
    showChoosesPunctuate: false,
    choosesPunctuate: [],
    wrongWord: null,
    counterAnswerPun: [0, 0, 0],
    numOfWrongWord: [0, 0, 0],
    questionHintTitle: [],
    questionHintTitleShow: false,
    showPOpUpTextInside: false,
    countSelectWordPun: [0, 0, 0],
    statusesLeftDoor: [],
    statusesCenterDoor: [],
    statusesRightDoor: [],
    dimmedStatus: 0,
    openStatus: 1,
    falseStatus: 2,
    trueStatus: 3,
    statusestDoor: [],
    counterProgressDoor: [0, 0, 0],
    countDown: 0,
    timeoutId: null,
    hint: false,
    questionHint: false,
    lampAudio: new Audio(),
    helpAudio: new Audio(),
    counterHint: [[1, 1, 1, 2], [1, 1, 1, 2], [1, 1, 1, 2], []],
    typeQuestion: null,
    hintQuestionAudio: new Audio(),
    screenClick: 0,
    checkStates: [[], [], []],
    hintWorg: "",
    setInterval: null,
    warningAudio: new Audio(),
    wrongPun: new Audio(),
    instractions: [],
    instructionDev: null,
    instractionsActive: null,
    instractionsView: true,
    pageSize: 7,
    currentPage: 1,
    soundDoorPlay: true,
    currentQuestion: null,
    pointsDoors: [0, 0, 0],
    answerAllQuestion: [false, false, false],
    counterClac: [0, 0, 0],
    animations: null,
    timerQuestionDoor: [null, null, null],
    // --------------------------------------------------------
    isLoading: false,
    isSuccess: false,
    activityId: 0,
    dataLoaded: false,
    currentdate: "",
    date: null,
    // --------------------------------------------------------
  },
  async create() {},
  async mounted() {
    this.animations = loadAnimations();
    await this.reSize();
    await this.getData();
    this.posts[0].numberOfquestion = 0;
    this.posts[0].LOcorrectcounter = 0;
    this.getvalues();
    this.getJsonImages();
  },
  methods: {
    getData: async function () {
      if (direction == "2") {
        await returnData.then((response) => {
          this.isSuccess = response.isSuccess;
          this.data = response.value;
          this.activityId = this.data.activityId;
          if (
            this.data.learningObjectAsJson != "" &&
            this.data.learningObjectAsJson != null
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);
            this.posts[0] = jsonData;
          }
          // console.log(this.data);
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
      await fetch(pageUrl + ".json")
        .then((res) => res.json())
        .then((data) => {
          this.localPosts = data;
        });
      if (this.posts.length == 0) {
        this.posts = this.localPosts;
      } else {
        this.posts[0].doors = this.localPosts[0].doors;
      }
      this.posts.length != 0
        ? setTimeout(() => {
            this.isLoading = true;
          }, 1000)
        : (this.isLoading = false);
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
    reSize: async function () {
      if (window.innerHeight >= window.innerWidth) {
        document.getElementById("Soltan").classList.add("resize");
        var div = document.getElementsByClassName("langing");
        div[0].classList.add("resize");
      }
      if (/iPhone|iPad|iPod|webOS/i.test(navigator.userAgent)) {
        this.iphoneDevice = true;
      } else {
        this.iphoneDevice = false;
      }
    },
    startButton() {
      this.calculateApi();
      if (direction == "2") {
        this.posts[0].title = this.data.title;
        this.activityId = this.data.activityId;
        this.posts[0].bloomLevels = this.data.bloomLevels;
        this.posts[0].learningObjectives = this.data.learningObjectives;
        this.posts[0].loDegree = this.data.loDegree;
        this.posts[0].keywords = this.data.keywords;
        this.posts[0].type = this.data.type;
        this.posts[0].unitId = this.data.unitId;
      }
      this.getNumberOfAllDoor();
      if (this.bgMusic) {
        this.bgAudio.volume = 0.02;
        this.bgAudio.play();
        this.bgAudio.loop = true;
      }
      this.startLo = true;
      this.posts[0].startTime = this.getDate();
    },
    getDoor(id) {
      this.instructionDev.classList.add("poniterEvent");
      this.solvedQuestion = this.answerAllQuestion[id];

      var div = document.getElementsByClassName("langing");
      div[0].classList.add("poniterEvent");
      this.clickDoorAudio.pause();
      this.animations.doorInHome.playSegments([0, 1], true);
      this.animations.characterInside.playSegments([0, 50], true);
      this.animations.characterInside.loop = true;
      if (!this.doorOpened[id]) {
        setTimeout(() => {
          this.doorAudio.play();
        }, 500);
        this.doorOpened[id] = true;
      }
      id == 0
        ? [
            this.animations.door0.playSegments([0, 0]),
            (this.animations.door0.loop = false),
          ]
        : id == 1
        ? [
            this.animations.door1.playSegments([0, 0]),
            (this.animations.door1.loop = false),
          ]
        : id == 2
        ? [
            this.animations.door2.playSegments([0, 0]),
            (this.animations.door2.loop = false),
          ]
        : "";
      setTimeout(() => {
        id == 0
          ? this.animations.soltanDoor.playSegments([60, 100], true)
          : id == 1
          ? this.animations.soltanDoor.playSegments([100, 145], true)
          : id == 2
          ? this.animations.soltanDoor.playSegments([150, 200], true)
          : "";
      }, 2000);
      setTimeout(() => {
        this.shadow = true;
      }, 2500);
      setTimeout(() => {
        this.shadow = false;
      }, 4500);
      this.animations.soltanDoor.loop = false;
      setTimeout(() => {
        this.activeDoor = id;
        this.counterOpenDoor[this.activeDoor] += 1;
        setTimeout(() => {
          this.getPopup();
        }, 1000);
        this.getNumberofQuestion();
        this.getEnvroinmentChoose();
        this.typePun();
      }, 3000);
    },
    getPopup() {
      this.clickDoorAudio.pause();
      this.clickDoorAudio.currentTime = 0;
      if (!this.solvedQuestion) {
        this.showreadText = true;
        this.showPOpUpText = true;
        this.readAudio.play();
        this.animations.characterInside.playSegments([101, 150], true);
        var mythis = this;
        this.aduioListener = function () {
          mythis.resetSoltan();
          mythis.readAudio.removeEventListener("ended", mythis.aduioListener);
          mythis.aduioListener = null;
        };
        this.readAudio.addEventListener("ended", this.aduioListener);
      }
    },
    getJsonImages() {
      fetch(
        "../../../lib-native/madinet_elma3refa-parag/assets/json/images.json"
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => (this.images = data))
        .catch((error) => console.error("Unable to fetch data:", error));
    },
    getvalues() {
      let strings = getStrings();
      this.correctWords = strings.correctWords;
      this.clickText = strings.clickText;
      this.wrogWordsSelect = strings.wrogWordsSelect;
      this.wrogWords = strings.wrogWords;
      this.readText = strings.readText;
      this.questionHintTitle = strings.questionHintTitle;
      this.instractions = strings.instractions;

      this.getSlideInst();
      this.bgRoom = document.getElementsByClassName("container");
      this.popUp = document.getElementsByClassName("popUp");
      this.Paragraph = document.getElementsByClassName("room");
      // this.showSelectButton = document.getElementsByClassName("showSelect");
      this.instructionDev = document.getElementById("instruction");
      this.clickDoorAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/clickdoor.mp3";
      this.doorAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/door.mp3";
      this.bgAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/music.mp3";
      this.passage0Audio.src = "./sound/door0/passage.mp3";
      this.passage1Audio.src = "./sound/door1/passage.mp3";
      this.passage2Audio.src = "./sound/door2/passage.mp3";
      this.readAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/read.mp3";
      this.lampAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/lamp.mp3";
      this.helpAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/help.mp3";
      this.warningAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/warning.mp3";
      this.starAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/star.mp3";
      this.wrongPun.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/error.mp3";

      this.statusesLeftDoor = Array(10).fill(this.dimmedStatus);
      this.statusesCenterDoor = Array(10).fill(this.dimmedStatus);
      this.statusesRightDoor = Array(10).fill(this.dimmedStatus);
      this.statusestDoor = [
        this.statusesLeftDoor,
        this.statusesCenterDoor,
        this.statusesRightDoor,
      ];
    },
    muteMusic() {
      this.bgMusic = !this.bgMusic;
      if (this.bgMusic) {
        this.bgAudio.play();
        this.bgAudio.loop = true;
      } else {
        this.bgAudio.pause();
      }
    },
    TogglePopup(question) {
      this.hint
        ? [
            this.resetSoltan(),
            (this.hint = true),
            this.animations.characterInside.playSegments([51, 100], true),
          ]
        : this.resetSoltan();
      this.popupIcon = !this.popupIcon;
      if (this.popupIcon) {
        this.passageMusic = true;
        this.Paragraph[0].style.display = `none`;
        this.popUp = document.getElementsByClassName("popUp");
        this.popUp[0].style.backgroundImage = `url('${
          this.images.doors[this.activeDoor].choose.popUp
        }')`;
        this.popUp[0].style.display = `flex`;
        this.stopCountDown();
      } else {
        this.hint
          ? [
              this.resetSoltan(),
              (this.hint = true),
              this.animations.characterInside.playSegments([51, 100], true),
            ]
          : this.resetSoltan();
        this.Paragraph[0].style.display = `flex`;
        this.popUp[0].style.display = `none`;
        this.countDownTimer(this.typeQuestion, question);
      }
    },
    home() {
      this.selectionTextq = "";
      this[`${"passage" + this.activeDoor + "Audio"}`].pause();
      this[`${"passage" + this.activeDoor + "Audio"}`].currentTime = 0;
      this.passageMusic = true;
      this.showAnswerSelect = false;
      var div = document.getElementsByClassName("langing");
      div[0].classList.remove("poniterEvent");
      this.counterPopup = 0;
      this.resetSoltan();
      if (this.answerAllQuestion[this.activeDoor]) {
        this.counterClac[this.activeDoor] == 0
          ? [this.calculateProgress(), (this.counterClac[this.activeDoor] += 1)]
          : "";
      }
      this.activeDoor = null;
      this.bgRoom[0].style.display = `none`;
      this.popUp[0].style.display = `none`;
      this.Paragraph[0].style.display = `none`;
      this.animations.soltanDoor.playSegments([0, 60], true);
      this.animations.soltanDoor.loop = true;
      this.stopCountDown();
      clearInterval(this.setInterval);
      this.counter = 1;
      this.CounterSolvedDoor = [0, 0, 0];
      this.selectionTextq = "";
      this.removeSelectDone = false;
      this.solvedStyle = [];
    },
    PopupDone() {
      this.resetSoltan();
      this.popupIcon = !this.popupIcon;
      this.popUp[0].style.display = `none`;
      this.nextQuestionLO(false);
      this.counterPopup += 1;
      this[`${"passage" + this.activeDoor + "Audio"}`].pause();
      this[`${"passage" + this.activeDoor + "Audio"}`].currentTime = 0;
    },
    playPassageMusic() {
      this.passageMusic = !this.passageMusic;
      if (this.passageMusic) {
        this[`${"passage" + this.activeDoor + "Audio"}`].pause();
      } else {
        this.resetSoltan();
        this[`${"passage" + this.activeDoor + "Audio"}`].play();
        var mythis = this;
        this.aduioListener = function () {
          mythis.passageMusic = true;
          mythis.aduioListener = null;
        };
        this[`${"passage" + this.activeDoor + "Audio"}`].addEventListener(
          "ended",
          this.aduioListener
        );
      }
    },
    stopPassageMusic() {
      this[`${"passage" + this.activeDoor + "Audio"}`].pause();
      this[`${"passage" + this.activeDoor + "Audio"}`].currentTime = 0;
      this.passageMusic = true;
    },
    getEnvroinmentChoose() {
      this.bgRoom[0].style.backgroundImage = `url('${
        this.images.doors[this.activeDoor].choose.bgRoom
      }')`;
      this.bgRoom[0].style.display = `flex`;
      this.popUp[0].style.backgroundImage = `url('${
        this.images.doors[this.activeDoor].choose.popUp
      }')`;
      this.popUp[0].style.display = `flex`;
    },
    getNumberofQuestion() {
      this.chooseNumber =
        this.posts[0].doors[this.activeDoor].choose.questions.length;
      this.tureFalseNumber =
        this.posts[0].doors[this.activeDoor].tureFalse.questions.length;
      this.selectWordNumber =
        this.posts[0].doors[this.activeDoor].selectText.questions.length;
      this.punctuateNumber =
        this.posts[0].doors[this.activeDoor].punctuate.questions.length;
      this.numAllQuestionDoor =
        this.chooseNumber +
        this.tureFalseNumber +
        this.selectWordNumber +
        this.punctuateNumber * 4;
    },
    nextQuestionLO(fly) {
      this.showAnswerSelect = false;
      if (
        this.CounterDoor[this.activeDoor] == 1 &&
        !this.solvedQuestion &&
        this.counterOpenDoor[this.activeDoor] == 1
      ) {
        this.setProgress(this.openStatus);
      }
      if (!this.solvedQuestion) {
        this.startQuestion[this.activeDoor] = true;
        this.shuffledCorrectWords = this.shuffleWords(this.correctWords);
        this.shuffledWrogWords = this.shuffleWords(this.wrogWords);
        console.log(this.shuffledWrogWords);
        this.Paragraph[0].classList.remove("poniterEvent");
        //choose
        if (this.CounterDoor[this.activeDoor] <= this.chooseNumber) {
          let currentQuestionIndex = this.CounterDoor[this.activeDoor] - 1;
          let currentQuestion =
            this.posts[0].doors[this.activeDoor].choose.questions[
              currentQuestionIndex
            ];
          this.currentQuestion = currentQuestion;

          if (this.CounterDoor[this.activeDoor] == 1) {
            this.getTitle(1);
          }
          this.getActive(currentQuestion, 1);
        }
        //truefalse
        else if (
          this.CounterDoor[this.activeDoor] <=
          this.chooseNumber + this.tureFalseNumber
        ) {
          let currentQuestionIndex =
            this.CounterDoor[this.activeDoor] - 1 - this.chooseNumber;
          let currentQuestion =
            this.posts[0].doors[this.activeDoor].tureFalse.questions[
              currentQuestionIndex
            ];
          this.currentQuestion = currentQuestion;
          let isMatch =
            this.CounterDoor[this.activeDoor] === this.chooseNumber + 1;
          if (isMatch && fly) {
            this.flyCharacter(currentQuestion, 2);
          } else {
            this.getActive(currentQuestion, 2);
          }
          //select
        } else if (
          this.CounterDoor[this.activeDoor] <=
          this.chooseNumber + this.tureFalseNumber + this.selectWordNumber
        ) {
          let currentQuestionIndex =
            this.CounterDoor[this.activeDoor] -
            1 -
            this.chooseNumber -
            this.tureFalseNumber;
          let currentQuestion =
            this.posts[0].doors[this.activeDoor].selectText.questions[
              currentQuestionIndex
            ];
          this.currentQuestion = currentQuestion;
          let isMatch =
            this.CounterDoor[this.activeDoor] ===
            this.chooseNumber + this.tureFalseNumber + 1;
          if (isMatch && fly) {
            this.flyCharacter(currentQuestion, 3);
          } else {
            this.getActive(currentQuestion, 3);
          }
        } else if (
          this.CounterDoor[this.activeDoor] <=
          this.chooseNumber +
            this.tureFalseNumber +
            this.selectWordNumber +
            this.punctuateNumber
        ) {
          this.solvedStyle = this.allSolvedStyle[this.activeDoor];
          let currentQuestionIndex =
            this.CounterDoor[this.activeDoor] -
            1 -
            this.chooseNumber -
            this.tureFalseNumber -
            this.selectWordNumber;
          let currentQuestion =
            this.posts[0].doors[this.activeDoor].punctuate.questions[
              currentQuestionIndex
            ];
          this.currentQuestion = currentQuestion;

          this.numOfWrongWord[this.activeDoor] =
            this.posts[0].doors[this.activeDoor].punctuate.questions[
              this.CounterDoor[this.activeDoor] -
                1 -
                this.chooseNumber -
                this.tureFalseNumber -
                this.selectWordNumber
            ].wrongWord.length;

          let isMatch =
            this.CounterDoor[this.activeDoor] ===
            this.chooseNumber +
              this.tureFalseNumber +
              this.selectWordNumber +
              1;
          if (isMatch && fly) {
            this.flyCharacter(currentQuestion, 4);
          } else {
            this.getActive(currentQuestion, 4);
          }
        } else {
          this.flyCharacterToHome();
        }
      } else {
        this.nextQuestionSolved();
      }
    },
    nextQuestionSolved() {
      this.CounterSolvedDoor[this.activeDoor] = this.counter;
      this.Paragraph[0].classList.add("poniterEvent");
      if (this.CounterSolvedDoor[this.activeDoor] <= this.chooseNumber) {
        let currentQuestionIndex = this.CounterSolvedDoor[this.activeDoor] - 1;
        let currentQuestion =
          this.posts[0].doors[this.activeDoor].choose.questions[
            currentQuestionIndex
          ];
        console.log(currentQuestion);
        this.currentQuestion = currentQuestion;
        this.getActive(currentQuestion, 1);
      }
      //truefalse
      else if (
        this.CounterSolvedDoor[this.activeDoor] <=
        this.chooseNumber + this.tureFalseNumber
      ) {
        let currentQuestionIndex =
          this.CounterSolvedDoor[this.activeDoor] - 1 - this.chooseNumber;
        let currentQuestion =
          this.posts[0].doors[this.activeDoor].tureFalse.questions[
            currentQuestionIndex
          ];
        this.currentQuestion = currentQuestion;
        this.getActive(currentQuestion, 2);

        //select
      } else if (
        this.CounterSolvedDoor[this.activeDoor] <=
        this.chooseNumber + this.tureFalseNumber + this.selectWordNumber
      ) {
        let currentQuestionIndex =
          this.CounterSolvedDoor[this.activeDoor] -
          1 -
          this.chooseNumber -
          this.tureFalseNumber;
        let currentQuestion =
          this.posts[0].doors[this.activeDoor].selectText.questions[
            currentQuestionIndex
          ];
        this.currentQuestion = currentQuestion;
        this.getActive(currentQuestion, 3);
      } else if (
        this.CounterSolvedDoor[this.activeDoor] <=
        this.chooseNumber +
          this.tureFalseNumber +
          this.selectWordNumber +
          this.punctuateNumber
      ) {
        let currentQuestionIndex =
          this.CounterSolvedDoor[this.activeDoor] -
          1 -
          this.chooseNumber -
          this.tureFalseNumber -
          this.selectWordNumber;
        let currentQuestion =
          this.posts[0].doors[this.activeDoor].punctuate.questions[
            currentQuestionIndex
          ];
        this.currentQuestion = currentQuestion;

        this.numOfWrongWord[this.activeDoor] =
          this.posts[0].doors[this.activeDoor].punctuate.questions[
            this.CounterSolvedDoor[this.activeDoor] -
              1 -
              this.chooseNumber -
              this.tureFalseNumber -
              this.selectWordNumber
          ].wrongWord.length;
        this.getPunAnswerStudent();
        this.getActive(currentQuestion, 4);
      }
    },

    getImages(type) {
      if (this.activeDoor != null) {
        if (type == 1) {
          this.bgRoom[0].style.backgroundImage = `url('${
            this.images.doors[this.activeDoor].choose.bgRoom
          }')`;
          this.bgRoom[0].style.display = `flex`;
          this.Paragraph[0].style.backgroundImage = `url('${
            this.images.doors[this.activeDoor].choose.Paragraph
          }')`;
          this.Paragraph[0].style.display = `flex`;
          this.question = document.getElementsByClassName("questionChoose");
          for (let i = 0; i < this.question.length; i++) {
            this.question[i].style.backgroundImage = `url('${
              this.images.doors[this.activeDoor].choose.question
            }')`;
          }
          this.answer = document.getElementsByClassName("answersChoose");
          for (let i = 0; i < this.answer.length; i++) {
            this.answer[i].style.backgroundImage = `url('${
              this.images.doors[this.activeDoor].choose.answer
            }')`;
          }
        } else if (type == 2) {
          this.bgRoom[0].style.backgroundImage = `url('${
            this.images.doors[this.activeDoor].tureFalse.bgRoom
          }')`;
          this.bgRoom[0].style.display = `flex`;
          this.Paragraph[0].style.backgroundImage = `url('${
            this.images.doors[this.activeDoor].tureFalse.Paragraph
          }')`;
          this.Paragraph[0].style.display = `flex`;
          this.question = document.getElementsByClassName("questionTrueFalse");
          for (let i = 0; i < this.question.length; i++) {
            this.question[i].style.backgroundImage = `url('${
              this.images.doors[this.activeDoor].tureFalse.question
            }')`;
          }
          this.answer = document.getElementsByClassName("answersTrueFalse");
          for (let i = 0; i < this.answer.length; i++) {
            this.answer[i].style.backgroundImage = `url('${
              this.images.doors[this.activeDoor].tureFalse.answer
            }')`;
          }
        } else if (type == 3) {
          this.bgRoom[0].style.backgroundImage = `url('${
            this.images.doors[this.activeDoor].selectText.bgRoom
          }')`;
          this.bgRoom[0].style.display = `flex`;
          this.Paragraph[0].style.backgroundImage = `url('${
            this.images.doors[this.activeDoor].selectText.Paragraph
          }')`;
          this.Paragraph[0].style.display = `flex`;
          this.question = document.getElementsByClassName("questionSelect");
          for (let i = 0; i < this.question.length; i++) {
            this.question[i].style.backgroundImage = `url('${
              this.images.doors[this.activeDoor].selectText.question
            }')`;
          }
        } else if (type == 4) {
          this.bgRoom[0].style.backgroundImage = `url('${
            this.images.doors[this.activeDoor].punctuate.bgRoom
          }')`;
          this.bgRoom[0].style.display = `flex`;
          this.Paragraph[0].style.backgroundImage = `url('${
            this.images.doors[this.activeDoor].punctuate.Paragraph
          }')`;
          this.Paragraph[0].style.display = `flex`;
        }
      }
    },
    checkChoose(event, answer, question) {
      this.timerQuestionDoor[this.activeDoor] = null;
      this.resetSoltan();
      this.stopCountDown();
      let correct = document.querySelectorAll(".active .answersChoose.correct");
      let answers = document.querySelectorAll(".active .answersChoose");
      let result = checkAnswer(event, answer, answers, correct);
      let studentAnswer = result.success;
      answers = result.answers;
      correct = result.correct;
      question.endTime = this.getDate();
      if (studentAnswer) {
        this.successAnswer();
      } else {
        question.numberOfTrial += 1;
        this.wrongAnswer();
      }
      this.instructionDev.classList.add("poniterEvent");
      this.Paragraph[0].classList.add("poniterEvent");
    },
    checkTrueFalse(event, answer, question) {
      this.timerQuestionDoor[this.activeDoor] = null;
      this.resetSoltan();
      this.stopCountDown();
      let answers = document.querySelectorAll(".active .answersTrueFalse");
      let correct = document.querySelectorAll(
        ".active .answersTrueFalse.correct"
      );
      let result = checkAnswer(event, answer, answers, correct);

      let studentAnswer = result.success;
      answers = result.answers;
      correct = result.correct;
      question.endTime = this.getDate();
      if (studentAnswer) {
        this.successAnswer();
      } else {
        question.numberOfTrial += 1;
        this.wrongAnswer();
      }
      this.instructionDev.classList.add("poniterEvent");
      this.Paragraph[0].classList.add("poniterEvent");
    },
    successAnswer() {
      this.soundTrue();
      console.log("true");
      this.CounterDoor[this.activeDoor] += 1;
      var mythis = this;
      var aduioListener = function () {
        mythis.resetSoltan();
        mythis.nextQuestionLO(true);
        console.log("end sound true");
        mythis.correctAudio.removeEventListener("ended", aduioListener);
        aduioListener = null;
      };
      this.correctAudio.addEventListener("ended", aduioListener);
    },
    wrongAnswer() {
      this.soundFalse();
      console.log("false");
      this.CounterDoor[this.activeDoor] += 1;
      console.log(this.CounterDoor[this.activeDoor]);
      console.log(this.activeDoor);

      var mythis = this;
      var aduioListener = function () {
        mythis.resetSoltan();
        mythis.nextQuestionLO(true);
        console.log("end sound false");
        mythis.wrongAudio.removeEventListener("ended", aduioListener);
        aduioListener = null;
      };
      this.wrongAudio.addEventListener("ended", aduioListener);
    },
    wrongAnswerSelect() {
      this.setProgress(this.falseStatus);
      this.UpdateStudentActivity();
      this.realWordWrong = this.shuffledWrogWords[0].text;
      this.shuffledWrogWords[0].text = this.wrogWordsSelect;
      this.wrongAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/feedbackwrong/select.mp3";
      this.wrongAudio.play();
      this.animations.characterInside.playSegments([101, 150], true);
      this.showPOpUpText = true;
      this.showWrongText = true;
      this.CounterDoor[this.activeDoor] += 1;
      var mythis = this;
      var aduioListener = function () {
        mythis.showAnswerSelect = true;
        mythis.showSelectAudio.src =
          "../../../lib-native/madinet_elma3refa-parag/assets/audio/lampSelect.mp3";
        mythis.showSelectAudio.play();
        mythis.resetSoltan();
        mythis.wrongAudio.removeEventListener("ended", mythis.aduioListener);
        mythis.aduioListener = null;
      };
      this.wrongAudio.addEventListener("ended", aduioListener);
    },
    soundTrue() {
      this.posts[0].LOcorrectcounter += 1;
      this.pointsDoors[this.activeDoor] += 1;
      this.UpdateStudentActivity();
      this.setProgress(this.trueStatus);
      this.correctAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/feedbackcorrect/0" +
        this.shuffledCorrectWords[0].type +
        ".mp3";
      this.correctAudio.play();
      this.animations.characterInside.playSegments([101, 150], true);
      this.showPOpUpText = true;
      this.showCorrectText = true;
    },
    soundFalse() {
      this.setProgress(this.falseStatus);
      this.UpdateStudentActivity();
      this.wrongAudio.src =
        "../../../lib-native/madinet_elma3refa-parag/assets/audio/feedbackwrong/0" +
        this.shuffledWrogWords[0].type +
        ".mp3";
      this.wrongAudio.play();
      this.animations.characterInside.playSegments([101, 150], true);
      this.showPOpUpText = true;
      this.showWrongText = true;
    },
    shuffleWords(words) {
      let allWords = [...words];
      let first,
        second,
        temp,
        count = allWords.length;
      for (let i = 0; i <= words.length; i++) {
        first = Math.floor(Math.random() * count);
        second = Math.floor(Math.random() * count);
        temp = allWords[first];
        allWords[first] = allWords[second];
        allWords[second] = temp;
      }
      return allWords;
    },
    removeActive() {
      if (this.activeDoor != null) {
        this.posts[0].doors[this.activeDoor].choose.questions.forEach(
          (element) => {
            element.active = false;
          }
        );
        this.posts[0].doors[this.activeDoor].tureFalse.questions.forEach(
          (element) => {
            element.active = false;
          }
        );
        this.posts[0].doors[this.activeDoor].selectText.questions.forEach(
          (element) => {
            element.active = false;
          }
        );
        this.posts[0].doors[this.activeDoor].punctuate.questions.forEach(
          (element) => {
            element.active = false;
          }
        );
      }
    },
    //select

    SelectedText(question) {
      this.resetSoltan();
      this.rangeSele = null;
      setTimeout(() => {
        const selection = window.getSelection();
        this.selectionTextq = selection.toString();
        if (this.iphoneDevice) {
          this.spanSelectedText = document.createElement("span");
          console.log(this.selectionTextq);
          if (selection.rangeCount > 0 && this.selectionTextq) {
            this.rangeSele = selection.getRangeAt(0);
            const rangeText = this.rangeSele.toString();
            this.selectionTextq = rangeText;
          }
          question.selectionText = this.selectionTextq.trim();
        }
        this.removeSelectDone = true;
      }, 100);
      if (this.selectionTextq != "") {
        this.removeSelectDone = true;
      }
    },
    CheckSelect(question) {
      this.timerQuestionDoor[this.activeDoor] = null;
      question.endTime = this.getDate();
      this.stopCountDown();
      this.resetSoltan();
      let studentAnswer = this.CheckSelectAnswer(question);

      if (studentAnswer) {
        this.successAnswer();
      } else {
        question.numberOfTrial += 1;
        this.wrongAnswerSelect();
      }
      this.removeSelectDone = false;
      this.selectionTextq = "";
      this.instructionDev.classList.add("poniterEvent");
      this.Paragraph[0].classList.add("poniterEvent");
    },
    CheckSelectAnswer(question) {
      let passage = document.querySelectorAll(".active .passage");
      passage.forEach((el) => {
        el.classList.add("poniterEvent");
      });
      let success = false;
      if (!this.iphoneDevice) {
        const selection = window.getSelection();
        this.selectionTextq = selection.toString();
        this.spanSelectedText = document.createElement("span");
        console.log(this.selectionTextq);
        if (selection.rangeCount > 0 && this.selectionTextq) {
          this.rangeSele = selection.getRangeAt(0);
          const rangeText = this.rangeSele.toString();
          this.selectionTextq = rangeText;
        }
        question.selectionText = this.selectionTextq.trim();
      }
      if (this.selectionTextq != "") {
        let loop = true;
        question.correctAnswer.forEach((text, index) => {
          if (loop) {
            if (
              this.selectionTextq.toString().trim() == text.toString().trim()
            ) {
              this.showCorrectText = true;
              this.spanSelectedText.className = "trueText";
              const extractedContents = this.rangeSele.extractContents();
              this.spanSelectedText.appendChild(extractedContents);
              this.rangeSele.insertNode(this.spanSelectedText);
              loop = false;
              success = true;
            } else if (
              this.selectionTextq.toString().trim() != text.toString().trim() &&
              index + 1 == question.correctAnswer.length
            ) {
              this.spanSelectedText.className = "falseText";
              const extractedContents = this.rangeSele.extractContents();
              this.spanSelectedText.appendChild(extractedContents);
              this.rangeSele.insertNode(this.spanSelectedText);
              success = false;
            }
          }
        });
      }
      return success;
    },
    showSelect() {
      this.resetSoltan();
      this.showSelected = true;
      this.showAnswerSelect = false;
      this.nextQuestionAfterShowSelect();
    },
    removeSelect() {
      window.getSelection().removeAllRanges();
      this.selectionTextq = "";
    },
    nextQuestionAfterShowSelect() {
      setTimeout(() => {
        this.shuffledWrogWords[0].text = this.realWordWrong;
        this.nextQuestionLO(true);
      }, 1000);
    },
    //punctuate
    SelectWord(index, word, question) {
      this.resetSoltan();
      this.stopCountDown();
      this.countDownTimer(4, question);
      let result = chooseWord(index, word, question, this.wordsPunctuate);
      let studentAnswer = result.success;
      this.indexChoose = result.indexChoose;
      this.showChoosesPunctuate = result.showChoosesPunctuate;
      this.choosesPunctuate = result.choosesPunctuate;
      this.wrongWord = result.wrongWord;
      if (studentAnswer) {
        this.countSelectWordPun[this.activeDoor] += 1;
        if (this.countSelectWordPun[this.activeDoor] == 1) {
          this.getTitle(5);
        }
      } else {
        this.wrongPun.play();
      }
    },
    typePun() {
      if (this.CounterDoor[this.activeDoor] == 1) {
        if (this.posts[0].typeLo == 1) {
          this.studentAnswerPunctuate[this.activeDoor] =
            this.posts[0].doors[
              this.activeDoor
            ].punctuate.questions[0].sentence.split(" ");
        } else {
          this.studentAnswerPunctuate[this.activeDoor] =
            this.posts[0].doors[
              this.activeDoor
            ].punctuate.questions[0].sentence.match(/<[^>]+>|[^<\s]+/g);
          const combined = [];
          this.studentAnswerPunctuate[this.activeDoor].forEach(
            (item, index) => {
              if (item.startsWith("<span")) {
                combined.push(
                  item + this.studentAnswerPunctuate[this.activeDoor][index + 1]
                );
              } else if (item.startsWith("</span")) {
              } else {
                combined.push(item + " ");
              }
            }
          );
          this.studentAnswerPunctuate[this.activeDoor] = combined;
        }
      }
      this.wordsPunctuate = this.studentAnswerPunctuate[this.activeDoor];
    },
    checkPunctuate(event, choose, question) {
      question.endTime = this.getDate();
      this.resetSoltan();
      this.counterAnswerPun[this.activeDoor] += 1;
      console.log(this.counterAnswerPun[this.activeDoor]);
      let result = checkChoose(
        event,
        choose,
        question,
        this.wordsPunctuate,
        this.wrongWord,
        this.indexChoose,
        this.solvedStyle
      );
      this.studentAnswerPunctuate[this.activeDoor] = result.wordsPunctuate;
      this.wordsPunctuate = this.studentAnswerPunctuate[this.activeDoor];
      let studentAnswer = result.success;
      this.allSolvedStyle[this.activeDoor] = result.solvedStyle;
      this.solvedStyle = result.solvedStyle;
      console.log(this.solvedStyle);
      if (
        studentAnswer &&
        this.counterAnswerPun[this.activeDoor] !=
          this.numOfWrongWord[this.activeDoor]
      ) {
        this.soundTrue();
        var mythis = this;
        this.aduioListener = function () {
          mythis.resetSoltan();
          mythis.correctAudio.removeEventListener(
            "ended",
            mythis.aduioListener
          );
          mythis.aduioListener = null;
        };
        this.correctAudio.addEventListener("ended", this.aduioListener);
      } else if (
        !studentAnswer &&
        this.counterAnswerPun[this.activeDoor] !=
          this.numOfWrongWord[this.activeDoor]
      ) {
        console.log("false not end");
        question.numberOfTrial += 1;
        this.soundFalse();
        var mythis = this;
        this.aduioListener = function () {
          mythis.resetSoltan();
          mythis.wrongAudio.removeEventListener("ended", mythis.aduioListener);
          mythis.aduioListener = null;
        };
        this.wrongAudio.addEventListener("ended", this.aduioListener);
      }
      if (
        this.counterAnswerPun[this.activeDoor] ==
        this.numOfWrongWord[this.activeDoor]
      ) {
        this.endDoorDone();

        studentAnswer
          ? [this.successAnswer(), console.log("true  end")]
          : [this.wrongAnswer(), console.log("false  end")];
      } else {
        this.setProgress(this.openStatus);
      }
    },
    endDoorDone() {
      this.timerQuestionDoor[this.activeDoor] = null;
      this.posts[0].endTime = this.getDate();
      this.answerAllQuestion[this.activeDoor] = true;
      clearInterval(this.setInterval);
      this.Paragraph[0].classList.add("poniterEvent");
      this.instructionDev.classList.add("poniterEvent");
      this.stopCountDown();
    },

    flyCharacter(currentQuestion, type) {
      setTimeout(() => {
        this.animations.characterInside.playSegments([151, 200], true);
        this.animations.doorInHome.playSegments([1, 26], true);
      }, 1000);
      setTimeout(() => {
        this.shadow = true;
      }, 2500);
      setTimeout(() => {
        this.getActive(currentQuestion, type);
        this.animations.doorInHome.playSegments([0, 1], true);
        this.animations.characterInside.playSegments([0, 50], true);
        this.getTitle(type);
      }, 3300);
      setTimeout(() => {
        this.shadow = false;
      }, 3800);
    },
    flyCharacterToHome() {
      setTimeout(() => {
        this.animations.characterInside.playSegments([151, 200], true);
        this.animations.doorInHome.playSegments([1, 26], true);
      }, 1000);
      setTimeout(() => {
        this.shadow = true;
      }, 2500);
      setTimeout(() => {
        this.removeActive();
        this.animations.doorInHome.playSegments([0, 1], true);
        this.animations.characterInside.playSegments([0, 50], true);
        this.home();
      }, 3300);
      setTimeout(() => {
        this.shadow = false;
      }, 3800);
    },
    resetSoltan() {
      if (!this.answerAllQuestion[this.activeDoor]) {
        this.animations.characterInside.playSegments([0, 50], true);
      }
      this.showreadText = false;
      this.showPOpUpText = false;
      this.showCorrectText = false;
      this.showWrongText = false;
      this.showWrongText = false;
      this.showPOpUpTextInside = false;
      this.questionHintTitleShow = false;
      this.readAudio.pause();
      this.readAudio.currentTime = 0;
      this.questionAudio.pause();
      this.questionAudio.currentTime = 0;
      this.lampAudio.pause();
      this.lampAudio.currentTime = 0;
      this.helpAudio.pause();
      this.helpAudio.currentTime = 0;
      this.hint = false;
      this.questionHint = false;
      this.hintQuestionAudio.pause();
      this.hintQuestionAudio.currentTime = 0;
      this.screenClick = 0;
      this.warningAudio.pause();
      this.warningAudio.currentTime = 0;
      this.clickDoorAudio.pause();
      this.clickDoorAudio.currentTime = 0;
      this.correctAudio.pause();
      this.correctAudio.currentTime = 0;
      this.wrongAudio.pause();
      this.wrongAudio.currentTime = 0;
      this.wrongPun.pause();
      this.wrongPun.currentTime = 0;
      this.showChoosesPunctuate = false;
    },
    getTitle(type) {
      setTimeout(() => {
        this.showPOpUpTextInside = true;
        this.questionHintTitleShow = true;
        this.questionHintText = this.questionHintTitle[type - 1];
        this.questionAudio.src =
          "../../../lib-native/madinet_elma3refa-parag/assets/audio/q/q" +
          type +
          ".mp3";
        this.questionAudio.play();
        this.animations.characterInside.playSegments([101, 150], true);
        var mythis = this;
        this.aduioListener = function () {
          mythis.resetSoltan();
          mythis.questionAudio.removeEventListener(
            "ended",
            mythis.aduioListener
          );
          mythis.aduioListener = null;
        };
        this.questionAudio.addEventListener("ended", this.aduioListener);
      }, 500);
    },
    setProgress(type) {
      console.log(type);
      console.log(this.counterProgressDoor);
      if (
        this.statusestDoor[this.activeDoor][
          this.counterProgressDoor[this.activeDoor] - 1
        ] != this.openStatus
      ) {
        type == this.openStatus
          ? (this.counterProgressDoor[this.activeDoor] += 1)
          : "";
      }
      this.statusestDoor[this.activeDoor][
        this.counterProgressDoor[this.activeDoor] - 1
      ] = type;
    },
    countDownTimer(type, currentQuestion) {
      if (!this.solvedQuestion) {
        if (this.countDown > 0) {
          this.timeoutId = setTimeout(() => {
            this.countDown -= 1;
            this.timerQuestionDoor[this.activeDoor] = this.countDown;
            this.countDownTimer(type, currentQuestion);
          }, 1000);
          if (
            this.countDown == 20 &&
            type != 4 &&
            this.counterHint[this.activeDoor][type - 1] != 0
          ) {
            this.getHintQuestion(type);
          } else if (this.countDown == 5) {
            this.warningAudio.volume = 0.5;
            this.warningAudio.play();
          }
        } else if (this.countDown == 0) {
          console.log("hi0");
          this.showComputerAnswers(type, currentQuestion);
          this.stopCountDown();
        }
      }
    },
    stopCountDown() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null; // Reset the timeout ID
      }
    },
    getActive(currentQuestion, type) {
      this.getImages(type);
      if (!this.solvedQuestion) {
        currentQuestion.startTime = this.getDate();
        this.typeQuestion = type;
        this.Paragraph[0].classList.remove("poniterEvent");
        this.instructionDev.classList.remove("poniterEvent");
        this.showSelected = false;
        if (this.CounterDoor[this.activeDoor] != 1 && !this.solvedQuestion) {
          this.setProgress(this.openStatus);
        }
        if (this.timerQuestionDoor[this.activeDoor] == null) {
          type != 4 ? (this.countDown = 30) : (this.countDown = 120);
        } else {
          this.countDown = this.timerQuestionDoor[this.activeDoor];
        }

        this.countDownTimer(type, currentQuestion);
        type == 4 ? this.displayHintPUn(type) : "";
      }
      this.removeActive();
      currentQuestion.active = true;
    },
    showComputerAnswers(type, currentQuestion) {
      this.timerQuestionDoor[this.activeDoor] = null;
      this.resetSoltan();
      let result;
      this.Paragraph[0].classList.add("poniterEvent");
      console.log(this.solvedStyle);
      type == 1
        ? showChooseAnswer()
        : type == 2
        ? showTrueAnswer()
        : type == 3
        ? (this.showSelected = true)
        : [
            (result = showAnswerPun(
              this.wordsPunctuate,
              currentQuestion,
              this.solvedStyle
            )),
            (this.wordsPunctuate = result.wordsPunctuate),
            (this.studentAnswerPunctuate[this.activeDoor] =
              result.wordsPunctuate),
            (this.allSolvedStyle[this.activeDoor] = result.solvedStyle),
            (this.solvedStyle = result.solvedStyle),
            this.endDoorDone(),
            this.setProgressTimerEnd(),
          ];
      this.UpdateStudentActivity();
      this.setProgress(this.falseStatus);
      setTimeout(() => {
        this.resetSoltan();
        this.CounterDoor[this.activeDoor] += 1;
        this.nextQuestionLO(true);
      }, 3000);
    },
    setProgressTimerEnd() {
      this.statusestDoor[this.activeDoor].forEach((el, index) => {
        console.log(el);
        el == this.dimmedStatus || el == this.openStatus
          ? [
              (el = this.falseStatus),
              (this.statusestDoor[this.activeDoor][index] = this.falseStatus),
            ]
          : "";
      });
    },
    getHintQuestion(type) {
      this.typeQuestion = type;
      this.questionHint = false;
      this.lampAudio.play();
      this.animations.characterInside.playSegments([51, 100], true);
      var mythis = this;
      this.aduioListener = function () {
        mythis.animations.characterInside.playSegments([201, 250], true);
        mythis.helpAudio.play();
        mythis.showPOpUpTextInside = true;
        mythis.hint = true;
        mythis.lampAudio.removeEventListener("ended", mythis.aduioListener);
        mythis.aduioListener = null;
      };
      this.lampAudio.addEventListener("ended", this.aduioListener);

      this.aduioListener = function () {
        mythis.showPOpUpTextInside = false;
        mythis.animations.characterInside.playSegments([51, 100], true);
        mythis.helpAudio.removeEventListener("ended", mythis.aduioListener);
        mythis.aduioListener = null;
      };
      this.helpAudio.addEventListener("ended", this.aduioListener);
    },
    getHint(question) {
      this.stopCountDown();
      this.counterHint[this.activeDoor][this.typeQuestion - 1] -= 1;
      this.resetSoltan();
      this.showPOpUpTextInside = true;
      this.questionHint = true;
      this.animations.characterInside.playSegments([101, 151], true);
      this.animations.characterInside.loop = true;
      this.hintQuestionAudio.src =
        "./sound/door" +
        this.activeDoor +
        "/0" +
        question.numberQuestion +
        ".mp3";
      this.hintQuestionAudio.play();
      var mythis = this;
      this.aduioListener = function () {
        mythis.resetSoltan();
        mythis.hintQuestionAudio.removeEventListener(
          "ended",
          mythis.aduioListener
        );
        mythis.aduioListener = null;
        mythis.countDownTimer(mythis.typeQuestion, question);
      };
      this.hintQuestionAudio.addEventListener("ended", this.aduioListener);
    },
    displayHintPUn(type) {
      this.setInterval = setInterval(() => {
        this.screenClick += 1;
        console.log(this.screenClick);
        if (
          this.screenClick == 20 &&
          this.counterHint[this.activeDoor][type - 1] != 0
        ) {
          this.screenClick = 0;
          this.getHintQuestion(type);
        }
      }, 1000);
    },
    getHintPun(question) {
      this.stopCountDown();
      let wrongWords = question.wrongWord;
      this.counterHint[this.activeDoor][this.typeQuestion - 1] -= 1;
      this.resetSoltan();
      this.showPOpUpTextInside = true;
      this.questionHint = true;
      this.animations.characterInside.playSegments([101, 151], true);
      this.animations.characterInside.loop = true;
      this.checkStates[this.activeDoor] = [false, false, false, false];
      wrongWords.forEach((word, index) => {
        if (word.chooses.some((choose) => choose.check)) {
          this.checkStates[this.activeDoor][index] = true;
        }
      });
      let firstWrongIndex = this.checkStates[this.activeDoor].findIndex(
        (checked) => !checked
      );
      if (firstWrongIndex !== -1) {
        this.hintWorg = question.hint[firstWrongIndex];
        this.hintQuestionAudio.src = `./sound/door${this.activeDoor}/0${
          7 + firstWrongIndex
        }.mp3`;
      }
      this.hintQuestionAudio.play();
      var mythis = this;
      this.aduioListener = function () {
        mythis.resetSoltan();
        mythis.hintQuestionAudio.removeEventListener(
          "ended",
          mythis.aduioListener
        );
        mythis.aduioListener = null;
        mythis.countDownTimer(mythis.typeQuestion, question);
      };
      this.hintQuestionAudio.addEventListener("ended", this.aduioListener);
    },
    help() {
      this.hint
        ? [
            this.resetSoltan(),
            (this.hint = true),
            this.animations.characterInside.playSegments([51, 100], true),
          ]
        : this.resetSoltan();
      this.stopCountDown();
      this.instractionsView = true;
      clearInterval(this.setInterval);
    },
    getSlideInst() {
      let startIndex = (this.currentPage - 1) * this.pageSize;
      let endIndex = startIndex + this.pageSize;
      this.instractionsActive = this.instractions.slice(startIndex, endIndex);
    },
    next() {
      this.currentPage += 1;
      this.getSlideInst();
    },
    prev() {
      this.currentPage -= 1;
      this.getSlideInst();
    },
    skip() {
      this.currentPage = 1;
      this.getSlideInst();
      this.instractionsView = false;
      this.animations.soltanDoor.playSegments([0, 60], true);
      this.animations.soltanDoor.loop = true;
      if (this.bgMusic && this.soundDoorPlay) {
        setTimeout(() => {
          this.clickDoorAudio.play();
        }, 1000);
        this.soundDoorPlay = false;
      }
      if (this.activeDoor != null && this.startQuestion[this.activeDoor]) {
        this.typeQuestion == 4 ? this.displayHintPUn(this.typeQuestion) : "";
        this.countDownTimer(this.typeQuestion, this.currentQuestion);
      }
    },
    calculateProgress() {
      // let resultLeftDoor = ( this.pointsDoors[0] * 100 ) / 10
      let play = this.pointsDoors[this.activeDoor] * 5;
      if (
        this.posts[0].scoureDoors[this.activeDoor] <
        this.pointsDoors[this.activeDoor]
      ) {
        this.posts[0].scoureDoors[this.activeDoor] =
          this.pointsDoors[this.activeDoor];
        this.UpdateStudentActivity();
      }
      if (play != 0) {
        this.starAudio.play();
      }
      console.log(this.activeDoor + "activedoor");
      this.activeDoor == 0
        ? [this.animations.star0.playSegments([0, play])]
        : this.activeDoor == 1
        ? [this.animations.star1.playSegments([0, play])]
        : this.activeDoor == 2
        ? [this.animations.star2.playSegments([0, play])]
        : "";
    },
    resetTime() {},
    nextQuestion() {
      this.counter += 1;
      this.nextQuestionLO(false);
    },
    preQuestion() {
      this.counter -= 1;
      this.nextQuestionLO(false);
    },
    getPunAnswerStudent() {
      let question =
        this.posts[0].doors[this.activeDoor].punctuate.questions[0];
      let word = this.studentAnswerPunctuate[this.activeDoor];
      let result = showAnswerPun(
        word,
        question,
        this.allSolvedStyle[this.activeDoor]
      );
      this.allSolvedStyle[this.activeDoor] = result.solvedStyle;
      this.solvedStyle = this.allSolvedStyle[this.activeDoor];

      this.studentAnswerPunctuate[this.activeDoor] = result.wordsPunctuate;
      this.studentAnswer = result.wordsPunctuate;
    },
    calculateApi() {
      // let resultLeftDoor = ( this.pointsDoors[0] * 100 ) / 10
      if (this.posts[0].scoureDoors[0] != 0) {
        // star0.autoplay = false
        let play = this.posts[0].scoureDoors[0] * 5;
        this.animations.star0.playSegments([0, play]);
      }
      if (this.posts[0].scoureDoors[1] != 0) {
        let play = this.posts[0].scoureDoors[1] * 5;
        this.animations.star1.playSegments([0, play]);
      }
      if (this.posts[0].scoureDoors[2] != 0) {
        let play = this.posts[0].scoureDoors[2] * 5;
        this.animations.star2.playSegments([0, play]);
      }
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
    getNumberOfAllDoor() {
      this.posts[0].doors.forEach((e) => {
        this.posts[0].numberOfquestion += e.choose.questions.length;
        this.posts[0].numberOfquestion += e.tureFalse.questions.length;
        this.posts[0].numberOfquestion += e.selectText.questions.length;
        this.posts[0].numberOfquestion +=
          e.punctuate.questions[0].wrongWord.length;
      });
    },
  },
});
