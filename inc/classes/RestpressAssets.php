<?php

class RestpressAssets
{
	/**
	 * Enqueues the Restpress assets
	 *
	 * @return void
	 */
	public static function enqueue(): void
	{
		global $wp_filesystem;

		if (empty($wp_filesystem)) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
			WP_Filesystem();
		}

		$assetsDir       = RESTPRESS_PLUGIN_URL . 'dist/';
		$manifestFile    = RESTPRESS_PLUGIN_DIR . '/dist/.vite/manifest.json';
		$manifestContent = $wp_filesystem->get_contents($manifestFile);

		$manifestData    = json_decode($manifestContent, true);
		$manifestData    = $manifestData["index.html"];

		$restpressScript = $assetsDir . $manifestData["file"];

		wp_enqueue_script(
			"main-restpress-script",
			$restpressScript,
			[],
			RESTPRESS_PLUGIN_VER,
			["in_footer" => true]
		);

		self::enqueueConfig();

		foreach ($manifestData["css"] as $index => $cssFile) {
			$styleUrl = $assetsDir . $cssFile;
			wp_enqueue_style("restpress-style-" . $index, $styleUrl, [], RESTPRESS_PLUGIN_VER);
		}
	}

	private static function enqueueConfig(): void
	{
		$options = get_option('restpress_options');
		$iconUrl = get_site_icon_url(64, RESTPRESS_PLUGIN_FALLBACK_ICON);

		$config = [
			'site_base_url' => home_url(),
			'api_base_url'  => get_rest_url(),
			'namespaces'    => '',
			'site_icon'     => $iconUrl,
			'nonce'         => wp_create_nonce('wp_rest'),
		];

		$config = wp_parse_args($options, $config);

		wp_add_inline_script(
			'main-restpress-script',
			sprintf('var restpress = %s', wp_json_encode($config)),
			'before'
		);
	}
}
