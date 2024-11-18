<?php
/**
 * Handles the activation process for the Restpress plugin.
 */
class RestpressActivationHandler {
    /**
     * Constructor of the class.
     *
     * Registers the activation hook for the plugin.
     */
    public function __construct() {
        register_activation_hook(RESTPRESS_PLUGIN_FILE, [$this, 'activate']);
    }

    /**
     * Sets default values for options if not already set
     * and flushes rewrite rules when the plugin is activated.
     *
     * @return void
     */
    public function activate(): void {
        update_option('restpress_options', RestpressOptions::get(), false);
        flush_rewrite_rules();
    }
}

new RestpressActivationHandler;
