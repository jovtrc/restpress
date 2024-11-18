<?php

class RestpressActivationHandler {
    public function __construct() {
        register_activation_hook(RESTPRESS_PLUGIN_FILE, [$this, 'activate']);
    }

    public function activate(): void {
        update_option('restpress_options', RestpressOptions::get(), false);
        flush_rewrite_rules();
    }
}

new RestpressActivationHandler;
