// module.exports = {
//   css: {
//     loaderOptions: {
//       sass: {
//         data: `@import "@/assets/scss/main.scss";`
//       }
//     }
//   }
// };

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: "@import '@/assets/scss/main.scss';"
      }
    }
  }
};