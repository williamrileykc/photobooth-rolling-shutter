<!--|== Template =============================================================================== -->
<template>
    <section class="camera">
        <div class="camera__container">
            <video ref="camera" id="camera" src="" :width="camera.width" :height="camera.height"></video>
            <canvas ref="sourceCanvas" id="source-canvas" class="camera__canvas" :width="camera.width" :height="camera.height"></canvas>
            <canvas ref="targetCanvas" id="target-canvas" class="camera__canvas" :width="canvas.width" :height="canvas.height" :class="{ 'target-canvas__visible': picturePreviewReady == true }"></canvas>
        </div>
    </section>
</template>

<!--|== Scripts ================================================================================ -->
<script>
import { mapState, mapActions } from "vuex";

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
        };
    },
    computed: {
        ...mapState({
            videoDevices: (state) => state.videoDevices,
            cameraID: (state) => state.ID,
            pictureTaking: (state) => state.pictureTaking,
            picturePreviewReady: (state) => state.picturePreviewReady,
            // photoFolder: (state) => state.photos.photoFolder,
            // photoUrl: (state) => state.photos.photoUrl,
            // savePhoto: (state) => state.photos.savePhoto,
        }),

        canvas() {
            return {
                width: 500,
                height: 500,
                aspect: this.camera.width / this.camera.height,
            };
        },
        camera() {
            return {
                width: 1080,
                height: 1080,
                zoomLevel: 1,
                zoomFactor: 1,
            };
        },

        zoomAdjust() {
            return {
                pos: this.camera.zoom * Math.ceil(this.camera.zoomFactor / 2),
                cam: this.camera.zoom * this.camera.zoomFactor,
            };
        },

        dyAdjust() {
            if (this.canvas.height - this.camera.height - this.zoomAdjust.cam <= 0) {
                return 0;
            }
            return this.canvas.height - this.camera.height - this.zoomAdjust.pos;
        },

        syAdjust() {
            if (this.canvas.height - this.camera.height - this.zoomAdjust.cam > 0) {
                return 0;
            }
            return Math.abs(this.canvas.height - this.camera.height - this.zoomAdjust.cam);
        },

        crop() {
            return {
                sx: (this.camera.width - this.canvas.width + this.zoomAdjust.cam) / 2,
                sy: this.syAdjust,
                sWidth: this.canvas.width - this.zoomAdjust.cam,
                sHeight: this.canvas.height - this.zoomAdjust.cam,
                dx: 0,
                dy: this.dyAdjust,
                dWidth: this.canvas.width,
                dHeight: this.canvas.height,
            };
        },
        cropArray() {
            return [0, 0];
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
        ...mapActions(["setPictureTaking", "setPicturePreviewReady", "setSavePhoto", "setPhotoSaved"]),

        startAnimation() {
            const animationStep = () => {
                if (this.sourceVideo) {
                    this.sourceCanvasCtx.save();
                    // this.sourceCanvasCtx.translate(this.camera.width, this.camera.height);
                    // this.sourceCanvasCtx.rotate(Math.PI * 1);
                    this.sourceCanvasCtx.drawImage(this.sourceVideo, 0, 0, this.camera.width, this.camera.height);
                    this.sourceCanvasCtx.restore();
                }

                // Target Canvas
                this.targetCanvasCtx.fillStyle = "white";
                this.targetCanvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                if (this.sourceCanvas) {
                    this.targetCanvasCtx.save();
                    this.targetCanvasCtx.drawImage(this.sourceCanvas, this.crop.sx, this.crop.sy, this.crop.sWidth, this.crop.sHeight, this.crop.dx, this.crop.dy, this.crop.dWidth, this.crop.dHeight);
                    this.targetCanvasCtx.restore();
                }
                this.animationReq = requestAnimationFrame(animationStep);
            };
            this.animationReq = requestAnimationFrame(animationStep);
        },

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

            this.startAnimation();
        },
        // setCanvasDimensions: function(element) {
        //     element.width = this.canvas.width;
        //     element.height = this.canvas.height;
        // },

        // postPreviewPhoto: function() {
        //     window.cancelAnimationFrame(this.animationReq);
        //     this.animationReq = undefined;
        //     this.setPicturePreviewReady(true);
        // },

        // // Init Camera
        // setVideoID: function(id) {
        //     this.deviceID = id;
        //     this.resetCamera();
        // },
        // handleError: function(error) {
        //     console.log("navigator.getUserMedia error: ", error.message, error.name);
        // },

        stopMediaTracks: function() {
            this.localStream.getTracks().forEach((track) => {
                track.stop();
            });
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
            let test = track.getSettings().width;
            console.dir(test);

            this.sourceVideo.srcObject = this.localStream;
            this.sourceVideo.onloadedmetadata = () => {
                this.sourceVideo.play();
            };
        },

        // // Photo Taking
        // async writePhoto() {
        //     return new Promise((resolve, reject) => {
        //         const url = this.targetCanvas.toDataURL("image/jpeg", 0.5);
        //         const base64Data = url.replace(/^data:image\/jpeg;base64,/, "");

        //         fs.createWriteStream(this.photoUrl);
        //         fs.writeFile(this.photoUrl, base64Data, "base64", (err) => {
        //             if (err) reject(err);
        //             resolve(this.photoUrl);
        //         });
        //     });
        // },

        // photoSaveComplete() {
        //     this.setSavePhoto(false);
        //     this.setPhotoSaved(true);
        // },
    },
    mounted() {
        window.cancelAnimationFrame(this.animationReq);
        this.initAll();
    },
    beforeDestroy() {
        window.cancelAnimationFrame(this.animationReq);
        this.stopMediaTracks();
    },
    watch: {
        pictureTaking(taking) {
            if (taking == true) {
                this.postPreviewPhoto();
            }
        },
    },
};
</script>

<!--|== CSS ==================================================================================== -->
<style lang="scss">
.camera {
    &__flash {
        background-color: $white;
        position: fixed;
        top: 0;
        left: 0;
        opacity: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2000;
    }
    &__look {
        z-index: 500;
    }
    &__timebar {
        z-index: 499;
    }
    &__container {
        text-align: center;
        z-index: 10;
        #camera,
        #source-canvas {
            // display: none;
        }
        #camera {
            display: none;
            position: absolute;
            top: 85px;
            left: 0;
        }
        #source-canvas {
            // display: none;
        }
        #source-canvas,
        #target-canvas {
            // display: none;
            position: absolute;
            left: 85px;
            top: 85px;
            z-index: 10;
        }
        #target-canvas {
            display: none;
            &.target-canvas__visible {
                display: block;
            }
        }
    }
    &__canvas {
        // width: 1080px;
        // height: 1080px;
    }
}
</style>
