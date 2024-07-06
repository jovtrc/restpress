<?php
/**
 * Plugin Name: Restpress
 * Description: An automated WordPress API docs generator
 * Plugin URI: https://github.com/jovtrc/restpress
 * Author: João Carvalho
 * Author URI: https://joaoc.dev
 * Version: 0.0.1
 * License: GPLv2 or later
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

require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressAdminSettings.php';
require_once RESTPRESS_PLUGIN_DIR . '/inc/classes/RestpressAssets.php';

class Restpress
{
	public function __construct()
	{
		add_action('init', [$this, 'restpressRewriteRule']);
		add_filter('query_vars', [$this, 'restpressQueryVars']);
		add_filter('template_include', [$this, 'restpressTemplate']);
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
		$videoOnlyQuery = get_query_var('restpress_init');

		if (empty($videoOnlyQuery)) {
			return $template;
		}

		add_action('wp_enqueue_scripts', ['RestpressAssets', 'enqueue']);

		return RESTPRESS_PLUGIN_DIR . '/inc/templates/restpress.php';
	}
}

new Restpress;
