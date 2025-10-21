var inputValidation = document.querySelector("#Dictation");
var pageUrl = inputValidation.getAttribute("data-urlpage");
new Vue({
  el: "#Dictation",
  data: {
    posts: [
      {
        LOcorrectcounter: 0,
        counterCorrect: 0,
        loTargets: null,
        numberOfquestion: null,
        start: false,
        show_info_content: false,
        screen_content: false,
        keybord: [""],
        kebord_active: false,
        info_start: [""],
        info_content: "",
        countItem: 0,
        count_true: "",
        active_next: false,
        sound_play_word: "",
        title_endScreen: "",
        partArray: [],
        evaluation: "",
        language: true,
        comparison_player: [
          {
            originalWord: "",
            doWord: "",
            resultWord: null,
            answerShow: false,
            startTime: "",
            endTime: "",
          },
        ],
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
        loDegree: null,
        UserDegree: null,
        SubType: "Input",
        startTime: "",
        endTime: "",
        // --------------------------------------------------------
      },
    ],
    // --------------------------------------------------------
    isLoaded: false,
    isSuccess: false,
    activityId: 0,
    dataLoaded: false,
    currentdate: "",
    data: null,
    // --------------------------------------------------------
  },

  async mounted() {
    await this.getData();
    // this.getUnits();
  },
  created() {
    window.addEventListener("keydown", this.handleKeyDown);
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
        // let data;
        await returnData.then((response) => {
          this.isSuccess = response.isSuccess;
          this.data = response.value;
          // console.log(this.data);

          if (
            this.data.learningObjectAsJson != "" &&
            this.data.learningObjectAsJson != null
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);
            this.posts[0] = jsonData;
            this.dataLoaded = true;

            // ((this.posts[0] = jsonData), (this.dataLoaded = true))
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
      !this.dataloaded
        ? fetch(pageUrl + ".json")
          .then((res) => res.json())
          .then((data) => {
            // resData = data
            this.posts = data;
            this.posts[0].partArray = this.posts[0].info_content
              .trim()
              .split(" ");
            const arrayWatch = [];
            this.posts[0].partArray.map(function (element, i) {
              var comparison_player = {};
              comparison_player.originalWord = element;
              comparison_player.doWord = "";
              comparison_player.resultWord = null;
              comparison_player.answerShow = false;
              comparison_player.startTime = "";
              comparison_player.endTime = "";
              // --------------------------------------------------------
              comparison_player.numberOfTrial = 0;
              comparison_player.questionlevel = 0;
              comparison_player.questionType = "text";
              comparison_player.answersType = "text";
              comparison_player.BloomLevel = 1;
              // --------------------------------------------------------
              arrayWatch.push(comparison_player);
            });
            this.posts[0].comparison_player = arrayWatch;
            this.posts[0].numberOfquestion = this.posts[0].partArray.length;
          })
        : "";
      this.posts.length != 0
        ? setTimeout(() => {
          this.isLoaded = true;
          this.posts[0].startTime = this.getDate();
        }, 1000)
        : (this.isLoaded = false);
      // this.posts = resData;
    },
    // getUnits: function () {
    //   const loading = document.getElementById("loading");
    //   loading.classList.add("none");
    // },

    play_effect: function () {
      const answer_player_screen = document.getElementById("answer_player");
      const keybord_active = document.getElementById("keybord_control");
      const keybord_active_screen = document.getElementById("t_key");
      const deActive2 = document.getElementById("infoScreen");
      if (innerHeight > innerWidth) {
        setTimeout(() => {
          deActive2.classList.remove("disabled");
          answer_player_screen.classList.add("active");
          answer_player.playSegments([0, 45], true);
        }, 1000);
        setTimeout(() => {
          keybord_active.classList.add("active");
          keybord_active_screen.classList.add("active");
        }, 2500);
        setTimeout(() => {
          this.sound_word();
        }, 4000);
      } else {
        deActive2.classList.remove("disabled");
        answer_player_screen.classList.add("active");
        answer_player.playSegments([0, 45], true);
        setTimeout(() => {
          keybord_active.classList.add("active");
          keybord_active_screen.classList.add("active");
        }, 2000);
        setTimeout(() => {
          answer_player_screen.classList.add("activeKey");
          this.sound_word();
        }, 4000);
      }
    },

    clickstart() {
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
      this.posts[0].start = true;
      this.posts[0].show_info_content = true;
      infoScreen.playSegments([0, 80], true);
      const deActive = document.getElementById("content_active");
      const deActive_bg = document.querySelectorAll(".first_bg");
      deActive_bg.forEach((deActive) => {
        deActive.classList.add("none");
      });

      setTimeout(() => {
        deActive.classList.remove("none");
      }, 1000);
      /**/
      var ply = document.getElementById("audio");
      document.getElementById("audio").setAttribute("autoplay", "auto");
      var new_audio = "./audio/hint/click_btn.mp3";
      ply.src = new_audio;
      /**/
      finalResponse.submitData(
        JSON.stringify(this.posts),
        1,
        this.posts[0].counterCorrect
      );
    },

    click_show_info_content: function () {
      this.posts[0].show_info_content = false;
      const timerElement = document.getElementById("timing");
      const deActive = document.getElementById("content_active");
      let timer;
      let change = this.posts[0];
      animation_play = false;

      if (!this.posts[0].active_next) {
        this.posts[0].active_next = true;
        this.posts[0].info_start = "";
        const message = this.posts[0].info_content;
        const typingPromises = (message, timeout) =>
          [...message].map(
            (ch, i) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve(message.substring(0, i + 1));
                }, timeout * i);
              })
          );

        typingPromises(message, 140).forEach((promise) => {
          promise.then((portion) => {
            document.getElementById("timeTest").innerHTML = portion;
          });
        });

        function startTimeCountDown() {
          var str = JSON.stringify(change.info_content);
          const numWords = str.trim().split(/\s+/).length;
          timer = numWords;
          const timeCountdown = setInterval(() => countdown(), 1000);
        }

        function countdown() {
          if (timer == 0) {
            timerElement.classList.add("disabled");
            clearTimeout(timer);
          } else {
            timerElement.innerHTML = timer;
            timer--;
          }
          if (timer == 0 && animation_play == false) {
            animation_play = true;
            setTimeout(() => {
              innerHeight > innerWidth
                ? infoScreen.playSegments([80, 0], true)
                : false;
              deActive.classList.add("none");
              const answer_player_screen =
                document.getElementById("answer_player");
              const keybord_active = document.getElementById("keybord_control");
              const keybord_active_screen = document.getElementById("t_key");
              const deActive2 = document.getElementById("infoScreen");
              if (innerHeight > innerWidth) {
                setTimeout(() => {
                  deActive2.classList.remove("disabled");
                  answer_player_screen.classList.add("active");
                  answer_player.playSegments([0, 45], true);
                }, 1000);
                setTimeout(() => {
                  keybord_active.classList.add("active");
                  keybord_active_screen.classList.add("active");
                }, 2500);
              } else {
                deActive2.classList.remove("disabled");
                answer_player_screen.classList.add("active");
                answer_player.playSegments([0, 45], true);
                setTimeout(() => {
                  keybord_active.classList.add("active");
                  keybord_active_screen.classList.add("active");
                }, 2000);
              }
            }, 1000);
            setTimeout(() => {
              countItem_2 = 1;
              var ply = document.getElementById("audio");
              var keybord_control = document.getElementById("keybord_control");
              document.getElementById("audio").setAttribute("autoplay", "auto");
              const answer_player_screen =
                document.getElementById("answer_player");
              var oldSrc = ply.src;
              if (keybord_control.classList.contains("disable")) {
                var new_audio = "./audio/hint/a100.mp3";
              } else {
                var new_audio = "./audio/hint/a" + countItem_2 + ".mp3";
              }
              ply.src = new_audio;
              change.comparison_player[0].startTime =
                new Date().toLocaleTimeString();
              // console.log(change.comparison_player[0].startTime);
              answer_player_screen.classList.add("activeKey");
            }, 4000);
          }
        }
        startTimeCountDown();
      } else {
        deActive.classList.add("none");
        if (animation_play == false) {
          animation_play = true;
          innerHeight > innerWidth
            ? infoScreen.playSegments([80, 0], true)
            : infoScreen.playSegments([45, 45], true);
        }

        this.play_effect();
      }
    },
    /**/

    answer_player_letter: function (event, parag) {
      this.posts[0].comparison_player[this.posts[0].countItem].doWord += parag;
      length_doWord =
        this.posts[0].comparison_player[this.posts[0].countItem].doWord.length;
      length_originalWord =
        this.posts[0].comparison_player[this.posts[0].countItem].originalWord
          .length;
      this.posts[0].language = "Ara";

      if (length_doWord == length_originalWord + 2) {
        this.remove_letter();
      }

      const boxes = document.querySelectorAll(".show_hint");
      boxes.forEach((box) => {
        box.classList.add("none");
      });
    },

    handleKeyDown(event) {
      el = event.key;
      merged = this.posts[0].keybord;
      event.key ? event.preventDefault() : conaole.log();
      if (
        document.getElementById("answer_player").classList.contains("activeKey")
      ) {
        if (merged.includes(el)) {
          this.posts[0].comparison_player[this.posts[0].countItem].doWord +=
            event.key;
          length_doWord =
            this.posts[0].comparison_player[this.posts[0].countItem].doWord
              .length;
          length_originalWord =
            this.posts[0].comparison_player[this.posts[0].countItem]
              .originalWord.length;
          this.posts[0].language = true;
          if (length_doWord == length_originalWord + 2) {
            this.remove_letter();
            this.posts[0].language = true;
          }
        } else if (event.keyCode == 8) {
          this.remove_letter();
          this.posts[0].language = true;
        } else if (event.which == 13 || event.which == 32) {
          this.answer_click();
          this.posts[0].language = true;
        } else if (
          event.which == 18 ||
          event.which == 16 ||
          event.which == 17 ||
          event.which == 27
        ) {
          event.preventDefault();
        } else {
          function checkRTL(event) {
            var ltrChars =
              "A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF" +
              "\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF",
              rtlChars = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC",
              rtlDirCheck = new RegExp(
                "^[^" + ltrChars + "]*[" + rtlChars + "]"
              );

            return rtlDirCheck.test(el);
          }
          var isRTL = checkRTL(String.fromCharCode(el.charCode));
          this.posts[0].language = isRTL;
        }
      } else {
        event.preventDefault();
      }
      const boxes = document.querySelectorAll(".show_hint");
      boxes.forEach((box) => {
        box.classList.add("none");
      });
    },
    UpdateStudentActivity() {
      direction != ""
        ? globalFunctions.UpdateStudentActivity(this.activityId, this.posts[0])
        : "";
    },
    answer_click: function () {
      let index = this.posts[0].countItem;
      let doWord = this.posts[0].comparison_player[index].doWord
        .toString()
        .trim();
      originalWord = this.posts[0].comparison_player[index].originalWord
        .toString()
        .trim();
      this.posts[0].language = "Ara";

      Verification = doWord == originalWord;
      if (doWord == "") {
        doWord = ".....";
      }
      this.posts[0].comparison_player[index].doWord = doWord;
      this.posts[0].comparison_player[index].resultWord = Verification;
      this.posts[0].comparison_player[index].answerShow = true;
      if (Verification) {
        this.posts[0].count_true++;
        this.posts[0].LOcorrectcounter = this.posts[0].count_true

        let result =
          (this.posts[0].count_true / this.posts[0].numberOfquestion) * 100;

        this.posts[0].counterCorrect =
          result == 0
            ? 0
            : result <= 25
              ? 2.5
              : result <= 50
                ? 5
                : result <= 75
                  ? 7.5
                  : 10;

        this.posts[0].endTime = this.getDate();


      }else{
        this.posts[0].LOcorrectcounter = this.posts[0].count_true;
        let result =
        (this.posts[0].count_true / this.posts[0].numberOfquestion) * 100;

      this.posts[0].counterCorrect =
        result == 0
          ? 0
          : result <= 25
          ? 2.5
          : result <= 50
          ? 5
          : result <= 75
          ? 7.5
          : 10;

      this.posts[0].endTime = this.getDate();

        this.posts[0].comparison_player[index].numberOfTrial = 1;
    
      }
      finalResponse.submitData(
        JSON.stringify(this.posts),
        1,
        this.posts[0].counterCorrect
      );
      if (this.posts[0].partArray.length - 1 == this.posts[0].countItem) {
        const keybord_active = document.getElementById("keybord_control");
        const keybord_active_screen = document.getElementById("t_key");
        const endScreen_active = document.getElementById("endScreen");
        const evaluation_progress = document.getElementById(
          "evaluation_progress"
        );
        const answer_player_screen = document.getElementById("answer_player");
        const finsh = document.getElementById("finshed");
        const finsh_but = document.getElementById("finshed_but");
        keybord_active.classList.add("disable");
        answer_player_screen.classList.remove("activeKey");
        this.sound_word();
        this.posts[0].comparison_player[index].endTime =
          new Date().toLocaleTimeString();
        // console.log(this.posts[0].comparison_player[index].endTime);
        setTimeout(() => {
          keybord_active.classList.add("none");
          keybord_active_screen.classList.add("none");
          endScreen_active.classList.add("active");
          evaluation_progress.classList.add("active");
        }, 1000);
        const percent = Math.round(
          (this.posts[0].count_true / this.posts[0].partArray.length) * 100
        )
          .toString()
          .trim();
        if (percent >= 85) {
          this.posts[0].evaluation = "يفوق التوقعات";
          setTimeout(() => {
            progressBar.playSegments([0, 45], true);
          }, 1000);

          setTimeout(() => {
            answer_player.playSegments([80, 0], true);
            endScreen_active.classList.remove("active");
            keybord_active_screen.classList.remove("active");
            answer_player_screen.classList.add("none");
            finsh.classList.add("active");
            const deActive_bg = document.querySelectorAll(".first_bg");
            deActive_bg.forEach((deActive) => {
              deActive.classList.remove("none");
            });
          }, 8000);
          setTimeout(() => {
            finshed.playSegments([0, 20], true);
          }, 9000);
          setTimeout(() => {
            finsh_but.classList.add("active");
          }, 10000);
          finalResponse.submitData(
            JSON.stringify(this.posts),
            4,
            this.posts[0].counterCorrect
          );
        } else {
          if (percent <= 84 && percent > 65) {
            setTimeout(() => {
              progressBar.playSegments([0, 38], true);
            }, 1000);
            this.posts[0].evaluation = "جيد";
          } else if (percent <= 65 && percent >= 50) {
            this.posts[0].evaluation = "مقبول";
            setTimeout(() => {
              progressBar.playSegments([0, 29], true);
            }, 1000);
          } else if (percent < 50 && percent > 0) {
            this.posts[0].evaluation = "ضعيف";
            setTimeout(() => {
              progressBar.playSegments([0, 23], true);
            }, 1000);
          } else if (percent == 0) {
            this.posts[0].evaluation = "ضعيف";
            setTimeout(() => {
              progressBar.playSegments([0, 1], true);
            }, 1000);
          }
        
        }
      } else {
        this.posts[0].countItem++;
        this.sound_word();
        this.posts[0].comparison_player[index].endTime =
          new Date().toLocaleTimeString();
        // console.log(this.posts[0].comparison_player[index].endTime);
     
      }
      this.UpdateStudentActivity();
    },

    click_letter: function (event, index) {
      const boxes = document.querySelectorAll(".show_hint");
      boxes.forEach((box) => {
        box.classList.add("none");
      });
      event.target.classList.remove("none");
      event.target.classList.add("show_hint");
    },

    remove_letter: function () {
      let arr = [];
      arr = this.posts[0].comparison_player[this.posts[0].countItem].doWord
        .toString()
        .trim()
        .split("");
      arr.splice(-1, 1);
      this.posts[0].comparison_player[this.posts[0].countItem].doWord =
        arr.join("");
      this.posts[0].language = "Ara";
    },

    sound_word: function () {
      countItem_2 = this.posts[0].countItem + 1;
      var ply = document.getElementById("audio");
      var keybord_control = document.getElementById("keybord_control");
      document.getElementById("audio").setAttribute("autoplay", "auto");
      var oldSrc = ply.src;
      if (keybord_control.classList.contains("disable")) {
        var new_audio = "./audio/hint/a100.mp3";
      } else {
        var new_audio = "./audio/hint/a" + countItem_2 + ".mp3";
        this.posts[0].comparison_player[countItem_2 - 1].startTime =
          new Date().toLocaleTimeString();
        // console.log(this.posts[0].comparison_player[countItem_2 - 1].startTime);
        // console.log(this.posts[0].comparison_player);
      }
      ply.src = new_audio;

      // let audio = document.querySelector('audio');
      // let playSoundimg = document.querySelector('.sound_repeat');
      // if (audio.paused && playSoundimg.classList.contains("paused")) {
      //     audio.pause();
      //     playSoundimg.classList.remove("paused");
      // } else {
      //     audio.play();
      //     playSoundimg.classList.add("paused");

      // }
      // audio.onended = function() {
      //     playSoundimg.classList.remove("paused");
      // };
    },

    reload: function () {
      window.location.reload();
    },
  },
});
