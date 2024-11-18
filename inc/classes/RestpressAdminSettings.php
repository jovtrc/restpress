<?php
/**
 * Class responsible for managing the settings of the Restpress plugin in the WordPress admin area.
 */
class RestpressAdminSettings
{
    /**
     * Constructor of the class.
     *
     * Adds necessary hooks to initialize settings and admin menu.
     */
	public function __construct()
	{
		add_action('admin_init', [$this, 'initSettings']);
		add_action('admin_menu', [$this, 'settingsMenu']);
		add_action('admin_init', [$this, 'settingsFields']);
	}

    /**
     * Initializes the plugin settings.
     *
     * Registers settings options and sections for the plugin.
     *
     * @return void
     */
	public function initSettings(): void
	{
		register_setting('restpress_plugin', 'restpress_options');

		add_settings_section(
			'restpress_settings',
			'',
			'',
			'restpress_plugin'
		);
	}

    /**
     * Adds a submenu item for the plugin in the WordPress admin area.
     *
     * Creates a submenu page under the "Tools" menu.
     *
     * @return void
     */
	public function settingsMenu(): void
	{
		add_submenu_page(
			'tools.php',
			'Restpress',
			'Restpress',
			'manage_options',
			'restpress_settings',
			[$this, 'renderSettingsMenu']
		);
	}

    /**
     * Renders the settings menu page content.
     *
     * Checks user permissions and includes the settings template.
     *
     * @return void
     */
	public function renderSettingsMenu(): void
	{
		// Check user capabilities
		if (!current_user_can('manage_options')) {
			return;
		}

		RestpressAssets::enqueue();

		include_once RESTPRESS_PLUGIN_DIR . '/inc/templates/admin-settings.php';
	}

    /**
     * Registers the fields for the plugin settings.
     *
     * Adds settings fields for customizing the documentation page title, API base URL, and accepted namespaces.
     *
     * @return void
     */
	public function settingsFields(): void
	{
		add_settings_field(
			'docs_page_title',
			'Docs Page Title',
			[$this, 'buildField'],
			'restpress_plugin',
			'restpress_settings',
			[
				'default_value' => "API Docs | Restpress",
				'label_for'     => 'docs_page_title',
				'placeholder'   => 'The title for the docs page. Example: My Site API Docs',
			]
		);

		add_settings_field(
			'api_base_url',
			'API base URL',
			[$this, 'buildField'],
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
			[$this, 'buildField'],
			'restpress_plugin',
			'restpress_settings',
			[
				'type'        => 'textarea',
				'label_for'   => 'namespaces',
				'placeholder' => 'Add the namespaces separated by comma, for example wp/v2, wp-site-health/v1',
			]
		);
	}

    /**
     * Renders the HTML input field for a setting.
     *
     * Builds the input or textarea field based on the provided arguments.
     *
     * @param array $args Arguments for building the field, including type, size, label, and placeholder.
     *
     * @return void
     */
	function buildField(array $args): void
	{
		// Get the value of the setting we've registered with register_setting()
		$options      = get_option('restpress_options');
		$classNames   = 'w-full rounded-lg border border-gray-200 align-top shadow-sm sm:text-sm p-3 ';
        $defaultValue = $args['default_value'] ?? '';

        $fieldProps   = [
            'type'          => $args['type']  ?? 'input',
            'size'          => $args['size'] ?? 4,
            'label'         => $args['label_for'],
            'placeholder'   => $args['placeholder'],
            'value'         => !empty($options[$args['label_for']]) ? $options[$args['label_for']] : $defaultValue,
            'class'         => !empty($args['class_names']) ? $classNames . $args['class_names'] : $classNames
        ];

		if ($fieldProps['type'] === 'textarea') {
			?>
			<textarea
				id="<?php esc_attr_e($fieldProps['label']); ?>"
				rows="<?php esc_attr_e($fieldProps['size']); ?>"
				class="<?php esc_attr_e($fieldProps['class']); ?>"
				placeholder="<?php esc_attr_e($fieldProps['placeholder']); ?>"
				name="restpress_options[<?php esc_attr_e($fieldProps['label']); ?>]"
			><?php esc_html_e($fieldProps['value']); ?></textarea>
			<?php
			return;
		}
		?>
		<input
			type="text"
			id="<?php esc_attr_e($fieldProps['label']); ?>"
			value="<?php esc_attr_e($fieldProps['value']); ?>"
			class="<?php esc_attr_e($fieldProps['class']); ?>"
			placeholder="<?php esc_attr_e($fieldProps['placeholder']); ?>"
			name="restpress_options[<?php esc_attr_e($fieldProps['label']); ?>]"
		>
		<?php
	}
}

new RestpressAdminSettings;
