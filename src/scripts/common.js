import { _ } from "./utils/_utils";
import { $ } from "./utils/_dom";
import { api } from "./api/api";
import { handleError } from "./api/errors";

window.__handleError = handleError;
window._ = _;
window.$ = $;
window.__api = api;
