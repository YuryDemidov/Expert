<?php

// WordPress environment
require(dirname(__FILE__) . '/../../../../../wp-load.php');

function process_upload($file) {
    $wordpress_upload_dir = wp_upload_dir();
    // $wordpress_upload_dir['path'] is the full server path to wp-content/uploads/2017/05, for multisite works good as well
    // $wordpress_upload_dir['url'] the absolute URL to the same folder, actually we do not need it, just to show the link to file
    $i = 1; // number of tries when the file with the same name is already exists

    $new_file_path = $wordpress_upload_dir['path'] . '/' . $file['name'];
    $new_file_mime = mime_content_type($file['tmp_name']);

    if (empty($file))
        die('Файл не был выбран');

    if ($file['error'])
        die($file['error']);

    if ($file['size'] > wp_max_upload_size())
        die('Слишком большой файл для загрузки');

    if (!in_array($new_file_mime, get_allowed_mime_types()))
        die('WordPress не позволяет загружать файлы такого типа');

    while (file_exists($new_file_path)) {
        $i++;
        $new_file_path = $wordpress_upload_dir['path'] . '/' . $i . '_' . $file['name'];
    }

    // looks like everything is OK
    if (move_uploaded_file($file['tmp_name'], $new_file_path)) {
        $upload_id = wp_insert_attachment(array(
            'guid' => $new_file_path,
            'post_mime_type' => $new_file_mime,
            'post_title' => preg_replace('/\.[^.]+$/', '', $file['name']),
            'post_content' => '',
            'post_status' => 'inherit'
        ), $new_file_path);

        // wp_generate_attachment_metadata() won't work if you do not include this file
        require_once(dirname(__FILE__) . '/../../../../../wp-admin/includes/image.php');

        // Change permissions
        chmod($new_file_path, 0775);

        // Generate and save the attachment metas into the database
        wp_update_attachment_metadata($upload_id, wp_generate_attachment_metadata($upload_id, $new_file_path));

        return $wordpress_upload_dir['subdir'] . '/' . basename($new_file_path);
    }

    return false;
}
