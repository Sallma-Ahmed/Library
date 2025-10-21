let interactive = document.querySelector("#interactiveVedio");
let pageUrl = interactive.getAttribute("data-urlpage");

new Vue({
  el: "#interactiveVedio",
  data: {
    posts: [],
    vedio: null,
    activeQuestion: null,
    questionCounter: 1,
    quizCounter: 0,
    videoCounter: 0,
    quizVedio: false,
    title: "",
    parag: "",
    feedback: false,
    expression: false,
    expressionParag: [""],
    expressText: null,
    numberOfVedio: 0,
    videos: [],
    failAudio: new Audio(),
    successAudio: new Audio(),
    expressionAudio: new Audio(),
    questionAudio: new Audio(),
    chooses: null,

    // --------------------------------------------------------
    isLoading: false,
    isSuccess: false,
    activityId: 0,
    dataLoaded: false,
    currentdate: "",
    date: null,
    loQuestion: null,
    // --------------------------------------------------------
  },

  async create() {},
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  async mounted() {
    await this.getData();
    await this.Resize();
    window.addEventListener("resize", this.Resize);
    await this.playLo();
    this.failAudio.src =
      "../../../lib-native/interactivevedio/assets/audio/fail.mp3";
    this.successAudio.src =
      "../../../lib-native/interactivevedio/assets/audio/success.mp3";
    this.chooses = document.getElementsByClassName("chooses");
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
      if (direction == "2") {
        await returnData.then((response) => {
          this.isSuccess = response.isSuccess;
          this.data = response.value;
          this.activityId = this.data.activityId;
          this.posts[0].title = this.data.title;
          this.posts[0].bloomLevels = this.data.bloomLevels;
          this.posts[0].learningObjectives = this.data.learningObjectives;
          this.posts[0].loDegree = this.data.loDegree;
          this.posts[0].keywords = this.data.keywords;
          this.posts[0].type = this.data.type;
          this.posts[0].unitId = this.data.unitId;
          if (
            this.data.learningObjectAsJson != "" &&
            this.data.learningObjectAsJson != null
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);
            this.posts[0] = jsonData;
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
      await fetch(pageUrl + ".json")
        .then((res) => res.json())
        .then((data) => {
          this.localPosts = data;
        });
      if (this.posts.length == 0) {
        this.posts = this.localPosts;
      } else {
        // this.posts[0].items = this.localPosts[0].items;
      }
      this.posts.length != 0
        ? setTimeout(() => {
            this.isLoading = true;
            // this.posts[0].startTime = this.getDate();
          }, 1000)
        : (this.isLoading = false);
      this.createVedio();
    },
    playLo(type) {
      this.posts[0].questions[this.questionCounter - 1].active = true;
      this.activeQuestion = this.posts[0].questions[this.questionCounter - 1];
      this.videos.forEach((e) => {
        e.active = false;
        
      });
      this.videos[this.videoCounter].active = true;
      this.title = this.posts[0].title;
      console.log(this.videoCounter)
      this.vedio = new Plyr(document.getElementById(this.videoCounter), {
        controls: [
          "play-large", // The large play button in the center
          // "restart", // Restart playback
          // "rewind", // Rewind by the seek time (default 10 seconds)
          // "play", // Play/pause playback
          // "fast-forward", // Fast forward by the seek time (default 10 seconds)
          // "progress", // The progress bar and scrubber for playback and buffering
          // "current-time", // The current time of playback
          // "duration", // The full duration of the media
          // "mute", // Toggle mute
          // "volume", // Volume control
          // "captions", // Toggle captions
          // "settings", // Settings menu
          // "pip", // Picture-in-picture (currently Safari only)
          // "airplay", // Airplay (currently Safari only)
          // "download", // Show a download button with a link to either the current source or a custom URL you specify in your options
          // "fullscreen", // Toggle fullscreen
        ],
        hideControls: false, // Always show controls
      });
      this.preventV()
      if(this.videoCounter>0){
        this.vedio.play();

      }
      var mythis = this;
      if (type) {
        this.videoCounter -= 1;
      }
      this.vedio.on("ended", function (e) {
        mythis.parag =
          mythis.posts[0].questions[mythis.questionCounter - 1].parag;
        if (mythis.activeQuestion.quiz.length > 0) {
          mythis.videos[mythis.videoCounter].active = false;
          mythis.quizVedio = true;
          mythis.activeQuestion.quiz[mythis.quizCounter].active = true;
          Array.from(mythis.chooses).forEach((e) => {
            e.style.pointerEvents = "auto";
          });
          setTimeout(() => {
            mythis.questionAudio.src = `./audio/q/q${
              mythis.activeQuestion.quiz[mythis.quizCounter].id
            }.mp3`;
            mythis.questionAudio.play();
          }, 1000);
          // mythis.activeQuestion.quiz[mythis.quizCounter].startTime =
          //   mythis.getDate();
        } else {
          // mythis.calculateLo();
          // mythis.posts[0].endTime = mythis.getDate();
        }
      });
    },
    chooseQuestion(choose, event, quiz) {
      this.questionAudio.pause();
      Array.from(this.chooses).forEach((e) => {
        e.style.pointerEvents = "none";
      });
      this.questionAudio.pause();
      if (
        choose.number ==
        this.activeQuestion.quiz[this.quizCounter].correctAnswer
      ) {
        event.target.classList.add("trueChoose");
        this.trueAnswer(quiz);
      } else {
        event.target.classList.add("falseChoose");
        this.falseAnswer(quiz);
      }
      setTimeout(() => {
        this.feedback = true;
        setTimeout(() => {
          console.log("open");
          this.expressionAudio.play();
        }, 500);
      }, 1000);
    },
    trueAnswer(quiz) {
      quiz.correctCounter == 0 ? (quiz.correctCounter += 1) : "";
      this.successAudio.play();
      this.expressionAudio.src = `./audio/t/t${quiz.id}.mp3`;
      this.expression = true;
      (this.expressText = quiz.expressionTrue),
        (this.expressionParag =
          this.activeQuestion.quiz[this.quizCounter].trueExpersion);
      // this.UpdateStudentActivity();
    },
    falseAnswer(quiz) {
      quiz.numberOfTrial += 1;
      this.failAudio.play();
      this.expressionAudio.src = `./audio/f/f${quiz.id}.mp3`;
      this.expression = false;
      this.expressText = "إجابةٌ غَيرُ صحيحةٍ";
      this.expressionParag =
        this.activeQuestion.quiz[this.quizCounter].falseExpersion;
      // this.UpdateStudentActivity();
    },
    next() {
      this.expressionAudio.pause();
      this.feedback = false;
      this.videoCounter += 1;
      if (this.quizCounter < this.activeQuestion.quiz.length - 1) {
        this.activeQuestion.quiz[this.quizCounter].active = false;
        // this.activeQuestion.quiz[this.quizCounter].endTime = this.getDate();
        this.quizCounter += 1;
        this.activeQuestion.quiz[this.quizCounter].active = true;

        Array.from(this.chooses).forEach((e) => {
          e.style.pointerEvents = "auto";
        });
        setTimeout(() => {
          this.questionAudio.src = `./audio/q/q${
            this.activeQuestion.quiz[this.quizCounter].id
          }.mp3`;
          this.questionAudio.play();
        }, 1000);
      } else {
        if (this.questionCounter < this.posts[0].questions.length) {
          this.posts[0].questions.forEach((question) => {
            question.active = false;
          });
          this.questionCounter += 1;
          this.activeQuestion.quiz[this.quizCounter].active = false;
          this.quizCounter = 0;
          this.videoCounter += 1;
          this.quizVedio = false;
          this.posts[0].questions[this.questionCounter - 1].active = true;
          this.playLo();
        }
      }
    },
    reload() {
      this.expressionAudio.pause();
      this.feedback = false;
      this.videoCounter += 1;
      this.quizVedio = false;
      this.playLo(true);
    },
    playVedioFalse() {
      this.quizVedio = false;
      this.posts[0].questions[this.questionCounter - 1].active = true;
      this.vedio.play();
      var mythis = this;
      this.vedio.on("ended", function (e) {
        mythis.activeQuestion =
          mythis.posts[0].questions[mythis.questionCounter - 1];
        mythis.quizVedio = true;
      });
    },
    Resize: async function () {
      const loQuestions = document.getElementById("loQuestions");

      if (window.innerWidth / window.innerHeight > 16 / 9) {
        loQuestions.style.height = 100 + "vh";
        loQuestions.style.width = (window.innerHeight / 9) * 16 + "px";
      } else if (window.innerWidth / window.innerHeight < 16 / 9) {
        loQuestions.style.height = (window.innerWidth / 16) * 9 + "px";
        loQuestions.style.width = 100 + "vw";
      } else {
        loQuestions.style.height = 100 + "vh";
        loQuestions.style.width = 100 + "vw";
      }
    },
    createVedio() {
      this.posts[0].questions.forEach((ques) => {
        this.numberOfVedio += 1;
        ques.quiz.forEach((quiz) => {
          this.numberOfVedio += 1;
        });
      });
      for (let i = 0; i < this.numberOfVedio; i++) {
        let ob = {
          active: false,
          id: i,
          name: `./video/${i + 1}.mp4`,
        };
        this.videos.push(ob);
      }
    },
    get() {
      console.log(this.videoCounter + 1);
    },
    // UpdateStudentActivity() {
    //   direction != ""
    //     ? globalFunctions.UpdateStudentActivity(this.activityId, this.posts[0])
    //     : "";
    // },
    calculateLo() {
      this.posts[0].questions.forEach((question) => {
        question.quiz.forEach((quiz) => {
          this.posts[0].numberOfquestion += 1;
          this.posts[0].LOcorrectcounter += quiz.correctCounter;
        });
      });
      console.log(this.posts[0].LOcorrectcounter);
      console.log(this.posts[0].numberOfquestion);
    },
    preventV(){
      console.log(this.vedio)
      this.vedio.on("fullscreenchange", function () {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      });
      
      this.vedio.on("webkitfullscreenchange", function () {
        if (document.webkitFullscreenElement) {
          document.webkitExitFullscreen();
        }
      });
      
      this.vedio.on("mozfullscreenchange", function () {
        if (document.mozFullScreenElement) {
          document.mozCancelFullScreen();
        }
      });
      
      this.vedio.on("msfullscreenchange", function () {
        if (document.msFullscreenElement) {
          document.msExitFullscreen();
        }
      });
    }
  },
});
