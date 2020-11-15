<!--|== Template =============================================================================== -->
<template>
  <section ref="loaderContainer" class="loader-container">
    <div class="loader-box">
      <svg
        version="1.1"
        ref="loader"
        id="loader"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        style="enable-background:new 0 0 100 100;"
        xml:space="preserve"
      >
        <circle ref="loaderPath" id="loaderPath" cx="50" cy="50" r="45" />
        <circle ref="loaderFill" id="loaderFill" cx="50" cy="50" r="45" />
      </svg>
    </div>
  </section>
</template>

<!--|== Scripts ================================================================================ -->
<script>
import anime from "animejs";

export default {
  name: "Loader",
  data() {
    return {
      container: null,
      loader: null,
      loaderPath: null,
      loaderFill: null,
      tlLoader: null
    };
  },
  methods: {
    showLoader: function() {
      anime({
        targets: this.container,
        opacity: 1,
        delay: 0,
        duration: 250,
        easing: "linear"
      });
    },
    hideLoader: function() {
      anime({
        targets: this.container,
        opacity: 0,
        delay: 0,
        duration: 250,
        easing: "linear"
      });
    }
  },
  mounted() {
    this.container = this.$refs.loaderContainer;
    this.flash = this.$refs.flash;
    this.loader = this.$refs.loader;
    this.loaderPath = this.$refs.loaderPath;
    this.loaderFill = this.$refs.loaderFill;
  }
};
</script>

<!--|== CSS ==================================================================================== -->
<style lang="scss">
.loader-container {
  background: rgba(black, 0.5);
  width: 100vw;
  height: 100vh;
  display: flex;
  top: 0;
  left: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 40;
  pointer-events: none;
  opacity: 0;
}

.loader-box {
  @include centerer();
  width: 500px;
  height: 500px;
}

#loader {
  width: 500px;
  height: 500px;
  transform-origin: center;
  animation: 2s linear infinite svg--animation;
}

@keyframes svg--animation {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(360deg);
  }
}

#loaderFill,
#loaderPath {
  fill: none;
  stroke-miterlimit: 10;

  transform: rotate(-90deg);
}
#loaderPath {
  stroke: $black;
  // loaderFill: $white;
}
#loaderFill {
  stroke: $white;
  stroke-width: 10;
  stroke-dashoffset: 75;
  stroke-dasharray: 280;
  stroke-linecap: round;
  transform-origin: 50% 50%;

  animation: 1.4s ease-in-out infinite both circle--animation;
}

@keyframes circle--animation {
  // Start with short dash for 25% of animation.
  0%,
  25% {
    stroke-dashoffset: 280;
    transform: rotate(0);
  }

  // Very long dash, slightly rotated for 25% of animation.
  // This is the "head" of the stroke getting away from the tail.
  50%,
  75% {
    stroke-dashoffset: 75;
    transform: rotate(45deg);
  }

  // Back to short dash, rotated back to starting position.
  // This is the "tail" of the stroke catching up to the head.
  // The stroke moves backwards while at the same time the
  // entire circle is rotated forward to return to its
  // starting position.
  100% {
    stroke-dashoffset: 280;
    transform: rotate(360deg);
  }
}
#loaderPath {
  stroke-width: 10;
}
</style>
