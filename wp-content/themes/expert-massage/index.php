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
define('THEME_VIDEO_PATH', THEME_DIST_PATH . '/assets/video');

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
    render_template('pages/index', [
        'globalData' => json_encode($globalData),
        'pageData' => json_encode($pageData)
    ]);
} else if ($pugPage) {
    if ($pugPage === 'pages/reviews') {
        // rewrite as reviews page controller with different data depending on get param
        $pageData['reviews'] = get_reviews_data();
        $pageData['reviewsPagination'] = get_reviews_pagination();

        render_template($pugPage, [
            'globalData' => json_encode($globalData),
            'pageData' => json_encode($pageData)
        ]);
    } else {
        if (is_massage_page()) {
            $pageData['reviewsBlock']['reviews'] = get_reviews_slider_data();
        }

        render_template($pugPage, [
            'globalData' => json_encode($globalData),
            'pageData' => json_encode($pageData)
        ]);
    }
} else {
    render_template('pages/404');
}

function get_pug_page() {
    $dirPages = new DirectoryIterator(get_stylesheet_directory() . '/views/pages');
    foreach ($dirPages as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'pug') {
            $pageName = str_replace('.pug', '', basename($file));
            if (is_page($pageName)) {
                return 'pages/' . $pageName;
            }
        }
    }
    return null;
}

function get_global_data() {
    $massages = get_massages();

    $faceMassages = [
        'title' => 'Для красоты лица',
        'massages' => []
    ];
    $bodyMassages = [
        'title' => 'Для здоровья тела',
        'massages' => []
    ];
    $figureMassages = [
        'title' => 'Для стройной фигуры',
        'massages' => []
    ];

    foreach ($massages as $key => $massage) {
        if ($massage['type'] === '1') {
            array_push($faceMassages['massages'], $massage);
        } else if ($massage['type'] === '2') {
            array_push($bodyMassages['massages'], $massage);
        } else {
            array_push($figureMassages['massages'], $massage);
        }
    }

    return [
        'title' => get_the_title(),
        'url' => $_SERVER['REQUEST_URI'],
        'canonical' => wp_get_canonical_url(),
        'currentYear' => date('Y'),
        'company' => get_company_data(),
        'massages' => $massages,
        'priceList' => [
            'sections' => [
                'body' => $bodyMassages,
                'face' => $faceMassages,
                'figure' => $figureMassages,
            ],
            'procedures' => get_procedures_prices(),
            'additions' => get_additions_prices()
        ],
    ];
}

function get_company_data() {
    global $wpdb;

    $foundationYear = 2008;

    $specialists = $wpdb->get_results(
        'SELECT *
        FROM wp_exp_specialists',
        ARRAY_A
    );

    foreach ($specialists as $key => $specialist) {
        $reviewsCount = $wpdb->get_var(
            $wpdb->prepare(
                'SELECT COUNT(specialist_id)
                FROM wp_exp_reviews
                WHERE wp_exp_reviews.specialist_id = %d', [
                    $specialist['id']
                ]
            )
        );
        $specialists[$key]['reviewsCount'] = $reviewsCount;
        $specialists[$key]['fullName'] = $specialist['surname'] . ' ' . $specialist['first_name'] . ' ' . $specialist['last_name'];
    }

    return [
        'foundationYear' => $foundationYear,
        'businessDuration' => date('Y') - $foundationYear,
        'phones' => ['+7 499 397-71-81', '+7 915 000-63-42'],
        'email' => 'expert-massage@yandex.ru',
        'founderEmail' => 'a.n.rybnikov@yandex.ru',
        'address' => 'м. Цветной Бульвар<br>1-й Волконский переулок, д.15',
        'workingHours' => 'с 9:00 до 21:00<br>без выходных',
        'specialists' => $specialists,
        'socials' => [
            'ig' => [
                'link' => 'https://www.instagram.com/expert_massage_clinic'
            ],
            'vk' => [
                'link' => 'https://vk.com/expert_massage_clinic'
            ],
            'fb' => [
                'link' => 'https://www.facebook.com/expert.masage.clinic'
            ]
        ]
    ];
}

function get_massages() {
    global $wpdb;

    $massages = $wpdb->get_results(
        'SELECT wp_exp_massages.id, wp_exp_massages.code, wp_exp_massages.name, wp_exp_massages.full_name,
        wp_exp_massages.type, wp_exp_massages.menu_tag_text, wp_exp_massages.first_price,
        wp_exp_massages.standard_price, wp_exp_massages.old_price, wp_exp_massages.duration,
        wp_exp_massages.short_description,
        wp_exp_color_modifiers.name as menu_tag_color
        FROM wp_exp_massages
        RIGHT JOIN wp_exp_color_modifiers
        ON wp_exp_massages.menu_tag_color = wp_exp_color_modifiers.id OR wp_exp_massages.menu_tag_color IS NULL',
        ARRAY_A
    );

    $massageObj = [];
    foreach ($massages as $massage) {
        $massage['url'] = '/' . $massage['code'] . '/';

        if ($massage['code'] === 'sculptural-buccal-massage') {
            $massage['promo'] = [
                'text' => '<span>Акция</span> — скидка на февраль и март 30%',
                'starPlacement' => 3,
                'title' => '30% скидка на скульптурно-буккальный массаж!',
                'cardText' => 'Любое количество сеансов. Только на февраль и март',
                'buttonText' => 'Записаться',
                'buttonColor' => '#06319f',
                'image' => THEME_IMG_PATH . '/prices-page/promo-bg-1@2x.jpg',
            ];
        } else if ($massage['code'] === 'figure-modeling') {
            $massage['promo'] = [
                'text' => '<span>Акция</span> — скидка на февраль и март 30%',
                'starPlacement' => 3,
                'title' => '30% скидка на ручное модели&shy;рование фигуры',
                'cardText' => 'На февраль и март',
                'buttonText' => 'Записаться',
                'buttonColor' => '#fe2c78',
                'image' => THEME_IMG_PATH . '/prices-page/promo-bg-2@2x.jpg',
            ];
        }

        $massageObj[$massage['code']] = $massage;
    }

    return $massageObj;
}

function get_procedures_prices() {
    global $wpdb;

    return $wpdb->get_results(
        'SELECT name, price
        FROM wp_exp_price_procedures',
        ARRAY_A
    );
}

function get_additions_prices() {
    global $wpdb;

    return $wpdb->get_results(
        'SELECT name, price
        FROM wp_exp_price_additions',
        ARRAY_A
    );
}


function get_reviews_data() {
    global $wpdb;
    $reviews_per_page = 15;
    $page = $_GET['page_num'] ? $_GET['page_num'] : 1;

    $reviews = $wpdb->get_results(
        $wpdb->prepare(
            'SELECT text, author, source, date 
            FROM wp_exp_reviews
            WHERE accepted = 1
            ORDER BY date DESC
            LIMIT %d, %d',
            [
                ($page - 1) * $reviews_per_page,
                $reviews_per_page
            ]
        ),
        ARRAY_A
    );

    for ($i = 0; $i < count($reviews); $i++) {
        $reviews[$i]['date'] = date_create($reviews[$i]['date'])->format('d.m.Y');
    }

    return $reviews;
}

function get_reviews_pagination() {
    global $wpdb;

    $reviewsCount = $wpdb->get_var('SELECT COUNT(id) FROM wp_exp_reviews;');

    $args = [
        'base'         => '/reviews/%_%',
        'format'       => '?page_num=%#%',
        'total'        => ceil($reviewsCount / 15),
        'current'      => $_GET['page_num'],
        'show_all'     => false,
        'end_size'     => 1,
        'mid_size'     => 1,
        'prev_next'    => true,
        'prev_text'    => __('<'),
        'next_text'    => __('>'),
        'type'         => 'plain',
        'before_page_number' => '',
        'after_page_number'  => ''
    ];

    return paginate_links($args);
}

function get_reviews_slider_data() {
    global $wpdb;

    if (is_face_massage()) {
        $reviews = $wpdb->get_results(
            'SELECT text, author, source, date 
            FROM wp_exp_reviews
            WHERE accepted = 1 AND massage_type = 1
            ORDER BY date DESC
            LIMIT 12',
            ARRAY_A
        );
    } else if (is_figure_massage()) {
        $reviews = $wpdb->get_results(
            'SELECT text, author, source, date 
            FROM wp_exp_reviews
            WHERE accepted = 1 AND massage_type = 2
            ORDER BY date DESC
            LIMIT 12',
            ARRAY_A
        );
    } else if (is_body_massage()) {
        $reviews = $wpdb->get_results(
            'SELECT text, author, source, date 
            FROM wp_exp_reviews
            WHERE accepted = 1 AND massage_type = 3
            ORDER BY date DESC
            LIMIT 12',
            ARRAY_A
        );
    } else {
        $reviews = $wpdb->get_results(
            'SELECT text, author, source, date 
            FROM wp_exp_reviews
            WHERE accepted = 1
            ORDER BY date DESC
            LIMIT 12',
            ARRAY_A
        );
    }

    for ($i = 0; $i < count($reviews); $i++) {
        $reviews[$i]['date'] = date_create($reviews[$i]['date'])->format('d.m.Y');
    }

    return $reviews;
}

function is_massage_page() {
    return is_body_massage() || is_face_massage() || is_figure_massage();
}

function is_article_page() {
    return preg_match('/\/articles\/.+/', $_SERVER['REQUEST_URI']);
}

function is_body_massage() {
    return is_page('back-massage') || is_page('body-lymphatic-drainage') ||
        is_page('fullbody-massage') || is_page('sports-massage') || is_page('neck-massage');
}

function is_face_massage() {
    return is_page('sculptural-buccal-massage') || is_page('facial-lymphatic-drainage') ||
        is_page('classic-facial-massage') || is_page('chiromassage') ||
        is_page('japanese-asahi-massage');
}

function is_figure_massage() {
    return is_page('body-lymphatic-drainage') || is_page('figure-modeling') ||
        is_page('anti-cellulite-massage');
}
