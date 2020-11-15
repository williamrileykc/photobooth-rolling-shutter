<!--|== Template =============================================================================== -->
<template>
    <div class="pose">
        <h2>Pose For Your Shot</h2>
        <section class="interior-black">
            <Camera></Camera>
            <aside class="interior-black__aside">
                <Countdown class="pose__countdown"></Countdown>
                <div class="pose__btns">
                    <transition name="fade" mode="out-in">
                        <div class="pose__btn pose__btn--continue" v-if="picturePreviewReady" @touchstart="confirmSavePhoto()">
                            Continue
                        </div>
                    </transition>
                    <transition name="fade" mode="out-in">
                        <div class="pose__btn pose__btn--capture" v-if="startButtonVisible" @touchstart="triggerCapture()">
                            Start
                        </div>
                    </transition>
                    <transition name="fade" mode="out-in">
                        <div class="pose__btn pose__btn--retake" v-if="picturePreviewReady" @touchstart="triggerRetake()">
                            Retake
                        </div>
                    </transition>
                </div>
            </aside>
        </section>
        <Loader ref="loader" class="loader-spinner"></Loader>
    </div>
</template>

<!--|== Scripts ================================================================================ -->
<script>
import Camera from "@/components/Camera.vue";
import Countdown from "@/components/Countdown.vue";
import Flash from "@/components/Flash.vue";
import Loader from "@/components/Loader.vue";
import { mapState, mapActions } from "vuex";
export default {
    name: "Pose",
    components: {
        Camera,
        Countdown,
        Flash,
        Loader,
    },
    data() {
        return {
            startButtonVisible: true,
        };
    },
    computed: {
        ...mapState({
            pictureCountdownRunning: (state) => state.camera.pictureCountdownRunning,
            pictureTaking: (state) => state.camera.pictureTaking,
            picturePreviewReady: (state) => state.camera.picturePreviewReady,
            photoSaved: (state) => state.photos.photoSaved,
        }),
        captureBtnText() {
            if (this.picturePreviewReady == true) {
                return "Retake";
            }
            return "Start";
        },
    },
    methods: {
        ...mapActions(["setPictureCountdownRunning", "setPictureTaking", "setPicturePreviewReady", "setFlashTrigger", "setSavePhoto", "setPhotoSaved"]),
        triggerRetake() {
            this.setPictureTaking(false);
            this.setPicturePreviewReady(false);
            this.setFlashTrigger(false);
        },
        triggerCapture() {
            this.setPictureCountdownRunning(true);
        },
        confirmSavePhoto() {
            this.$refs.loader.showLoader();
            this.setSavePhoto(true);
        },
        goToSelect() {
            this.$router.push({ name: "select" });
        },
        resetCameraAll() {
            this.setPictureCountdownRunning(false);
            this.setPictureTaking(false);
            this.setPicturePreviewReady(false);
            this.setFlashTrigger(false);
            this.setPhotoSaved(false);
        },
        startButtonVisibleTest() {
            if (this.pictureCountdownRunning == true || this.picturePreviewReady == true) {
                this.startButtonVisible = false;
            } else {
                this.startButtonVisible = true;
            }
        },
    },
    beforeDestroy() {
        this.resetCameraAll();
    },
    watch: {
        photoSaved(isSaved) {
            if (isSaved == true) {
                this.goToSelect();
            }
        },
        pictureCountdownRunning() {
            this.startButtonVisibleTest();
        },
        picturePreviewReady() {
            this.startButtonVisibleTest();
        },
    },
};
</script>

<!--|== CSS ==================================================================================== -->
<style lang="scss">
.pose {
    &__countdown {
        @include centererX();
        top: 85px;
    }
    &__btns {
        position: absolute;
        top: 770px;
        left: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    &__btn {
        &.pose__btn--capture,
        &.pose__btn--continue {
            @include textButtonClear();
            @include centererX();
            top: 0;
        }
        &.pose__btn--retake {
            @include textButtonWhite();
            @include centererX();
            top: 175px;
            margin-top: 70px;
        }
    }
}
</style>
