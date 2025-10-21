let conversation = document.querySelector("#conversation");
let pageUrl = conversation.getAttribute("data-urlpage");
let playerInstance = null;

new Vue({
  el: "#conversation",
  data: {
    posts: [],
    startLo: false,
    vedioPlay: false,
    questionsStart: false,
    numberOfQuestion: 0,
    currentQuestion: 0,
    activeQuestion: null,
    showChooses: false,
    progress: [0, 0, 0, 0],
    // --------------------------------------------------------
    isLoading: false,
    isSuccess: false,
    dataLoaded: false,
    currentdate: "",
    date: null,
    // --------------------------------------------------------
    assetLink: {
      Dash: "",
      Hsl: "",
    },
    tokenId: "",
    activityId: 0,
    isPlaying: false,
  },
  async create() {},
  async mounted() {
    await this.getData();
    await this.reSize();
    window.addEventListener("resize", this.reSize);
    if (this.posts[0].vedio) {
      const conf = {
        key: "93f21a64-3b8d-4394-88ec-3d24027c5360",
        playback: {
          autoplay: true,
          muted: true,
        },
        ui: true,
      };
      playerInstance = new bitmovin.player.Player(
        document.getElementById("player"),
        conf
      );
      this.vedioStatus();
    }
  },
  methods: {
    startButton() {
      this.numberOfQuestion = this.posts[0].questions.length;
      this.posts[0].questions[this.currentQuestion].active = true;
      this.startLo = true;
      if (!this.posts[0].vedio) {
        this.getQuestions();
      }
      this.startVedio()
    },
    startVedio() {
      this.vedioPlay = true;
      const source = {
        dash: this.posts[0].Dash,
        hls: this.posts[0].Hsl,
      };
      playerInstance.load(source).then(() => {
        bitmovin.playerui.UIFactory.buildDefaultUI(playerInstance, {
          metadata: { markers: this.posts[0].markers },
        });

        playerInstance.on(
          playerInstance.exports.PlayerEvent.TimeChanged,
          () => {
            const current = Math.floor(playerInstance.getCurrentTime());
          }
        );
      });
    },
    closeVedio() {
      playerInstance.pause();
      this.vedioPlay = false;
      this.getQuestions();
    },
    getQuestions() {
      this.questionsStart = true;
      this.activeQuestion = this.posts[0].questions[this.currentQuestion];
    },
    home() {
      location.reload();
    },
    reSize: async function () {
      const container = document.getElementById("container");
      const safeArea = document.getElementById("safeArea");
      const vediocontainer = document.getElementById("player");

      if (!container || !safeArea) return;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const safeWidth = (1550 / 1800) * width;
      const safeHeight = (835 / 1200) * height;
      safeArea.style.position = "absolute";
      safeArea.style.width = `${safeWidth}px`;
      safeArea.style.height = `${safeHeight}px`;
      safeArea.style.left = `${(width - safeWidth) / 2}px`;
      safeArea.style.top = `${(height - safeHeight) / 2}px`;

      if (safeWidth / safeHeight > 16 / 9) {
        vediocontainer.style.height = (safeHeight - 66) + "px";
        vediocontainer.style.width = ((safeHeight - 66) / 9) * 16 + "px";
      } else if (safeWidth/ safeHeight < 16 / 9) {
        vediocontainer.style.height = ((safeWidth - 66)/ 16) * 9 + "px";
        vediocontainer.style.width = (safeWidth - 66) + "px"
      } else {
        vediocontainer.style.height = (safeHeight - 66) + "px";
        vediocontainer.style.width = (safeWidth - 66) + "px"
      }
    },

    getData: async function () {
      this.tokenId = this.getTokenFromURL();
      if (direction == "2") {
        try {
          const response = await returnData;
          this.isSuccess = response.isSuccess;
          response.value.learningObjectAsJson = "";
          this.data = response.value;
          if (this.data.assetName && this.data.assetName.includes("/")) {
            this.data.assetName = this.data.assetName.split("/")[1];
          }
          if (this.data.subjectId && this.data.assetName) {
            await this.fetchAssetManifest(
              this.data.subjectId,
              this.data.assetName
            );
          } else {
            await this.fetchAssetManifest("tst_6r_1a", "oman_ara_02_01_v1");
          }
          ///////////////////////////////
          this.activityId = this.data.activityId;
          if (
            this.data.learningObjectAsJson !== "" &&
            this.data.learningObjectAsJson !== null
          ) {
            let jsonData = JSON.parse(this.data.learningObjectAsJson);
            this.posts[0] = jsonData;
            this.posts[0].Dash = this.assetLink.Dash;
            this.posts[0].Hsl = this.assetLink.Hsl;
            // console.log("Dash online Link:", this.posts[0].Dash);
            // console.log("Hsl online Link:", this.posts[0].Hsl);
          }
        } catch (error) {
          console.error("❌ Error in direction == 2 block:", error);
        }
      } else {
        if (runPage) {
          this.isSuccess = true;
        } else {
          try {
            const response = await returnData;
            this.isSuccess = response.value;
          } catch (error) {
            console.error("❌ Error fetching returnData:", error);
          }
        }
      }

      try {
        const res = await fetch(pageUrl + ".json");
        if (!res.ok) throw new Error("Failed to load local JSON");
        const data = await res.json();
        this.localPosts = data;
      } catch (error) {
        console.error("❌ Error loading local page data:", error);
      }

      if (!Array.isArray(this.posts) || this.posts.length === 0) {
        this.posts = this.localPosts;
        this.posts[0].Dash = this.assetLink.Dash;
        this.posts[0].Hsl = this.assetLink.Hsl;
        console.log(this.posts[0]);
      }
      if (this.posts.length !== 0) {
        setTimeout(() => {
          this.isLoading = true;
          if (!this.posts[0]) this.posts[0] = {};
          this.posts[0].startTime = this.getDate();
        }, 1000);
      } else {
        this.isLoading = false;
      }
    },
    getTokenFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get("token");
    },
    async fetchAssetManifest(subjectId, assetName) {
      try {
        const url =
          baseURL +
          "Curriculum/GetAssetManifests?SubjectId=" +
          subjectId +
          "&AssetName=" +
          assetName;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.tokenId,
          },
        });

        if (!response.ok) {
          throw new Error(
            "Asset manifest fetch failed with status " + response.status
          );
        }

        const data = await response.json();
        console.log("🎯 Asset Manifest Response:", data);

        if (data && data.value) {
          this.assetLink.Dash = data.value.Dash || "";
          this.assetLink.Hsl = data.value.Hsl || "";
          // console.log("🎯:", this.assetLink);
        } else {
          console.warn("⚠️ Unexpected asset manifest response format:", data);
        }
      } catch (error) {
        console.error("❌ Error fetching asset manifest:", error);
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
    togglePlayPause() {
      if (playerInstance) {
        if (this.isPlaying) {
          playerInstance.pause();
        } else {
          playerInstance.play();
        }
      }
    },
    rewindVideo() {
      if (playerInstance) {
        const currentTime = playerInstance.getCurrentTime();
        playerInstance.seek(Math.max(0, currentTime - 10)); // يرجع 10 ثواني
      }
    },
    forwardVideo() {
      if (playerInstance) {
        const currentTime = playerInstance.getCurrentTime();
        const duration = playerInstance.getDuration();
        playerInstance.seek(Math.min(duration, currentTime + 10)); // يقدم 10 ثواني
      }
    },
    vedioStatus() {
      playerInstance.on(bitmovin.player.PlayerEvent.Playing, () => {
        console.log("✅ الفيديو شغال");
        this.isPlaying = true;
      });

      playerInstance.on(bitmovin.player.PlayerEvent.Paused, () => {
        console.log("⏸ الفيديو متوقف مؤقتًا");
        this.isPlaying = false;
      });

      playerInstance.on(bitmovin.player.PlayerEvent.PlaybackFinished, () => {
        console.log("🔁 الفيديو انتهى");
        this.isPlaying = false;
      });
    },
    checkChoose(event, answer) {
      console.log(event.target)
      let correct = checkChoose(
        event,
        answer,
        this.posts[0].upper,
        this.activeQuestion
      )[1];
      correct ? this.trueAnswerChoose() : this.falseAnswerChoose();
    },
    getChooses() {
      this.showChooses = true;
    },
    trueAnswerChoose() {},

    falseAnswerChoose() {},
  },
});
