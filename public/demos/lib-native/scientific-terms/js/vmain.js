const Mostla7at = document.querySelector("#Mostla7at");
const pageUrl = Mostla7at.getAttribute("data-urlpage");
new Vue({
  el: "#Mostla7at",
  data: {
    Items: [],
    bgAudio: new Audio(),
    wrongAnswer: new Audio(),
    rightAnswer: new Audio(),
    clickBtn: new Audio(),
    isLoaded: false,
    isSuccess: false,
    activityId: 0,
    dataLoaded: false,
    currentdate: "",
    data: null,
    correctLo: 0,
    counter: -1,
    roundQuiz: 1,
    dataNum: 1,
    bgMusic: false,
    activesound: false,
    sound: new Audio(),
    select_StartPlay: null,
    select_QandA: null,
    select_quizRename: null,
    select_Light: null,
    select_items: null,
    select_labelOne: null,
    select_labelTwo: null,
    select_imgs: null,
    select_text: null,
    select_pragraph: null,
    correct_calculation: [],
  },
  async mounted() {
    await this.getData();
    this.numOfquestion();
    this.bgAudio.src = "../../../lib-native/scientific-terms/audio/music.mp3";
    this.wrongAnswer.src =
      "../../../lib-native/scientific-terms/audio/false.mp3";
    this.rightAnswer.src =
      "../../../lib-native/scientific-terms/audio/right.mp3";
    this.clickBtn.src =
      "../../../lib-native/scientific-terms/audio/click_btn.mp3";
    finalResponse.submitData(JSON.stringify(this.Items[0]), 1, 0);
    QandA.goToAndStop(0, true);
    StartPlay.goToAndStop(0, true);
    setTimeout(() => {
      StartPlay.playSegments([0, 120], true);
    }, 1000);
    this.select_StartPlay = document.getElementById("StartPlay");
    this.select_QandA = document.getElementById("QandA");
    this.select_quizRename = document.getElementsByClassName("quizRename");
    this.select_Light = document.getElementsByClassName("Light");
    this.select_music = document.getElementsByClassName("music");
    this.select_items = document.querySelectorAll(".items");
    this.select_items_p = document.querySelectorAll(".items p");

    this.select_body = document.getElementsByTagName("body");

    this.select_labelOne = document.getElementsByClassName("labelOne");
    this.select_labelTwo = document.getElementsByClassName("labelTwo");
    this.select_imgs = document.getElementsByClassName("imgs");
    this.select_text = document.getElementsByClassName("text");
    this.select_textTwo = document.getElementsByClassName("textTwo");
    this.select_title = document.getElementsByClassName("title");
    this.select_pragraph = document.getElementsByClassName("pragraph");
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

          if (
            this.data.learningObjectAsJson != "" &&
            this.data.learningObjectAsJson != null
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);
            this.Items[0].posts[0] = jsonData;
            this.dataLoaded = true;
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
              this.Items = data;
            })
        : "";

      this.Items[0].posts.length != 0
        ? setTimeout(() => {
            this.isLoaded = true;
            this.Items[0].posts[0].startTime = this.getDate();
          }, 1000)
        : (this.isLoaded = false);
    },

    muteMusic() {
      this.bgMusic = !this.bgMusic;
      this.bgAudio.loop = true;
      this.bgAudio.paused ? this.bgAudio.play() : this.bgAudio.pause();
    },

    start: function () {
      (this.activesound = true),
        this.select_StartPlay.classList.add("pointer-none");
      this.select_music[0]?.classList.add("d-flex");
      StartPlay.playSegments([140, 260], true);
      this.muteMusic();
      setTimeout(() => {
        QandA.playSegments([0, 60], true);
        for (let i = 1; i <= 8; i++) {
          animpostId = ["ItemsReady0" + i];
          const animation = animationInstances[animpostId];
          if (i == 1) {
            animation.playSegments([60, 120], true);
          } else {
            animation.playSegments([0, 60], true);
          }
        }

        this.select_QandA.classList.add("opacity-one");
        this.select_quizRename[0]?.classList.add(
          "opacity-one",
          "pointer-auto",
          "show"
        );

        this.Items[0].posts.forEach((element, i) => {
          element.isActive = false;
          if (i != 0) {
            element.pointer = true;
          }
        });
        this.Items[0].posts[0].isActive = true;
        this.Items[0].posts.forEach((element) => {
          element.opacity_item = true;
        });

        this.Items[0].posts[0].seeQuiz = true;
        this.sound.src = "audio/1_q_1.mp3";
        this.sound.play();
      }, 2500);

      if (direction == "2") {
        this.Items[0].bloomLevels = this.data.bloomLevels;
        this.Items[0].learningObjectives = this.data.learningObjectives;
        this.activityId = this.data.activityId;
        this.Items[0].loDegree = this.data.loDegree;
        this.Items[0].keywords = this.data.keywords;
        this.Items[0].type = this.data.type;
        // (this.Items[0].title = this.data.title
        this.Items[0].unitId = this.data.unitId;
      }

      //
      const length = this.Items[0].posts.length;
      this.correct_calculation = new Array(length).fill(false);
      //
    },

    activate(postId, index) {
      this.Items[0].posts.forEach((element) => {
        if (element.isActive) {
          const lastAnimation = animationInstances[element.id];
          lastAnimation.playSegments([80, 60], true);
        }
      });
      this.Items[0].posts.forEach((element) => {
        element.isActive = false;
      });
      QandA.playSegments([49, 50], true);
      this.select_body[0].classList.remove("isEnd");

      this.dataNum = postId.charAt(postId.length - 1);
      this.Items[0].posts[index].isActive = true;
      this.Items[0].posts[index].seeQuiz = true;
      this.Items[0].posts[index].startTime = this.getDate();
      const animation = animationInstances[postId];
      animation.playSegments([60, 120], true);

      this.Items[0].posts.forEach((ela) => {
        ela.pointer = true;
      });
      this.Items[0].posts[index].pointer = false;
      this.sound.pause();
      this.sound.src = "audio/" + this.dataNum + "_q_1.mp3";
      this.sound.play();
    },

    numOfquestion: function () {
      this.Items[0].numberOfquestion = this.Items[0].posts.length;
      // console.log(this.Items[0].numberOfquestion);
    },

    startTime: function () {
      this.counter += 1;
      this.Items[0].startTime = this.getDate();
      this.Items[0].posts[0].startTime = this.getDate();
      direction == "2"
        ? ((this.Items[0].bloomLevels = this.data.bloomLevels),
          (this.Items[0].learningObjectives = this.data.learningObjectives),
          (this.activityId = this.data.activityId),
          (this.Items[0].loDegree = this.data.loDegree),
          (this.Items[0].keywords = this.data.keywords),
          (this.Items[0].type = this.data.type),
          // (this.Items[0].title = this.data.title),
          (this.Items[0].unitId = this.data.unitId))
        : "";
    },

    endTime: function (index) {
      this.Items[0].endTime = this.getDate();
      this.Items[0].posts[index].endTime = this.Items[0].endTime;
    },

    checkCorrect: function (event) {
      this.sound.pause();
      var Choose = event.target;
      var correct = Choose.getAttribute("data-correct");
      this.select_labelOne[0]?.classList.add("pointer-none");
      this.select_labelTwo[0]?.classList.add("pointer-none");
      this.Items[0].posts.forEach((ela) => {
        ela.pointer = false;
      });
      if (correct) {
        this.correct_calculation[this.dataNum - 1]
          ? ""
          : [
              (this.correctLo += 1),
              (this.correct_calculation[this.dataNum - 1] = true),
            ];
        this.Items[0].LOcorrectcounter = this.correctLo;
        this.openTheGate();
        this.rightAnswer.pause();
        this.rightAnswer.src =
          "../../../lib-native/scientific-terms/audio/right.mp3";
        this.rightAnswer.play();
      } else {
        this.closeTheGate();
        this.Items[0].posts[this.dataNum - 1].numberOfTrial++;
        this.wrongAnswer.pause();
        this.wrongAnswer.src =
          "../../../lib-native/scientific-terms/audio/false.mp3";
        this.wrongAnswer.play();
      }

      this.finish();
    },

    next: function (event) {
      this.sound.pause();
      if (this.roundQuiz == 1) {
        this.select_textTwo[0]?.classList.remove("roundCorrect");
        this.select_textTwo[0]?.classList.remove("roundWrong");
        this.select_textTwo[0]?.classList.add("roundTwoTheGet");

        Array.from(this.select_pragraph).forEach((ela) => {
          ela.classList.add("opacity-zero");
          ela.classList.remove("opacity-one");
        });
        Array.from(this.select_title).forEach((ela) => {
          ela.classList.add("opacity-zero");
          ela.classList.remove("opacity-one");
        });
        setTimeout(() => {
          Array.from(this.select_pragraph).forEach((ela) => {
            ela.classList.remove("opacity-zero");
            ela.classList.add("opacity-one");
          });
          Array.from(this.select_title).forEach((ela) => {
            ela.classList.add("opacity-one");
            ela.classList.remove("opacity-zero");
          });
          this.sound.pause();
          this.sound.src = "audio/" + this.dataNum + "_r_2.mp3";
          this.sound.play();
        }, 500);
        this.roundQuiz += 1;
      } else if (this.roundQuiz == 2) {
        this.sound.pause();
        Array.from(this.select_pragraph).forEach((ela) => {
          ela.classList.add("opacity-zero");
          ela.classList.remove("opacity-one");
        });
        Array.from(this.select_title).forEach((ela) => {
          ela.classList.add("opacity-zero");
          ela.classList.remove("opacity-one");
        });
        StartPlay.playSegments([500, 260], true);
        setTimeout(() => {
          this.select_textTwo[0]?.classList.remove("roundTwoTheGet");
          this.select_textTwo[0]?.classList.remove("roundCorrect");
          this.select_textTwo[0]?.classList.remove("roundWrong");
        }, 800);
        setTimeout(() => {
          for (let i = 1; i <= 8; i++) {
            animpostId = ["ItemsReady0" + i];
            const animation = animationInstances[animpostId];
            animation.playSegments([0, 60], true);
          }
          this.select_quizRename[0]?.classList.add("show");
        }, 3800);

        setTimeout(() => {
          if (this.Items[0].posts.length != this.dataNum) {
            QandA.playSegments([0, 50], true);
          }

          this.select_QandA.classList.remove("opacity-zero");
          this.select_QandA.classList.add("opacity-one");

          Array.from(this.select_items_p).forEach((ela) => {
            ela.classList.remove("opacity-zero");
            ela.classList.add("opacity-one");
          });

          this.Items[0].posts.forEach((element) => {
            element.seenshow = true;
          });
        }, 3900);
        Array.from(this.select_Light).forEach((ela) => {
          ela.classList.remove("worng");
          ela.classList.remove("right");
        });
        if (this.Items[0].posts.length == this.dataNum) {
          this.select_items[0]?.classList.remove("active");
          this.select_body[0].classList.add("isEnd");
          this.Items[0].posts.forEach((ela) => {
            ela.pointer = true;
          });
        } else {
          this.Items[0].posts.forEach((element, i) => {
            element.isActive = false;
          });
          this.Items[0].posts[this.dataNum].isActive = true;

          setTimeout(() => {
            const defaultAnimation =
              animationInstances[this.Items[0].posts[this.dataNum].id];
            if (defaultAnimation) {
              defaultAnimation.playSegments([60, 120], true);
            }
            this.Items[0].posts[this.dataNum].seeQuiz = true;

            this.Items[0].posts.forEach((ela) => {
              ela.pointer = true;
            });
            this.Items[0].posts[this.dataNum].pointer = false;

            this.dataNum++;
            this.sound.pause();
            this.sound.src = "audio/" + this.dataNum + "_q_1.mp3";
            this.sound.play();
          }, 3900);
        }

        this.roundQuiz = 1;
      }
    },
    /****/
    openTheGate: function () {
      this.select_Light[0]?.classList.add("right");

      QandA.playSegments([50, 0], true);

      for (let i = 1; i <= 8; i++) {
        animpostId = ["ItemsReady0" + i];
        const animation = animationInstances[animpostId];

        animation.playSegments([60, 0], true);
      }

      this.select_items.forEach((ela) => {
        ela.classList.remove("pointer-auto");
        ela.classList.add("pointer-none");
      });
      this.select_items_p.forEach((ela) => {
        ela.classList.remove("opacity-one");
        ela.classList.add("opacity-zero");
      });

      this.Items[0].posts.forEach((element) => {
        element.seenshow = false;
      });
      setTimeout(() => {
        this.select_quizRename[0]?.classList.remove("show");
        this.select_imgs[0]?.classList.add("display_none");
        this.select_text[0]?.classList.add("display_none");
      }, 1000);

      setTimeout(() => {
        this.select_QandA.classList.remove("opacity-one");
        this.select_QandA.classList.add("opacity-zero");
        StartPlay.playSegments([260, 560], true);
      }, 2200);
      setTimeout(() => {
        this.sound.pause();
        this.sound.src = "audio/" + this.dataNum + "_r_1.mp3";
        this.sound.play();
        this.select_textTwo[0]?.classList.add("roundCorrect");
      }, 5000);
      setTimeout(() => {
        Array.from(this.select_pragraph).forEach((ela) => {
          ela.classList.remove("opacity-zero");
          ela.classList.add("opacity-one");
        });
        Array.from(this.select_title).forEach((ela) => {
          ela.classList.remove("opacity-zero");
          ela.classList.add("opacity-one");
        });
      }, 5050);
    },

    closeTheGate: function () {
      Array.from(this.select_Light).forEach((ela) => {
        ela.classList.add("worng");
        ela.classList.remove("right");
      });
      QandA.playSegments([50, 0], true);
      for (let i = 1; i <= 8; i++) {
        animpostId = ["ItemsReady0" + i];
        const animation = animationInstances[animpostId];
        animation.playSegments([60, 0], true);
      }

      this.select_items_p.forEach((ela) => {
        ela.classList.remove("opacity-one");
        ela.classList.add("opacity-zero");
      });
      this.select_items.forEach((ela) => {
        ela.classList.remove("pointer-auto");
        ela.classList.add("pointer-none");
      });

      this.Items[0].posts.forEach((element) => {
        element.seenshow = false;
      });

      setTimeout(() => {
        this.select_quizRename[0]?.classList.remove("show");
        this.select_imgs[0]?.classList.add("display_none");
        this.select_text[0]?.classList.add("display_none");
      }, 1000);

      setTimeout(() => {
        this.select_QandA.classList.remove("opacity-one");
        this.select_QandA.classList.add("opacity-zero");
        StartPlay.playSegments([260, 560], true);
      }, 2200);
      setTimeout(() => {
        this.select_textTwo[0]?.classList.add("roundWrong");
        this.sound.pause();
        this.sound.src = "audio/" + this.dataNum + "_w_1.mp3";
        this.sound.play();
      }, 5000);
      setTimeout(() => {
        Array.from(this.select_pragraph).forEach((ela) => {
          ela.classList.remove("opacity-zero");
          ela.classList.add("opacity-one");
        });
        Array.from(this.select_title).forEach((ela) => {
          ela.classList.remove("opacity-zero");
          ela.classList.add("opacity-one");
        });
      }, 5050);
    },

    /****/
    finish: function () {
      let result = (this.correctLo / this.Items[0].numberOfquestion) * 100;

      (this.Items[0].counterCorrect =
        result == 0
          ? 0
          : result <= 25
          ? 2.5
          : result <= 50
          ? 5
          : result <= 75
          ? 7.5
          : 10),
        direction != ""
          ? globalFunctions.UpdateStudentActivity(
              this.activityId,
              this.Items[0]
            )
          : "";

      finalResponse.submitData(
        JSON.stringify(this.Items[0]),
        (this.Items[0].counterCorrect * 4) / 10,
        this.Items[0].counterCorrect
      );
    },
  },
});
