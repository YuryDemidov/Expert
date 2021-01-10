<?php

add_action('wp_enqueue_scripts', 'enqueue_css');
add_action('admin_enqueue_scripts', 'enqueue_admin_css');
add_action('wp_enqueue_scripts', 'enqueue_js');

function enqueue_js() {
    $dirJS = new RecursiveDirectoryIterator(get_stylesheet_directory() . '/dist/js');
    $iterator = new \RecursiveIteratorIterator($dirJS);
    foreach ($iterator as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'js') {
            $fullName = basename($file);
            $name = substr(basename($fullName), 0, strpos(basename($fullName), '.'));
            $fileSrc = get_template_directory_uri() . '/dist/js/' . $fullName;
            switch($name) {
                case 'app':
                    wp_enqueue_script($name, $fileSrc, array('vendor', 'runtime'), null, true);
                    break;
                case 'runtime':
                case 'vendor':
                    wp_enqueue_script($name, $fileSrc, [], null, true);
                    break;
                case 'index':
                    if (is_home()) {
                        wp_enqueue_script($name, get_template_directory_uri() . '/dist/js/pages/' . $fullName, array('app'), null, true);
                    }
                    break;
                case 'massages':
                    if (is_massage_page()) {
                        wp_enqueue_script($name, get_template_directory_uri() . '/dist/js/pages/' . $fullName, array('app'), null, true);
                    }
                    break;
                case 'about':
                case 'contacts':
                case 'prices':
                case 'reviews':
                    if (is_page($name)) {
                        wp_enqueue_script($name, get_template_directory_uri() . '/dist/js/pages/' . $fullName, array('app'), null, true);
                    }
                    break;
                case 'article':
                    if (is_page('12-steps')) {
                        wp_enqueue_script($name, get_template_directory_uri() . '/dist/js/pages/' . $fullName, array('app'), null, true);
                    }
                    break;
                default:
                    break;
            }
        }
    }
}

function enqueue_css() {
    $dirCSS = new RecursiveDirectoryIterator(get_stylesheet_directory() . '/dist');
    foreach ($dirCSS as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'css') {
            $fullName = basename($file);
            $name = substr(basename($fullName), 0, strpos(basename($fullName), '.'));
            if ($name !== 'admin') {
                wp_enqueue_style($name, get_template_directory_uri() . '/dist/' . $fullName, [], null);
            }
        }
    }
}

function enqueue_admin_css() {
    wp_enqueue_style('admin', get_template_directory_uri() . '/dist/admin.css');
}
