<?php
/**
 * Plugin Name:       Restpress
 * Description:       The automated REST API docs generator
 * Plugin URI:        https://www.restpress.org
 * Author:            João Carvalho
 * Author URI:        https://joaoc.dev
 * Version:           0.0.1
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * Requires at least: 6.3
 */

if (!defined("RESTPRESS_PLUGIN_VER")) {
	define("RESTPRESS_PLUGIN_VER", '0.0.1');
}

if (!defined("RESTPRESS_PLUGIN_DIR")) {
	define("RESTPRESS_PLUGIN_DIR", __DIR__);
}

if (!defined("RESTPRESS_PLUGIN_FILE")) {
	define("RESTPRESS_PLUGIN_FILE", __FILE__);
}

if (!defined("RESTPRESS_PLUGIN_URL")) {
	define("RESTPRESS_PLUGIN_URL", plugin_dir_url(__FILE__));
}

if (!defined("RESTPRESS_PLUGIN_FALLBACK_ICON")) {
	define("RESTPRESS_PLUGIN_FALLBACK_ICON", "");
}

require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressOptions.php';
require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressRenderer.php';
require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressAdminSettings.php';
require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressAssets.php';
require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressActivationHandler.php';
