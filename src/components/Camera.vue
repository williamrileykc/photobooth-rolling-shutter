<!--|== Template =============================================================================== -->
<template>
    <section class="camera">
        <div class="camera__container">
            <video ref="camera" id="camera" :width="camera.width" :height="camera.height"></video>
            <canvas ref="sourceCanvas" id="source-canvas" class="camera__canvas" :width="canvas.width" :height="canvas.height"></canvas>
            <canvas ref="targetCanvas" id="target-canvas" class="camera__canvas" :width="canvas.width" :height="canvas.height"></canvas>
        </div>
    </section>
</template>

<!--|== Scripts ================================================================================ -->
<script>
// import { mapState, mapActions } from "vuex";
export default {
    name: "camera",
    data() {
        return {
            backgrounds: [],
            animationReq: undefined,
            sourceCamera: null,
            sourceVideo: null,
            localStream: undefined,
            backgroundImage: null,
            dpi: null,
            sourceCanvas: null,
            sourceCanvasCtx: null,
            targetCanvas: null,
            targetCanvasCtx: null,
            camera: {
                width: 1080,
                height: 720,
            },
            // orientation: "landscape",
        };
    },

    computed: {
        canvas() {
            return {
                width: 500,
                height: 500,
                aspect: this.camera.width / this.camera.height,
            };
        },
        maxDimension() {
            if (this.camera.width > this.camera.height) {
                return this.camera.height;
            }
            return this.camera.width;
        },
        orientation() {
            return this.camera.width > this.camera.height ? "landscape" : "portrait";
        },
        crop() {
            if (this.orientation == "portrait") {
                return {
                    orientation: "portrait",
                    sx: 0,
                    sy: (this.camera.height - this.camera.width) / 2,
                    sWidth: this.camera.width,
                    sHeight: this.camera.width,
                    dx: 0,
                    dy: 0,
                    dWidth: this.canvas.width,
                    dHeight: this.canvas.height,
                };
            }
            return {
                orientation: "landscape",
                sx: (this.camera.width - this.camera.height) / 2,
                sy: 0,
                sWidth: this.camera.height,
                sHeight: this.camera.height,
                dx: 0,
                dy: 0,
                dWidth: this.canvas.width,
                dHeight: this.canvas.height,
            };
        },
        deviceID() {
            if (this.cameraID != undefined) {
                return this.cameraID;
            }
            return "camera";
        },
        videoConstraints() {
            return {
                audio: false,
                video: {
                    deviceId: this.deviceID,
                    width: this.camera.width,
                    height: this.camera.height,
                },
            };
        },
    },
    methods: {
        initAll: function() {
            // ==|== Vars - Camera =====================================================================
            // eslint-disable-next-line no-undef
            this.sourceVideo = this.$refs.camera;
            this.sourceVideo.width = this.camera.width;
            this.sourceVideo.height = this.camera.height;
            this.dpi = window.devicePixelRatio;
            this.sourceCanvas = this.$refs.sourceCanvas;

            this.sourceCanvasCtx = this.sourceCanvas.getContext("2d");
            this.targetCanvas = this.$refs.targetCanvas;

            this.targetCanvasCtx = this.targetCanvas.getContext("2d");
            this.resetCamera();
            console.dir(this.crop);
            this.startAnimation();
        },
        startAnimation() {
            const animationStep = () => {
                if (this.sourceVideo) {
                    this.sourceCanvasCtx.save();
                    this.sourceCanvasCtx.translate(this.canvas.width, 0);
                    this.sourceCanvasCtx.scale(-1, 1);
                    this.sourceCanvasCtx.drawImage(this.sourceVideo, this.crop.sx, this.crop.sy, this.crop.sWidth, this.crop.sHeight, this.crop.dx, this.crop.dy, this.crop.dWidth, this.crop.dHeight);
                    this.sourceCanvasCtx.restore();
                }

                // Target Canvas
                // this.targetCanvasCtx.fillStyle = "white";
                // this.targetCanvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                // if (this.sourceCanvas) {
                //     this.targetCanvasCtx.save();
                //     this.targetCanvasCtx.drawImage(this.sourceCanvas, this.crop.sx, this.crop.sy, this.crop.sWidth, this.crop.sHeight, this.crop.dx, this.crop.dy, this.crop.dWidth, this.crop.dHeight);
                //     this.targetCanvasCtx.restore();
                // }
                this.animationReq = requestAnimationFrame(animationStep);
            };
            this.animationReq = requestAnimationFrame(animationStep);
        },

        resetCamera: function() {
            if (typeof this.localStream !== "undefined") {
                this.stopMediaTracks(this.localStream);
            }
            navigator.mediaDevices
                .getUserMedia(this.videoConstraints)
                .then(this.streamMedia)
                .catch(this.handleError);
        },
        streamMedia: function(stream) {
            this.localStream = stream;
            let track = this.localStream.getVideoTracks()[0];
            this.camera.width = track.getSettings().width;
            this.camera.height = track.getSettings().height;

            this.sourceVideo.srcObject = this.localStream;
            this.sourceVideo.onloadedmetadata = () => {
                this.sourceVideo.play();
            };
        },
    },
    mounted() {
        window.cancelAnimationFrame(this.animationReq);
        this.initAll();
    },
};
</script>

<!--|== CSS ==================================================================================== -->
<style lang="scss">
#camera,
#target-canvas {
    display: none;
}
</style>
