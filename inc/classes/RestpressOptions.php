<?php

class RestpressOptions {
    /**
     * Get all the options defined for the plugin.
     * It also set default values if no one is defined.
     *
     * @return array The plugin options
     */
    public static function get(): array
    {
        $options = get_option('restpress_options');
        $iconUrl = get_site_icon_url(64, RESTPRESS_PLUGIN_FALLBACK_ICON);

        $defaultValues = [
            'site_base_url' => home_url(),
            'api_base_url'  => get_rest_url(),
            'namespaces'    => '',
            'site_icon'     => $iconUrl,
            'nonce'         => wp_create_nonce('wp_rest'),
        ];

        return wp_parse_args($options, $defaultValues);
    }
}
