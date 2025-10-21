const crossWord = document.querySelector("#crossWord");
const pageUrl = crossWord.getAttribute("data-urlpage");

let vue = new Vue({
  el: "#crossWord",
  data: {
    clickNumber: 0,
    keyWordsClicked: [],
    RowNumLine: 20,
    ColumnNumLine: 15,
    QuizName: "",
    stateQuiz: 1,
    Items: [
      {
        counterCorrect: 0,
        loTargets: null,
        numberOfquestion: null,
        loCorrectCounter: 0,
        posts: [],

        // --------------------------------------------------------
        id: "",
        subjectId: "",
        conceptId: "",
        unitId: "",
        lessonId: "",
        title: "",
        keywords: "",
        learningObjectives: "",
        BloomLevels: [],
        type: "",
        LODegree: 0,
        UserDegree: null,
        SubType: "Input",
        startTime: "",
        endTime: "",
        // --------------------------------------------------------
      },
    ],
    bgAudio: new Audio(),
    clickBtn: new Audio(),
    hint: new Audio(),
    sound: new Audio(),
    narration: new Audio(),
    bgMusic: false,
    counter: -1,
    // --------------------------------------------------------
    isLoaded: false,
    isSuccess: false,
    activityId: 0,
    dataLoaded: false,
    currentdate: "",
    data: null,
    grade:4,
    // --------------------------------------------------------
    correct: 0,
  },

  async mounted() {
    await this.getData();
    this.bgAudio.src = "../../../lib-native/crossword_6r/audio/music.mp3";

    this.clickBtn.src = "../../../lib-native/crossword_6r/audio/click_btn.mp3";
    finalResponse.submitData(JSON.stringify(this.Items[0]), 1, 0);
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

          console.log(this.data);

          if (
            this.data.learningObjectAsJson != "" &&
            this.data.learningObjectAsJson != null
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);
            this.Items[0].posts = jsonData.posts;
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
      var jsonRes = [
        pageUrl + ".json",
        "../../../lib-native/crossword_6r/content/json/keys.json",
      ];
      !this.dataloaded
        ? jsonRes.forEach(async (json, i) => {
            await fetch(json)
              .then((res) => res.json())
              .then((data) => {
                i == 0
                  ? (this.Items[0].posts = data)
                  : (this.keyWordsClicked = data);
              });
          })
        : "";

      this.Items.length != 0
        ? setTimeout(() => {
            this.isLoaded = true;
            this.Items[0].startTime = this.getDate();
            this.Items[0].counterCorrect = 0;
          }, 1000)
        : (this.isLoaded = false);
    },
    muteMusic() {
      this.bgMusic = !this.bgMusic;
      this.bgAudio.loop = true;
      this.bgAudio.paused ? this.bgAudio.play() : this.bgAudio.pause();
    },
    startTime: function (index) {
      this.counter += 1;
      this.Items[0].posts[index - 1].startTime = this.getDate();
    },

    endTime: function (index) {
      this.Items[0].endTime = this.getDate();
      this.Items[0].posts[index - 1].endTime = this.getDate();
    },

    finish: function () {
      let result =
        (this.Items[0].loCorrectCounter / this.Items[0].numberOfquestion) * 100;
      this.Items[0].counterCorrect =
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
        JSON.stringify(this.Items[0]),
        (this.Items[0].counterCorrect * 4) / 10,
        this.Items[0].counterCorrect
      );
    },
    startClickGame: function () {
      this.muteMusic();
      
      this.Items[0].numberOfquestion = this.Items[0].posts.length;
      finalResponse.submitData(JSON.stringify(this.Items[0]), 1);
      console.log(this.Items[0].numberOfquestion);
      document.querySelectorAll(".startButton").forEach((button) => {
        button.style.display = "none";
      });
      document.querySelectorAll(".table, .music ").forEach((element) => {
        element.style.display = "flex";
      });
      document.querySelectorAll(".item").forEach((item) => {
        var t = Math.floor(50 * Math.random());
        var e = Math.floor(100 * Math.random());
        item.style.webkitTransform = "translate(" + t + "vw, " + e + "vw)";
        item.style.mozTransform = "translate(" + t + "vw, " + e + "vw)";
      });

      var posts = this.Items[0].posts;
      posts.forEach(function (post, index) {
        var a = index + 1;
        if (post.conditionState === "Row") {
          var o = post.numberStateCol;
          for (let t = 0; t <= post.wordId.length; t++) {
            if (t === 0) {
              document
                .querySelector(
                  '.item[data-col="' +
                    o +
                    '"][data-row="' +
                    post.numberStateRow +
                    '"]'
                )
                .classList.add("Button");
              document.querySelector(
                '.item[data-col="' +
                  o +
                  '"][data-row="' +
                  post.numberStateRow +
                  '"]'
              ).textContent = a.toString();
              document
                .querySelector(
                  '.item[data-col="' +
                    o +
                    '"][data-row="' +
                    post.numberStateRow +
                    '"]'
                )
                .setAttribute("id", "boxNumber" + a);
              document
                .querySelector(
                  '.item[data-col="' +
                    o +
                    '"][data-row="' +
                    post.numberStateRow +
                    '"]'
                )
                .setAttribute("data-question", a);
              document
                .querySelector(
                  '.item[data-col="' +
                    o +
                    '"][data-row="' +
                    post.numberStateRow +
                    '"]'
                )
                .setAttribute("data-name", post.wordId);
            } else {
              let i = post.wordId.toString().trim().split("");
              for (let s = 0; s < i.length; s++)
                document
                  .querySelector(
                    '.item[data-col="' +
                      o +
                      '"][data-row="' +
                      post.numberStateRow +
                      '"]'
                  )
                  .classList.add("solidBox", "boxNumber" + a);
              document.querySelector(
                '.item[data-col="' +
                  o +
                  '"][data-row="' +
                  post.numberStateRow +
                  '"]'
              ).textContent = i[t - 1];
            }
            o += 1;
          }
        } else {
          var i = post.numberStateRow;
          for (let t = 0; t <= post.wordId.length; t++) {
            if (t === 0) {
              document
                .querySelector(
                  '.item[data-col="' +
                    post.numberStateCol +
                    '"][data-row="' +
                    i +
                    '"]'
                )
                .classList.add("Button");
              document.querySelector(
                '.item[data-col="' +
                  post.numberStateCol +
                  '"][data-row="' +
                  i +
                  '"]'
              ).textContent = a.toString();
              document
                .querySelector(
                  '.item[data-col="' +
                    post.numberStateCol +
                    '"][data-row="' +
                    i +
                    '"]'
                )
                .setAttribute("id", "boxNumber" + a);
              document
                .querySelector(
                  '.item[data-col="' +
                    post.numberStateCol +
                    '"][data-row="' +
                    i +
                    '"]'
                )
                .setAttribute("data-question", a);
              document
                .querySelector(
                  '.item[data-col="' +
                    post.numberStateCol +
                    '"][data-row="' +
                    i +
                    '"]'
                )
                .setAttribute("data-name", post.wordId);
            } else {
              let o = post.wordId.toString().trim().split("");
              for (let s = 0; s < o.length; s++)
                document
                  .querySelector(
                    '.item[data-col="' +
                      post.numberStateCol +
                      '"][data-row="' +
                      i +
                      '"]'
                  )
                  .classList.add("solidBox", "boxNumber" + a);
              for (let s = 0; s < o.length; s++)
                document.querySelector(
                  '.item[data-col="' +
                    post.numberStateCol +
                    '"][data-row="' +
                    i +
                    '"]'
                ).textContent = o[t - 1];
            }
            i += 1;
          }
        }
      });

      setTimeout(function () {
        document.querySelectorAll(".item").forEach(function (item) {
          item.style.webkitTransform = "translate(0 , 0)";
          item.style.MozTransform = "translate(0, 0)";
          item.style.opacity = 1;
        });
      }, 0);

      setTimeout(() => {
        
        this.hint.src = "../../../lib-native/crossword_6r/audio/hint.mp3";
        this.hint.play();
        document.getElementById("boxNumber1").classList.add("help");
      }, 1000);
       
      this.sound.src = "../../../lib-native/crossword_6r/audio/click_btn.mp3";
      this.sound.play();
    },

    MouseMoveItem() {
      document.getElementById("boxNumber1").classList.remove("help");
      let t = event.target.getAttribute("data-question");
      var e = event.target.id;
      document.querySelectorAll("." + e).forEach((element) => {
        element.classList.add("active");
      });
      document.querySelectorAll(".item.Button").forEach((item) => {
        item.style.pointerEvents = "none";
      });
      setTimeout(() => {
        document.querySelectorAll(".table").forEach((element) => {
          element.style.opacity = 0;
          element.style.pointerEvents = "none";
        });
        document.querySelectorAll(".keyWords").forEach((element) => {
          element.style.opacity = 1;
          element.style.pointerEvents = "auto";
        });
        animation.playSegments([0, 60], true);
      }, 1000);
      setTimeout(function () {
        document.querySelectorAll(".item").forEach(function (item) {
          var t = Math.floor(50 * Math.random());
          item.style.webkitTransform = "translate(" + t + "vw, " + t + "vw)";
          item.style.MozTransform = "translate(" + t + "vw, " + t + "vw)";
          item.classList.remove("active");
        });
        document.querySelectorAll(".wordSplit").forEach((element) => {
          element.style.pointerEvents = "auto";
        });
        document.querySelectorAll(".enter").forEach((element) => {
          element.style.pointerEvents = "auto";
        });
      }, 1500);
      this.clickNumber = t;
      this.Items[0].posts[this.clickNumber - 1].activeClass = true;
      let a = event.target.getAttribute("data-name");
      let o = event.target
        .getAttribute("data-name")
        .toString()
        .trim()
        .split("");

      setTimeout(() => {
        document.querySelectorAll(".keyWords .topQuiz").forEach((item) => {
          item.style.opacity = 1;
        });
        document.querySelectorAll(".keyWords .downKey").forEach((item, i) => {
          item.style.opacity = 1;
        });

        document.querySelectorAll(".item.Button").forEach((item) => {
          if (!item.classList.contains("closed")) {
            item.style.pointerEvents = "auto";
          }
        });
      }, 2500);
      setTimeout(() => {
        document.querySelector("button.back").style.opacity = 1;
        document.querySelector("button.back").style.pointerEvents = "auto";
      }, 2000);

      setTimeout(() => {
        let t = "";
        for (let i = 0; i < a.length; i++) {
          let element = document.querySelectorAll("." + e)[i];
          if (element.classList.contains("Finshed")) {
            t += '<div class="item-True">' + o[i] + "</div>";
          } else {
            t +=
              '<div class="item-Square" data-character="' + o[i] + '"></div>';
          }
        }
        document.querySelectorAll(".items-Squares").forEach((item) => {
          item.classList.remove("active");

          item.innerHTML = t;
          item.classList.add("active");
        });
    
      }, 2500);
      document.querySelectorAll(".jkey").forEach((element) => {
        element.style.pointerEvents = "none";
      });
      setTimeout(() => {
        document.querySelectorAll(".jkey").forEach((element) => {
          element.style.opacity = 1;
          element.style.pointerEvents = "auto";
        });
      }, 2600);

      this.sound.pause();
      this.sound.src = "../../../lib-native/crossword_6r/audio/click_btn.mp3";
      this.sound.play();
    },

    charactersClicked: function () {
      this.sound.pause();
      this.sound.src = "../../../lib-native/crossword_6r/audio/click_btn.mp3";
      this.sound.play();

      if (this.stateQuiz === 2) {
        document
          .querySelectorAll(".item-Square")
          .forEach(function (itemSquare) {
            itemSquare.textContent = "";
            itemSquare.classList.remove("True", "False");
          });
        this.QuizName = "";
        this.stateQuiz = 1;
      }

      if (
        document.querySelectorAll(".item-Square").length >=
        this.QuizName.length + 1
      ) {
        let t = event.target.textContent;
        this.QuizName += t;

        for (let i = 1; i <= this.QuizName.length; i++) {
          let e = document.querySelectorAll(".item-Square")[i - 1];
          e.textContent = this.QuizName[i - 1];
        }
      }
    },
    wordSplitClicked: function () {
      this.sound.pause();
      this.sound.src = "../../../lib-native/crossword_6r/audio/click_btn.mp3";
      this.sound.play();
      if (this.stateQuiz === 2) {
        document
          .querySelectorAll(".item-Square")
          .forEach(function (itemSquare) {
            itemSquare.textContent = "";
            itemSquare.classList.remove("True", "False");
          });
        this.QuizName = "";
        this.stateQuiz = 1;
      }

      document.querySelectorAll(".item-Square").forEach(function (itemSquare) {
        itemSquare.textContent = "";
      });

      if (this.QuizName !== "") {
        this.QuizName = this.QuizName.slice(0, -1);
        for (let i = 1; i <= this.QuizName.length; i++) {
          let e = document.querySelectorAll(".item-Square")[i - 1];
          e.textContent = this.QuizName[i - 1];
        }
      }
    },

    checkValue: function () {
      let result = 0;
 

      document.querySelectorAll(".readaudioPlay").forEach(function (audio) {
        audio.pause();
        audio.currentTime = 0;
      });

      if (this.QuizName !== "") {
        document
          .querySelectorAll(".item-Square")
          .forEach(function (itemSquare) {
            if (itemSquare.dataset.character === itemSquare.textContent) {
              itemSquare.classList.add("True");
            } else {
              itemSquare.classList.add("False");
            }
          });
      } else {
        document
          .querySelectorAll(".item-Square")
          .forEach(function (itemSquare) {
            itemSquare.classList.add("False");
          });
      }

      this.stateQuiz = 2;
      if (
        document.querySelectorAll(".item-Square").length ===
        document.querySelectorAll(".item-Square.True").length
      ) {
        let clickNumber = this.clickNumber;
        vue.endTime(clickNumber);
        document
          .querySelector("#boxNumber" + this.clickNumber)
          .classList.add("Finshed");
        document
          .querySelectorAll(".boxNumber" + this.clickNumber)
          .forEach(function (boxNumber) {
            boxNumber.classList.add("Finshed");
          });
        this.correct += 1;
        result = (this.correct / this.Items[0].numberOfquestion) * 100;
        this.Items[0].counterCorrect =
          result === 0
            ? 0
            : result <= 25
            ? 2.5
            : result <= 50
            ? 5
            : result <= 75
            ? 7.5
            : 10;
        finalResponse.submitData(
          JSON.stringify(this.Items[0]),
          (this.Items[0].counterCorrect * 4) / 10,
          this.Items[0].counterCorrect
        );
        this.Items[0].loCorrectCounter = this.correct;

        if (direction !== "") {
          globalFunctions.UpdateStudentActivity(this.activityId, this.Items[0]);
        }
        document
          .querySelectorAll(".keyWords .topQuiz, .keyWords .downKey")
          .forEach(function (element) {
            element.style.opacity = 0;
            element.style.pointerEvents = "none";
          });
        animation.playSegments([50, 0], true);
   
        setTimeout(function () {
          document.querySelector("#feedBack").style.opacity = 1;
          document.querySelector("#feedBack").style.pointerEvents = "auto";
          document.querySelector("button.back").style.opacity = 0;
          document.querySelector("button.back").style.pointerEvents = "none";
          feedBack.playSegments([0, 50], true);
        }, 900);

       var self = this;  
       this.narration.pause();
        setTimeout(function () {
          document
            .querySelectorAll(".wonderFul, .GoHome")
            .forEach(function (element) {
              element.style.opacity = 1;
              element.style.pointerEvents = "auto";
            });
            if (self.narration) {
              self.narration.src = "audio/hint/" + self.clickNumber + "_a1.mp3";
              self.narration.play();
          } 
        }, 1700);


        document.querySelectorAll(".jkey, .wordSplit, .enter").forEach((element) => {
          element.style.pointerEvents = "none";
        });
       
      } else {
        this.narration.pause();
        this.narration.src = "audio/hint/" + this.clickNumber + "_a2.mp3";
        this.narration.play();
      }
    },

    GoToHome: function () {
      this.narration.pause();
      document
        .querySelectorAll(".keyWords .topQuiz, .keyWords .downKey")
        .forEach(function (element) {
          element.style.opacity = 0;
          element.style.pointerEvents = "none";
        });
      animation.playSegments([50, 0], true);
      setTimeout(function () {
        document.querySelectorAll(".item").forEach(function (item) {
          item.style.webkitTransform = "translate(0, 0)";
          item.style.MozTransform = "translate(0, 0)";
          item.style.opacity = 1;
        });
        document.querySelector(".table").style.opacity = 1;
        document.querySelector(".table").style.pointerEvents = "auto";
      }, 1200);
      setTimeout(function () {
        document
          .querySelectorAll(".keyWords, button.back, .jkey")
          .forEach(function (element) {
            element.style.opacity = 0;
            element.style.pointerEvents = "none";
          });
      }, 1600);
      this.Items[0].posts[this.clickNumber - 1].activeClass = false;
      this.QuizName = "";
      this.sound.pause();
    },

    ClickBack: function () {
      this.narration.pause();
      this.sound.src = "../../../lib-native/crossword_6r/audio/click_btn.mp3";
      this.sound.play();
      
      finalResponse.submitData(JSON.stringify(this.Items[0]), 1);
      feedBack.playSegments([50, 0], true);
      document
        .querySelectorAll("#feedBack, button.GoHome")
        .forEach(function (element) {
          element.style.opacity = 0;
          element.style.pointerEvents = "none";
        });
        var self = this; 
      setTimeout(function () {
    
        document.querySelectorAll(".item").forEach(function (item) {
          item.style.webkitTransform = "translate(0, 0)";
          item.style.MozTransform = "translate(0, 0)";
          item.style.opacity = 1;
        });
        document
          .querySelectorAll(".keyWords, button.back, .jkey")
          .forEach(function (element) {
            element.style.opacity = 0;
            element.style.pointerEvents = "none";
          });
        document.querySelector(".table").style.opacity = 1;
        document.querySelector(".table").style.pointerEvents = "auto";
      }, 1500);
      this.Items[0].posts[this.clickNumber - 1].activeClass = false;
      this.QuizName = "";
      setTimeout(function () {
        if (
          document.querySelectorAll(".Button").length ==
          document.querySelectorAll(".Button.Finshed").length
        ) {
          document.getElementById("crossWord").classList.add("FinshedLo");
          feedBackEnd.playSegments([0, 50], true);
          setTimeout(function () {
            window.parent.postMessage({ code: 4 }, "*");
            document.querySelector("button.ReloadPage").style.opacity = 1;
            document.querySelector("button.ReloadPage").style.pointerEvents =
              "auto";
          }, 1500);
        }
      }, 4000);
    },
    ReloadPage: function () {
      location.reload(!0);
    },
  },
});
