"use strict";
(() => {
var exports = {};
exports.id = 565;
exports.ids = [565];
exports.modules = {

/***/ 245:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ handler)
});

;// CONCATENATED MODULE: external "replicate"
const external_replicate_namespaceObject = require("replicate");
var external_replicate_default = /*#__PURE__*/__webpack_require__.n(external_replicate_namespaceObject);
;// CONCATENATED MODULE: ./pages/api/generate.js

async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const { prompt  } = req.body;
    const replicate = new (external_replicate_default())({
        auth: process.env.REPLICATE_API_TOKEN
    });
    try {
        const output = await replicate.run("stability-ai/stable-diffusion:db21e45e2c50842f8d7f3581b9c2a44fae9053b4", {
            input: {
                prompt
            }
        });
        res.status(200).json({
            imageUrl: output[0]
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to generate image"
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(245));
module.exports = __webpack_exports__;

})();