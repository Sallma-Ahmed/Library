new Vue({
  el: "#Dictation",
  data: {
    posts: [
      {
        LOcorrectcounter: 0,
        counterCorrect: 0,
        loTargets: null,
        randomNumber: null,
        numberOfquestion: null,
        start: false,
        show_info_content: false,
        screen_content: false,
        keybord: [""],
        kebord_active: false,
        info_start: [""],
        info_content: "",
        countItem: 0,
        count_true: 0,
        active_next: false,
        sound_play_word: "",
        title_endScreen: "",
        partArray: [],
        comparison_player: [
          {
            originalWord: "",
            doWord: "",
            resultWord: null,
            answerShow: false,
            fontsize: 0,
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
        keyWords: "",
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

    showOptions: false,

    activeOptionIndex: null,
    longPressTimer: null,
    touchStartY: null,
    options: [
      {
        id: 1,
        key: "ُ",
      },
      {
        id: 2,
        key: "َ",
      },
      {
        id: 3,
        key: "ِ",
      },
      {
        id: 4,
        key: "ٍ",
      },
      {
        id: 5,
        key: "ْ",
      },
      {
        id: 6,
        key: "ً",
      },
      {
        id: 7,
        key: "ّ",
      },
      {
        id: 8,
        key: "ٌ",
      },
    ],
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
      var inputValidation = document.querySelector("#Dictation");
      var pageUrl = inputValidation.getAttribute("data-urlpage");
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
              // console.log(data);
              this.posts[0].partArray = this.posts[0].info_content
                .trim()
                .split(" ");
              const arrayWatch = [];
              this.posts[0].partArray.map(function (element, i) {
                var comparison_player = {};
                comparison_player.originalWord = element;
                comparison_player.doWord = "";
                comparison_player.resultWord = null;
                comparison_player.fontsize = data.fontsize;
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
          this.sound_word();
          answer_player_screen.classList.add("activeKey");
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
      finalResponse.submitData(
        JSON.stringify(this.posts),
        1,
        this.posts[0].counterCorrect
      );

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
      console.log(
        "this.posts[0].numberOfquestion = " + this.posts[0].partArray.length
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

        // function startTimeCountDown() {
        //   var str = JSON.stringify(change.info_content);
        //   const numWords = str.trim().split(/\s+/).length;
        //   const buffer = Math.ceil(numWords * 0.20);
        //   timer = numWords + buffer;
        //   const timeCountdown = setInterval(() => countdown(), 1000);
        // }
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
              answer_player_screen.classList.add("activeKey");
              // console.log(change.comparison_player[0].startTime);
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
      length_doWord =
        this.posts[0].comparison_player[this.posts[0].countItem].doWord.length;
      length_originalWord =
        this.posts[0].comparison_player[this.posts[0].countItem].originalWord
          .length;

      if (length_doWord >= length_originalWord + 2) {
      } else {
        this.posts[0].comparison_player[this.posts[0].countItem].doWord +=
          parag;
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
          if (length_doWord >= length_originalWord + 2) {
            this.remove_letter();
          }
        }
        if (event.keyCode == 8) {
          this.remove_letter();
        }
        if (event.which == 13 || event.which == 32) {
          this.answer_click();
        }
      } else {
        event.preventDefault();
      }
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

      Verification = doWord == originalWord;
      if (doWord == "") {
        doWord = ".....";
      }
      this.posts[0].comparison_player[index].doWord = doWord;
      this.posts[0].comparison_player[index].resultWord = Verification;
      this.posts[0].comparison_player[index].fontsize = this.posts[0].fontsize;
      this.posts[0].comparison_player[index].answerShow = true;
      if (Verification) {
        this.posts[0].count_true++;
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
        }, 1000);
        const percent = Math.round(
          (this.posts[0].count_true / this.posts[0].partArray.length) * 100
        )
          .toString()
          .trim();
        if (percent >= 85) {
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
      }
      ply.src = new_audio;
    },

    reload: function () {
      window.location.reload();
    },
    // <!-- -- -- -- -- -- -- --  -->

    startLongPress(event) {
      event.preventDefault();
      this.longPressTimer = setTimeout(() => {
        this.showOptions = true;
        this.activeOptionIndex = 0;
        event.preventDefault();
      }, 100);
    },

    endLongPress(event) {
      clearTimeout(this.longPressTimer);
      if (this.activeOptionIndex !== null) {
        const selectedOption = this.options[this.activeOptionIndex];
        this.selectOption(selectedOption);
      }
      this.showOptions = false;
      this.activeOptionIndex = null;
      event.preventDefault();
    },

    cancelLongPress() {
      this.resetLongPress();
    },

    resetLongPress() {
      clearTimeout(this.longPressTimer);
      this.showOptions = false;
      this.activeOptionIndex = null;
    },

    selectOption(option) {
      // console.log(option.key + " selected");
      this.answer_player_letter(0, option.key);
    },

    updateActiveOption(index) {
      this.activeOptionIndex = index;
    },

    updateActiveOptionOnTouchMove(event) {
      if (!this.showOptions || event.touches.length === 0) return;

      let touchX = event.touches[0].clientX;
      let touchY = event.touches[0].clientY;
      let optionsElements = Array.from(
        this.$el.querySelectorAll(".option-popup button")
      );

      let newIndex = optionsElements.findIndex((element) => {
        let rect = element.getBoundingClientRect();
        return (
          touchX >= rect.left &&
          touchX <= rect.right &&
          touchY >= rect.top &&
          touchY <= rect.bottom
        );
      });

      if (newIndex !== -1) {
        this.activeOptionIndex = newIndex;
      }
    },

    getLetterImage(option) {
      return `../../../lib-native/dictation_6r/images/${option.id}.png`;
    },
  },
});
