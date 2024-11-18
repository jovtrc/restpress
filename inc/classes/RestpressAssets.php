<?php
/**
 * Handles the enqueuing of assets for the Restpress plugin.
 */
class RestpressAssets
{
    /**
     * Enqueues JavaScript and CSS assets for the Restpress plugin.
     *
     * Loads the main JavaScript file and associated CSS files as defined
     * in the Vite manifest file. Also includes plugin configuration as an inline script.
     *
     * @return void
     */
	public static function enqueue(): void
	{
		$assetsDirUrl = RESTPRESS_PLUGIN_URL . 'dist/';
        $manifestData = self::getManifestData();

		wp_enqueue_script(
			"main-restpress-script",
            $assetsDirUrl . $manifestData["file"],
			[],
			RESTPRESS_PLUGIN_VER,
			["in_footer" => true]
		);

		self::enqueueOptions();

		foreach ($manifestData["css"] as $index => $cssFile) {
			$styleUrl = $assetsDirUrl . $cssFile;
			wp_enqueue_style("restpress-style-" . $index, $styleUrl, [], RESTPRESS_PLUGIN_VER);
		}
	}

    /**
     * Retrieves the manifest data for asset files.
     *
     * Reads the Vite manifest file to get the list of assets (JavaScript and CSS files)
     * required for the plugin. The manifest file is expected to be located in the
     * `dist/.vite/manifest.json` directory.
     *
     * @global WP_Filesystem_Base $wp_filesystem WordPress filesystem object.
     *
     * @return array Manifest data for the main entry point (`index.html`).
     */
    private static function getManifestData(): array
    {
        global $wp_filesystem;

        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $manifestFile    = RESTPRESS_PLUGIN_DIR . '/dist/.vite/manifest.json';
        $manifestContent = $wp_filesystem->get_contents($manifestFile);
        $manifestData    = json_decode($manifestContent, true);

        return $manifestData["index.html"];
    }

    /**
     * Enqueues the inline configuration for the Restpress plugin.
     *
     * Adds a JavaScript object with the plugin options as an inline script before
     * the main Restpress script. This provides configuration settings to the front-end.
     *
     * @return void
     */
	private static function enqueueOptions(): void
	{
		$options = RestpressOptions::get();

		wp_add_inline_script(
			'main-restpress-script',
			sprintf('var restpress = %s', wp_json_encode($options)),
			'before'
		);
	}
}
