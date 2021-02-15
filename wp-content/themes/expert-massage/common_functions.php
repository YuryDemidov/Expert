<?php

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
        }
        if ($massage['type'] === '2' || $massage['code'] === 'body-lymphatic-drainage') {
            array_push($bodyMassages['massages'], $massage);
        }
        if ($massage['type'] === '3' ) {
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

    $companyData = $wpdb->get_results(
        'SELECT option_name, value FROM wp_exp_company_info',
        OBJECT_K
    );

    $foundationYear = $companyData['foundationYear']->value;

    return [
        'foundationYear' => $foundationYear,
        'businessDuration' => date('Y') - $foundationYear,
        'phones' => [$companyData['mainPhone']->value, $companyData['mobilePhone']->value],
        'email' => $companyData['mainEmail']->value,
        'founderEmail' => $companyData['additionalEmail']->value,
        'addressCity' => $companyData['addressCity']->value,
        'address' => $companyData['address']->value,
        'workingHours' => $companyData['workingHours']->value,
        'specialists' => get_specialists(),
        'socials' => get_socials()
    ];
}

function get_specialists() {
    global $wpdb;

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

    return $specialists;
}

function get_socials() {
    global $wpdb;
    $result = [];

    $socials = $wpdb->get_results(
        'SELECT code, name, link FROM wp_exp_socials ORDER BY id', ARRAY_A
    );

    foreach ($socials as $social) {
        $result[$social['code']] = [
            'link' => $social['link'],
            'name' => $social['name']
        ];
    }

    return $result;
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
        ON wp_exp_massages.menu_tag_color = wp_exp_color_modifiers.id OR wp_exp_massages.menu_tag_color IS NULL
        ORDER BY sort_position',
        ARRAY_A
    );

    $massageObj = [];
    foreach ($massages as $massage) {
        $massage['url'] = '/vidy-massazha/' . $massage['code'] . '/';

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
            WHERE accepted = 1 AND massage_type = 3
            ORDER BY date DESC
            LIMIT 12',
            ARRAY_A
        );
    } else if (is_body_massage()) {
        $reviews = $wpdb->get_results(
            'SELECT text, author, source, date 
            FROM wp_exp_reviews
            WHERE accepted = 1 AND massage_type = 2
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

function get_video_reviews() {
    global $wpdb;

    return $wpdb->get_results(
        'SELECT * FROM wp_exp_video_reviews',
        ARRAY_A
    );
}

function get_massage_video() {
    global $wpdb, $post;
    $page_slug = $post->post_name;

    $video = $wpdb->get_results(
        $wpdb->prepare(
            'SELECT wp_exp_massage_video.code, poster, sticker_position, sticker_text
            FROM wp_exp_massages 
            RIGHT JOIN wp_exp_massage_video
            ON wp_exp_massage_video.massage_id = wp_exp_massages.id
            WHERE wp_exp_massages.code = %s', [$page_slug]
        ),
        ARRAY_A
    )[0];

    return [
        'id' => $video['code'],
        'poster' => THEME_UPLOADS_BASE_PATH . $video['poster'],
        'sticker' => [
            'position' => $video['sticker_position'],
            'text' => $video['sticker_text']
        ]
    ];
}

function is_massage_page() {
    return preg_match('/vidy-massazha/', $_SERVER['REQUEST_URI']);
}

function is_article_page() {
    return in_array($_SERVER['REQUEST_URI'], ARTICLE_PAGES_URLS);
}

function is_body_massage() {
    return is_page('lechebnyj-massazh') || is_page('mas-limf-2') || is_page('obshchij-massazh') ||
        is_page('sports-massage') || is_page('massazh-shvz');
}

function is_face_massage() {
    return is_page('sculptural-buccal-massage') || is_page('facial-lymphatic-drainage') ||
        is_page('classic-facial-massage') || is_page('chiromassage') ||
        is_page('japanese-asahi-massage');
}

function is_figure_massage() {
    return is_page('mas-limf-2') || is_page('figure-modeling') || is_page('mas-anti-2');
}

function extract_phone($string) {
    return str_replace(['(', ')', '-', ' '], '', $string);
}

function is_valid_phone($phone) {
    return preg_match('/^\+?([87](?!95[5-79]|99[08]|907|94[^0]|336)([348]\d|9[0-6789]|7[01247])\d{8}|[1246]\d{9,13}|68\d{7}|5[1-46-9]\d{8,12}|55[1-9]\d{9}|55[138]\d{10}|55[1256][14679]9\d{8}|554399\d{7}|500[56]\d{4}|5016\d{6}|5068\d{7}|502[45]\d{7}|5037\d{7}|50[4567]\d{8}|50855\d{4}|509[34]\d{7}|376\d{6}|855\d{8,9}|856\d{10}|85[0-4789]\d{8,10}|8[68]\d{10,11}|8[14]\d{10}|82\d{9,10}|852\d{8}|90\d{10}|96(0[79]|17[0189]|181|13)\d{6}|96[23]\d{9}|964\d{10}|96(5[569]|89)\d{7}|96(65|77)\d{8}|92[023]\d{9}|91[1879]\d{9}|9[34]7\d{8}|959\d{7,9}|989\d{9}|971\d{8,9}|97[02-9]\d{7,11}|99[^4568]\d{7, 11}|994\d{9}|9955\d{8}|996[2579]\d{8}|9989\d{8}|380[345679]\d{8}|381\d{9}|38[57]\d{8,9}|375[234]\d{8}|372\d{7,8}|37[0-4]\d{8}|37[6-9]\d{7,11}|30[69]\d{9}|34[67]\d{8}|3459\d{11}|3[12359]\d{8,12}|36\d{9}|38[169]\d{8}|382\d{8,9}|46719\d{10})$/Ui', $phone);
}

function get_request_result($request) {
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL,$request);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $server_output = curl_exec($ch);
    curl_close($ch);
    return $server_output;
}
