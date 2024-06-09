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
		$assetsDir       = RESTPRESS_PLUGIN_URL . 'dist/';
		$manifestFile    = RESTPRESS_PLUGIN_DIR . '/dist/.vite/manifest.json';
		$manifestContent = file_get_contents($manifestFile);

		$manifestData    = json_decode($manifestContent, true);
		$manifestData    = $manifestData["index.html"];

		$restpressScript = $assetsDir . $manifestData["file"];
		wp_enqueue_script("restpress-script", $restpressScript, [], RESTPRESS_PLUGIN_VER);

		self::enqueueConfig();

		foreach ($manifestData["css"] as $index => $cssFile) {
			$styleUrl = $assetsDir . $cssFile;
			wp_enqueue_style("restpress-style-" . $index, $styleUrl, [], RESTPRESS_PLUGIN_VER);
		}
	}

	private static function enqueueConfig(): void
	{
		$options = get_option('restpress_options');
		$logoUrl = false;

		if (current_theme_supports('custom-logo') && has_custom_logo()) {
			$logoId  = get_theme_mod('custom_logo');
			$logoUrl = wp_get_attachment_image_url($logoId, [200,200]);
		}

		$config = [
			'site_base_url' => home_url(),
			'api_base_url'  => get_rest_url(),
			'namespaces'    => '',
			'site_logo'     => $logoUrl,
			'nonce'         => wp_create_nonce( 'wp_rest' ),
		];

		$config = wp_parse_args($options, $config);

		wp_add_inline_script(
			'restpress-script',
			sprintf('var restpress = %s', wp_json_encode($config)),
			'before'
		);
	}
}
