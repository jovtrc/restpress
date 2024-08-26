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

if (!defined("RESTPRESS_PLUGIN_URL")) {
	define("RESTPRESS_PLUGIN_URL", plugin_dir_url(__FILE__));
}

if (!defined("RESTPRESS_PLUGIN_FALLBACK_ICON")) {
	define("RESTPRESS_PLUGIN_FALLBACK_ICON", "");
}

require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressAdminSettings.php';
require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressAssets.php';

class Restpress
{
	public function __construct()
	{
		add_action('init', [$this, 'restpressRewriteRule']);
		add_filter('query_vars', [$this, 'restpressQueryVars']);
		add_filter('template_include', [$this, 'restpressTemplate']);
		add_filter('wp_title', [$this, 'restpressPageTitle']);
		add_filter('document_title_parts', [$this, 'restpressPageTitle']);
	}

	/**
	 * Add Restpress base rewrite rule
	 *
	 * @return void
	 */
	public function restpressRewriteRule(): void
	{
		add_rewrite_rule(
			'api-docs?.*$',
			'index.php?restpress_init=true',
			'top'
		);
	}

	/**
	 * Add Restpress base query vars
	 *
	 * @param array $queryVars Existing query vars
	 *
	 * @return array All query vars, including the Restpress one
	 */
	public function restpressQueryVars(array $queryVars): array
	{
		$queryVars[] = 'restpress_init';
		return $queryVars;
	}

	/**
	 * Verifies if the Restpress query var is present and renders it
	 *
	 * @param mixed $template Default page template
	 *
	 * @return mixed Returns the default page template, or the Restpress template, if the condition is true
	 */
	public function restpressTemplate(mixed $template): mixed
	{
		$shouldInitRestpress = get_query_var('restpress_init');

		if (empty($shouldInitRestpress)) {
			return $template;
		}

		add_action('wp_enqueue_scripts', ['RestpressAssets', 'enqueue']);

		return RESTPRESS_PLUGIN_DIR . '/inc/templates/restpress.php';
	}

	/**
	 * Modifies the title of the Restpress page
	 *
	 * @param array|string $title Default page title
	 *
	 * @return array|string Modified page title if Restpress is initialized. Default page title if not.
	 */
	public function restpressPageTitle(array|string $title): array|string
	{
		$shouldInitRestpress = get_query_var('restpress_init');

		if (empty($shouldInitRestpress)) {
			return $title;
		}

		$options   = get_option('restpress_options');
		$newPageTitle = !empty($options['docs_page_title']) ? $options['docs_page_title'] : "API Docs | Restpress";

		if (is_array($title)) {
			$title["title"] = $newPageTitle;
		} else {
			$title = $newPageTitle;
		}

		return $title;
	}
}

new Restpress;
