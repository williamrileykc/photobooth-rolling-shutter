<template>
    <div id="app">
        <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
        <router-view />
    </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "App",
    computed: {
        ...mapState({
            videoDevices: (state) => state.videoDevices,
        }),
    },
    methods: {
        ...mapActions(["setVideoDevices", "setCameraID"]),
        detectVideoDevices: function() {
            initialize().then(() => {
                this.setVideoDevices(self.localVideoDevices);
                this.setExternalCamera();
            });
            async function initialize() {
                const devices = await navigator.mediaDevices.enumerateDevices();
                self.localVideoDevices = devices.filter((device) => device.kind === "videoinput");
            }
        },
        setExternalCamera: function() {
            this.videoDevices.forEach((device) => {
                const searchString = device.label.toUpperCase();
                const n = searchString.search("BRIO");
                if (n > -1) {
                    this.setCameraID(device.deviceId);
                }
            });
        },
    },
    mounted() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "S") {
                this.$router.push({ name: "Settings" });
            }
        });
        navigator.mediaDevices.enumerateDevices().then(this.detectVideoDevices);
    },
};
</script>
<style lang="scss">
// @import "@/assets/scss/main";

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
</style>
