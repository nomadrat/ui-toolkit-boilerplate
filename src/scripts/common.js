import { _ } from "./utils/_utils";
import { $ } from "./utils/_dom";
import { api } from "./api/api";
import { handleError } from "./api/errors";

window.__handleError = handleError;
window._ = _;
window.$ = $;
window.__api = api;


function doShit(response, $form, event) {

}

function dataProcessor(formData, $form, event) {

}

api.withForm('#form', 'auth.sms.verify', doShit, dataProcessor);
