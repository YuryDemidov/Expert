<?php

/*
 * Place here all your WordPress add_filter() and add_action() calls.
 */
add_filter('wordless_pug_configuration', 'custom_pug_options', 10, 1);
add_action('wp_footer', 'remove_initial_scripts');

function custom_pug_options(array $options): array {
    $options['expressionLanguage'] = 'js';
    $options['cache'] = false;

    return $options;
}

function remove_initial_scripts() {
    wp_deregister_script('wp-embed');
}
