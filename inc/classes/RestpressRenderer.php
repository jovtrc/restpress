<?php

class RestpressRenderer
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
	 * @return mixed Returns the default page template, or the Restpress template if the condition is true
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

new RestpressRenderer;