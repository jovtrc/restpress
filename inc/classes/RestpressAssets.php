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
		$options = RestpressOptions::get();

		wp_add_inline_script(
			'main-restpress-script',
			sprintf('var restpress = %s', wp_json_encode($options)),
			'before'
		);
	}
}
