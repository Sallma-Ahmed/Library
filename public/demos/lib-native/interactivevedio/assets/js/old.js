let soltan = document.querySelector("#interactiveVedio");
let pageUrl = soltan.getAttribute("data-urlpage");

new Vue({
  el: "#interactiveVedio",
  data: {
    posts: [],
    vedio: null,
    displayQuestion: false,
    activeQuestion: null,
    checkInput: true,
    questionCounter: 1,
    quizCounter: 0,
    videoCounter:0,
    quizVedio: false,
    title: "",
    parag: "",
    feedback: false,
    expression: false,
    expressionParag: [""],
    expressText: null,
    numberOfVedio: 0,
    videos: [],
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
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
  async mounted() {
    await this.getData();
    await this.Resize();
    window.addEventListener("resize", this.Resize);
    await this.playLo();
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
            this.posts[0].LOcorrectcounter = 0;
            this.posts[0].counterCorrect = 0;
            this.posts[0].items.forEach((item) => {
              item.check = false;
            });
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
          }, 1000)
        : (this.isLoading = false);
        this.createVedio();

    },
    playLo(type) {
      this.posts[0].questions[this.questionCounter - 1].active = true;
      this.activeQuestion = this.posts[0].questions[this.questionCounter - 1];
      this.videos.forEach(e=>{
        e.active = false
      })
      this.videos[this.videoCounter].active = true;
      this.title = this.posts[0].title;  
      this.vedio = new Plyr(document.getElementById(this.videoCounter), {
        controls: [
          "play-large", // The large play button in the center
          "restart", // Restart playback
          "rewind", // Rewind by the seek time (default 10 seconds)
          "play", // Play/pause playback
          "fast-forward", // Fast forward by the seek time (default 10 seconds)
          "progress", // The progress bar and scrubber for playback and buffering
          "current-time", // The current time of playback
          "duration", // The full duration of the media
          "mute", // Toggle mute
          "volume", // Volume control
          "captions", // Toggle captions
          "settings", // Settings menu
          "pip", // Picture-in-picture (currently Safari only)
          "airplay", // Airplay (currently Safari only)
          "download", // Show a download button with a link to either the current source or a custom URL you specify in your options
          "fullscreen", // Toggle fullscreen
        ],
        hideControls: false, // Always show controls
      });
      this.vedio.play();
      var mythis = this;
      if(type){
        this.videoCounter -= 1
      }
      this.vedio.on("ended", function (e) {
        mythis.parag =
          mythis.posts[0].questions[mythis.questionCounter - 1].parag;
        if (mythis.activeQuestion.quiz.length > 0) {
          mythis.videos[mythis.videoCounter].active = false;
          mythis.quizVedio = true;
          mythis.activeQuestion.quiz[mythis.quizCounter].active = true;
        }
      });
    },
    chooseQuestion(choose, event) {
      var chooes = document.getElementsByClassName("chooses")[0];
      chooes.style.pointerEvents = "none";
      if (
        choose.number ==
        this.activeQuestion.quiz[this.quizCounter].correctAnswer
      ) {
        event.target.classList.add("trueChoose");
        this.trueAnswer();
      } else {
        event.target.classList.add("falseChoose");
        this.falseAnswer();
      }
      setTimeout(() => {
        this.feedback = true;
      }, 1000);
    },
    trueAnswer() {
      this.expression = true;
      (this.expressText = "أحسَنت! الإجابةُ صحيحةٌ"),
        (this.expressionParag =
          this.activeQuestion.quiz[this.quizCounter].trueExpersion);
    },
    falseAnswer() {
      this.expression = false;
      this.expressText = "إجابةٌ غَيرُ صحيحةٍ";
      this.expressionParag =
        this.activeQuestion.quiz[this.quizCounter].falseExpersion;
    },
    next() {
      this.feedback = false;
      this.videoCounter += 1
      if (this.quizCounter < this.activeQuestion.quiz.length - 1) {
        this.activeQuestion.quiz[this.quizCounter].active = false;
        this.quizCounter += 1;
        this.activeQuestion.quiz[this.quizCounter].active = true;
      } else {
        if (this.questionCounter < this.posts[0].questions.length) {
          this.posts[0].questions.forEach((question) => {
            question.active = false;
          });
          this.questionCounter += 1;
          this.activeQuestion.quiz[this.quizCounter].active = false;
          this.quizCounter = 0;
          this.videoCounter += 1
          setTimeout(() => {
            this.posts[0].questions[this.questionCounter - 1].active = true;
            this.quizVedio = false;
            this.playLo();
          }, 1000);
        }
      }
    },
    reload() {
      this.feedback = false;
      this.videoCounter += 1
     
      setTimeout(() => {
        this.quizVedio = false;
        this.playLo(true);
      }, 1000);
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
    // checkValueInput(event, i) {
    //   this.numOfInput();
    //   this.checkInput = true;
    //   this.activeQuestion.inputs[i].valid.forEach((valid, index) => {
    //     if (this.checkInput) {
    //       if (event.target.value == valid) {
    //         event.target.classList.remove("false");
    //         event.target.classList.add("true");
    //         this.activeQuestion.inputs[i].valid.splice(index, 1);
    //         this.checkInput = false;
    //         this.activeQuestion.counterCorrectQuestion += 1;
    //       } else {
    //         event.target.classList.add("false");
    //       }
    //     }
    //   });
    // },
    // checkValueALL() {
    //   var input = document.getElementsByClassName("input");
    //   for (var i = 0; i < input.length; i++) {
    //     if (input[i].classList.contains("false")) {
    //       input[i].classList.add("falseInput");
    //     } else if (input[i].classList.contains("true")) {
    //       input[i].classList.add("trueInput");
    //     } else {
    //       input[i].classList.add("falseInput");
    //     }
    //     if (
    //       this.activeQuestion.counterCorrectQuestion ==
    //       this.activeQuestion.numberQuestion
    //     ) {
    //       this.trueAnswer();
    //     } else {
    //       this.falseAnswer();
    //     }
    //   }
    // },
    // numOfInput() {
    //   this.activeQuestion.numberQuestion = 0;
    //   this.activeQuestion.inputs.forEach((e) => {
    //     this.activeQuestion.numberQuestion += e.numOfInput;
    //   });
    // },
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
          name:`./video/${i+1}.mp4`
        };
        this.videos.push(ob);
      }
    },
    get(){
      console.log(this.videoCounter+1)
    }
  },
});
