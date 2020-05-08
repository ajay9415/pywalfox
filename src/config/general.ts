export const MIN_REQUIRED_DAEMON_VERSION = 2.0;
export const PYWAL_PALETTE_LENGTH = 18;
export const DEFAULT_CSS_FONT_SIZE = 14;

export const ENABLED_BODY_CLASS = 'applied';
export const DUCKDUCKGO_THEME_ID = 'pywalfox';
export const INJECT_URL_PATTERN = [ "*://*.duckduckgo.com/*" ];

export const UPDATE_PAGE_URL = 'dist/update.html';
export const SETTINGS_PAGE_URL = 'dist/settings.html';

export const VALID_CSS_TARGETS = [
  "userChrome",
  "userContent"
];

export const EXTERNAL_MESSAGES = {
  COLORSCHEME: "colors",
  DISABLED: "disabled"
};

export const EXTENSION_MESSAGES = {
  INITIAL_DATA_GET: "initial:data:get",
  INITIAL_DATA_SET: "initial:data:set",
  DEBUGGING_INFO_GET: "debugging:info:get",
  DEBUGGING_INFO_SET: "debugging:info:set",
  DEBUGGING_OUTPUT: "debugging:output",
  TEMPLATE_SET: "template:set",
  TEMPLATE_GET: "template:get",
  THEME_FETCH: "theme:fetch",
  THEME_DISABLE: "theme:disable",
  THEME_SET: "theme:set",
  THEME_MODE_SET: "theme:mode:set",
  THEME_MODE_GET: "theme:mode:get",
  PALETTE_COLOR_SET: "palette:color:set",
  PALETTE_COLOR_GET: "palette:color:get",
  PALETTE_TEMPLATE_SET: "palette:template:set",
  PALETTE_TEMPLATE_GET: "palette:template:get",
  THEME_TEMPLATE_SET: "theme:template:set",
  THEME_TEMPLATE_GET: "theme:template:get",
  PYWAL_COLORS_GET: "pywal:colors:get",
  PYWAL_COLORS_SET: "pywal:colors:set",
  OPTION_GET: "option:get",
  OPTION_SET: "option:set",
  FONT_SIZE_SET: "font:size:set",
  FONT_SIZE_GET: "font:size:get",
  NOTIFCATION: "notification",
  CSS_ENABLE: "css:enable",
  CSS_DISABLE: "css:disable",
  CSS_ENABLE_SUCCESS: "css:enable:success",
  CSS_ENABLE_FAILED: "css:enable:failed",
  CSS_DISABLE_SUCCESS: "css:disable:success",
  CSS_DISABLE_FAILED: "css:disable:failed",
  DDG_THEME_GET: "ddg:theme:get",
  DDG_THEME_SET: "ddg:theme:set",
  DDG_THEME_RESET: "ddg:theme:reset",
};

export const EXTENSION_OPTIONS = {
  FONT_SIZE: "fontSize",
  USER_CHROME: "userChrome",
  USER_CONTENT: "userContent",
  DUCKDUCKGO: "duckduckgo",
};