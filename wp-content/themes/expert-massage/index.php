<?php

/*
 * Making sure Wordless plugin is enabled
 */

if (!class_exists("Wordless")) {
    echo "This theme requires the <a href='https://github.com/welaika/wordless'>Wordless plugin</a> in order to work. Please, install it now!";
    die();
}

define('THEME_DIST_PATH', get_stylesheet_directory_uri() . '/dist');
define('THEME_FONTS_PATH', THEME_DIST_PATH . '/assets/fonts');
define('THEME_IMG_PATH', THEME_DIST_PATH . '/assets/img');
define('THEME_UPLOADS_BASE_PATH', wp_get_upload_dir()['baseurl']);
define('ARTICLE_PAGES_URLS', [
    '/informatsiya/pokazaniya-k-massazhu/',
    '/informatsiya/protivopokazaniya-k-massazhu/',
    '/interesnoe/12_steps/',
    '/massazhnoe-maslo/',
    '/informatsiya/massage/',
    '/polza-i-vred-massazha/',
    '/massazh-shejno-vorotnikovoj-zony-pri-shejnom-osteohondroze/',
    '/kak-pravilno-delat-massazh-shejno-vorotnikovoj-zony-v-domashnih-usloviyah/',
    '/massazh-spiny-pri-osteohondroze/',
    '/kak-pravilno-delat-massazh-spiny-v-domashnih-usloviyah/',
    '/massazh-s-medicinskimi-mazyami/',
    '/osteohondroz/'
]);

/*
 * In this page, you need to setup Wordless routing: you first
 * determine the type of the page using WordPress conditional tags,
 * and then delegate the rendering to some particular view using
 * the `render_view()` helper.
 *
 * To specify a layout other than the default one, please pass it as
 * the second parameter to the `render_view()` method.
 *
 * For a list of conditional tags, please see here: http://codex.wordpress.org/Conditional_Tags
 */

$pugPage = get_pug_page();

$globalData = get_global_data();
$pageData = [];

if (is_home()) {
    $pageData['reviewsBlock']['reviews'] = get_reviews_slider_data();
    $pageData['videoReviews'] = get_video_reviews();

    render_template('pages/index', [
        'globalData' => json_encode($globalData),
        'pageData' => json_encode($pageData)
    ]);
} else if ($pugPage) {
    if ($pugPage === 'pages/reviews') {
        $pageData['reviewsData'] = get_reviews_data();

        render_template($pugPage, [
            'globalData' => json_encode($globalData),
            'pageData' => json_encode($pageData)
        ]);
    } else {
        if (is_massage_page()) {
            $pageData['reviewsBlock']['reviews'] = get_reviews_slider_data();
            $pageData['massageVideo'] = get_massage_video();
        }

        render_template($pugPage, [
            'globalData' => json_encode($globalData),
            'pageData' => json_encode($pageData)
        ]);
    }
} else {
    render_template('pages/404');
}
