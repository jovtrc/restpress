<?php

class RestpressAdminSettings
{
	public function __construct()
	{
		add_action('admin_init', [$this, 'restpressAdminInit']);
		add_action('admin_menu', [$this, 'restpressAdminMenu']);
		add_action('admin_init', [$this, 'restpressSettingsFields']);
	}

	public function restpressAdminInit(): void
	{
		register_setting('restpress_plugin', 'restpress_options');

		add_settings_section(
			'restpress_settings',
			'',
			'',
			'restpress_plugin'
		);
	}

	public function restpressSettingsFields(): void
	{
		add_settings_field(
			'api_base_url',
			'API base URL',
			[$this, 'restpressBuildField'],
			'restpress_plugin',
			'restpress_settings',
			[
				'default_value' => get_rest_url(),
				'label_for'     => 'api_base_url',
				'placeholder'   => 'The base URL to the REST API. Example: https://wordpress.org/wp-json',
			]
		);

		add_settings_field(
			'namespaces',
			'Accepted Namespaces',
			[$this, 'restpressBuildField'],
			'restpress_plugin',
			'restpress_settings',
			[
				'type'        => 'textarea',
				'label_for'   => 'namespaces',
				'placeholder' => 'Add the namespaces separated by comma, for example wp/v2, wp-site-health/v1',
			]
		);
	}

	public function restpressAdminMenu(): void
	{
		add_submenu_page(
			'tools.php',
			'Restpress',
			'Restpress',
			'manage_options',
			'restpress_settings',
			[$this, 'renderRestpressAdminMenu']
		);
	}

	public function renderRestpressAdminMenu(): void
	{
		// Check user capabilities
		if (!current_user_can('manage_options')) {
			return;
		}

		RestpressAssets::enqueue();

		include_once RESTPRESS_PLUGIN_DIR . '/inc/templates/admin-settings.php';
	}

	function restpressBuildField($args): void
	{
		// Get the value of the setting we've registered with register_setting()
		$options      = get_option('restpress_options');
		$size         = $args['size'] ?? 4;
		$defaultValue = !empty($args['default_value']) ? $args['default_value'] : '';
		$fieldValue   = !empty($options[$args['label_for']]) ? $options[$args['label_for']] : $defaultValue;
		$classNames   = 'w-full rounded-lg border border-gray-200 align-top shadow-sm sm:text-sm p-3 ';

		if ($args['type'] === 'textarea') {
			?>
			<textarea
				rows="<?php echo esc_attr($size); ?>"
				id="<?php echo esc_attr($args['label_for']); ?>"
				placeholder="<?php echo esc_attr($args['placeholder']); ?>"
				class="<?php echo esc_attr($classNames . $args['class_names']); ?>"
				name="restpress_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
			><?php echo esc_html($fieldValue); ?></textarea>
			<?php
			return;
		}
		?>
		<input
			id="<?php echo esc_attr($args['label_for']); ?>"
			value="<?php echo esc_attr($fieldValue); ?>"
			class="<?php echo esc_attr($classNames . $args['class_names']); ?>"
			placeholder="<?php echo esc_attr($args['placeholder']); ?>"
			name="restpress_options[<?php echo esc_attr( $args['label_for'] ); ?>]"
		>
		<?php
	}
}

new RestpressAdminSettings;
