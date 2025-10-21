let slideShow = document.querySelector("#slide-show");
let pageUrl = slideShow.getAttribute("data-urlpage");
new Vue({
  el: "#slide-show",
  data: {
    posts: {},
    loQuestions: 6,
    counter: 0,
    muteSound: false,
    startLo: false,
    slideCounter: 0,
    maxLengthSlide: 0,
    maxLengthQuestions: 0,
    slide: true,
    startClick: new Audio(),
    slideSound: new Audio(),
    rightClick: new Audio(),
    wrongClick: new Audio(),
    win: new Audio(),
    loss: new Audio(),
    isRight: null,
    checked: false,
    questionCounter: 0,
    feedbackText: "",
    progressPercentage: 0,
    result: 0,
    upper: null,
    // --------------------------------------------------------
    isLoading: false,
    isSuccess: false,
    activityId: 0,
    currentdate: "",
    date: null,
    shuffledQuestion: [],
    playRight: false,
    ended: false,
    hint: false,
    currentdate: "",
    dataLoaded: false,
    // --------------------------------------------------------
  },

  create() {},

  async mounted() {
    await this.reSize();
    await this.getData();
    this.shuffle();
  },

  methods: {
    reSize: async function () {
      if (window.innerHeight >= window.innerWidth) {
        document.getElementById("slide-show").classList.add("resize");
        document
          .getElementsByClassName("inner-container")[0]
          .classList.add("resize");
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
            // this.posts = jsonData;
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

      if (!this.dataLoaded) {
        await fetch(pageUrl + ".json")
          .then((res) => res.json())
          .then((data) => {
            this.posts = data;
            this.posts.questions.forEach((question) => {
              question.numberOfTrial = 0;
            });
          });
      }

      this.posts.length != 0
        ? setTimeout(() => {
            this.isLoading = true;
            this.posts.LOcorrectcounter = 0;
            this.posts.numberOfquestion = this.shuffledQuestion.length;
            this.maxLengthSlide = this.posts.slides.length;
            this.posts.questions.forEach((question) => {
              question.numberOfTrial = 0;
            });
          }, 1000)
        : (this.isLoading = false);
    },

    start() {
      if (direction == "2") {
        this.posts.title = this.data.title;
        this.posts.bloomLevels = this.data.bloomLevels;
        this.posts.learningObjectives = this.data.learningObjectives;
        this.posts.loDegree = this.data.loDegree;
        this.posts.keywords = this.data.keywords;
        this.posts.type = this.data.type;
        this.posts.unitId = this.data.unitId;
      }
      this.startClick.src =
        "../../../lib-native/slideshow/sound/startclick.mp3";
      this.startClick.play();
      this.startLo = true;
      this.slide = true;
      const counter = this.slideCounter + 1;
      this.slideSound.src = "sound/s/" + counter + ".mp3";
      this.slideSound.play();
      this.slideCounter = 0;
      this.hint = true;
      this.posts.startTime = this.getDate();
      var div = document.getElementById("slide-show");
      var grade = div.getAttribute("grade");
      grade <= 3 ? (this.upper = false) : (this.upper = true);
    },

    goHome() {
      this.startLo = false;
      this.slideSound.pause();
      this.slideCounter = 0;
      this.questionCounter = 0;
      this.muteSound = false;
      this.hint = true;
      this.resetData();
    },

    next() {
      this.slideCounter += 1;
      this.hint = false;

      if (this.slideCounter < this.maxLengthSlide) {
        this.newSlideSound(this.slideCounter + 1);
      } else if (this.slideCounter == this.maxLengthSlide) {
        this.slideSound.pause();
      }
    },

    prev() {
      this.hint = false;
      if (this.slideCounter != 0) {
        this.slideCounter -= 1;
        this.newSlideSound(this.slideCounter + 1);
      }
    },

    newSlideSound(sCounter) {
      // console.log("sound/q/" + sCounter + ".mp3")
      this.slideSound.pause();
      this.slideSound.src = "sound/s/" + sCounter + ".mp3";
      if (!this.muteSound) {
        this.slideSound.play();
      }
    },

    newQuestionSound(qCounter) {
      this.slideSound.pause();
      // this.slideSound.src = "sound/q/" + qCounter + ".mp3";
      this.slideSound.src = this.shuffledQuestion[qCounter].sound;
      if (!this.muteSound) {
        this.slideSound.play();
      }
    },

    mute() {
      this.muteSound = !this.muteSound;
      this.muteSound ? this.slideSound.pause() : this.slideSound.play();
    },

    getUserSelection(answer) {
      this.isRight = answer.isRight;
      this.checked = true;
      answer.checked = true;
      this.slideSound.pause();

      if (this.isRight) {
        this.rightClick.src =
          "../../../lib-native/slideshow/sound/right-click.mp3";
        this.rightClick.play();
        this.playRight = true;
        this.posts.LOcorrectcounter += 1;
        coins.playSegments([0, 30], true);

        setTimeout(() => {
          if (this.posts.LOcorrectcounter == 1) {
            states.playSegments([0, 4], true);
          } else if (this.posts.LOcorrectcounter == 2) {
            states.playSegments([4, 7], true);
          } else if (this.posts.LOcorrectcounter == 3) {
            states.playSegments([8, 11], true);
          } else if (this.posts.LOcorrectcounter == 4) {
            states.playSegments([12, 15], true);
          } else if (this.posts.LOcorrectcounter == 5) {
            states.playSegments([16, 18], true);
          } else if (this.posts.LOcorrectcounter == 6) {
            states.playSegments([19, 21], true);
          }
        }, 1900);
      } else {
        this.shuffledQuestion[this.questionCounter].numberOfTrial += 1;
        this.wrongClick.src =
          "../../../lib-native/slideshow/sound/wrong-click.mp3";
        this.wrongClick.play();
      }
      // --------------------------------------------------------
      direction != ""
        ? globalFunctions.UpdateStudentActivity(this.activityId, this.posts)
        : "";
      // --------------------------------------------------------
      setTimeout(() => {
        this.nextQuestion();
      }, 2000);
    },

    nextQuestion() {
      this.questionCounter += 1;
      // console.log(this.questionCounter)
      // console.log(this.shuffledQuestion.length)

      // console.log(this.shuffledQuestion)
      this.shuffledQuestion[this.questionCounter - 1].endTime = this.getDate();
      this.questionCounter < this.shuffledQuestion.length
        ? (this.shuffledQuestion[this.questionCounter].startTime =
            this.getDate())
        : "";
      if (this.questionCounter < this.maxLengthQuestions) {
        this.slideSound.pause();
        // setTimeout(() => {
        this.playRight = false;
        this.checked = false;
        this.shuffledQuestion[this.questionCounter - 1].active = false;
        this.shuffledQuestion[this.questionCounter].active = true;
        this.newQuestionSound(this.questionCounter);
        // }, 2000);
      } else {
        this.feedback();
      }
      // console.log(this.posts)
    },

    startQuestions() {
      // states.playSegments([0, 1], true);
      this.slideCounter = 0;
      this.maxLengthQuestions = this.shuffledQuestion.length;
      this.slideSound.pause();
      this.slide = false;
      this.questionCounter = 0;
      this.shuffledQuestion[this.questionCounter].active = true;
      this.newQuestionSound(this.questionCounter);
      this.shuffledQuestion[0].startTime = this.getDate();
    },

    playQuestionSound($event) {
      let audio = $event.target.querySelector("audio");
      if (audio.paused && event.target.classList.contains("paused")) {
        let stopSound = document.querySelectorAll(".play_sound  audio");
        for (var i = 0; i < stopSound.length; ++i) {
          stopSound[i].pause();
          stopSound[i].parentElement.classList.add("paused");
        }
        audio.play();
        event.target.classList.remove("paused");
      } else {
        audio.pause();
        event.target.classList.add("paused");
      }
      audio.onended = function () {
        event.target.parentElement.classList.add("paused");
      };
    },

    feedback() {
      this.finished();
      this.progressPercentage =
        (this.posts.LOcorrectcounter / this.posts.numberOfquestion) * 100;
      this.feedbackSound(this.progressPercentage);
      this.calculateProgress(this.progressPercentage);
      this.posts.endTime = this.getDate();
    },

    calculateProgress(progress) {
      if (progress == 0) {
        console.log(progress);
        if (this.upper) {
          this.feedbackText = "ضعيف";
          progressbar.playSegments([0, 1], true);
        } else {
          progressbar.playSegments([0, 1], true);
        }
      }
      if (progress > 0 && progress <= 50) {
        if (this.upper) {
          this.feedbackText = "ضعيف";
          progressbar.playSegments([0, progress], true);
        } else {
          progressbar.playSegments([0, 1], true);
        }
      }
      if (progress >= 51 && progress <= 64) {
        if (this.upper) {
          this.feedbackText = "مقبول";
          progressbar.playSegments([0, progress], true);
        } else {
          progressbar.playSegments([59, 60], true);
        }
      }
      if (progress >= 65 && progress <= 84) {
        if (this.upper) {
          progressbar.playSegments([0, progress], true);
          this.feedbackText = "جيد";
        } else {
          progressbar.playSegments([74, 75], true);
        }
      }
      if (progress >= 85 && progress <= 100) {
        if (this.upper) {
          progressbar.playSegments([0, progress], true);
          this.feedbackText = "يفوق التوقعات ";
        } else {
          progressbar.playSegments([90, 100], true);
        }
      }
    },

    feedbackSound(score) {
      if (score <= 51) {
        this.loss.src = "../../../lib-native/slideshow/sound/loss.mp3";
        this.loss.play();
      } else {
        this.win.src = "../../../lib-native/slideshow/sound/win.mp3";
        this.win.play();
      }
    },

    finished() {
      let result = 0;
      this.posts.counterCorrect =
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
      return result;
    },

    resetData() {
      this.shuffledQuestion.forEach((element) => {
        element.active = false;
        element.numberOfTrial = 0;
        element.answers.forEach((answer) => {
          answer.checked = false;
        });
      });
      this.checked = false;
      this.isRight = false;
      this.playRight = false;
      this.progressPercentage = 0;
      this.feedbackText = "";
      this.posts.LOcorrectcounter = 0;
      this.posts.counterCorrect = 0;
      states.playSegments([0, 1], true);
      location.reload();
    },

    randomData(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    },

    // shuffle() {
    //   this.shuffledQuestion = [];
    //   let typeOne = this.posts.questions.filter((el) => el.subtype == "text");
    //   this.shuffledQuestion.push(this.randomData(typeOne).slice(0, 2));
    //   let typTwo = this.posts.questions.filter((el) => el.subtype == "images");
    //   this.shuffledQuestion.push(this.randomData(typTwo).slice(0, 2));
    //   let typeThree = this.posts.questions.filter(
    //     (el) => el.subtype == "truefalse"
    //   );
    //   this.shuffledQuestion.push(this.randomData(typeThree).slice(0, 2));
    //   this.shuffledQuestion = this.randomData(this.shuffledQuestion.flat());
    //   // console.log(this.shuffledQuestion)
    // },
    shuffle() {
      let typeText = this.posts.questions.filter((el) => el.subtype == "text");
      let typeImages = this.posts.questions.filter((el) => el.subtype == "images");
      let typeTrueFalse = this.posts.questions.filter((el) => el.subtype == "truefalse");
      let groupedTypes = [typeText, typeImages, typeTrueFalse];
      let shuffledGroups = this.randomData(groupedTypes);
      let allQuestions = shuffledGroups.flat();
      this.shuffledQuestion = allQuestions.slice(0, 6);
      // console.log(this.shuffledQuestion);
    },
  },
});
