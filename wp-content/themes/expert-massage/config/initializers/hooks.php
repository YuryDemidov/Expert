<?php

/*
 * Place here all your WordPress add_filter() and add_action() calls.
 */

include_once(get_stylesheet_directory() . '/common_functions.php');

define('SUPPORT_EMAILS', ['demiddinamit@mail.ru', 'mr.antony-mir@yandex.ru', 'ms.irina-mir@yandex.ru']);

add_filter('wordless_pug_configuration', 'custom_pug_options');

add_action('wp', 'activate_cron_tasks');
add_action('update_yandex_reviews', 'update_yandex_reviews');

add_action('wp_footer', 'remove_initial_scripts');

add_action('admin_menu', 'custom_administrating');

// Client action handlers
add_action('admin_post_nopriv_application', 'handle_application_form');
add_action('admin_post_application', 'handle_application_form');
add_action('admin_post_nopriv_callback', 'handle_callback_form');
add_action('admin_post_callback', 'handle_callback_form');
add_action('admin_post_nopriv_test', 'handle_test_form');
add_action('admin_post_test', 'handle_test_form');
add_action('admin_post_nopriv_review', 'handle_review_form');
add_action('admin_post_review', 'handle_review_form');
add_action('wp_ajax_reviews-filters', 'handle_reviews_filters');
add_action('wp_ajax_nopriv_reviews-filters', 'handle_reviews_filters');
// Admin panel handlers
add_action('admin_post_review_change', 'handle_review_change');
add_action('admin_post_review_delete', 'handle_review_delete');
add_action('admin_post_price_change', 'handle_price_change');
add_action('admin_post_promotion_change', 'handle_promotion_change');
add_action('admin_post_company_info', 'handle_company_info_change');
add_action('admin_post_massage_video', 'handle_massage_video_change');
add_action('admin_post_review_video', 'handle_review_video_change');
add_action('admin_post_review_video_delete', 'handle_review_video_delete');
add_action('admin_post_famous_client', 'handle_famous_client_change');
add_action('admin_post_famous_client_delete', 'handle_famous_client_delete');
add_action('admin_post_results_photo', 'handle_result_photo_change');
add_action('admin_post_results_photo_delete', 'handle_result_photo_delete');

/*
 * Change pug template engine options such as expression language (php / js)
 * or caching of generated pages
 */
function custom_pug_options(array $options): array {
    $options['expressionLanguage'] = 'js';
    return $options;
}

function activate_cron_tasks() {
    if (!wp_next_scheduled('update_yandex_reviews')) {
        wp_schedule_event(time(), 'daily', 'update_yandex_reviews');
    }
}

/*
 * Removes some default wordpress javascript files
 */
function remove_initial_scripts() {
    wp_deregister_script('wp-embed');
}

/*
 * Load, parse and update database with reviews from yandex
 */
function update_yandex_reviews() {
    require_once(get_template_directory() . '/helpers/simplehtmldom/simple_html_dom.php');

    $org_url = 'https://yandex.ru/maps/org/57968755978/reviews/';
    $html = get_request_result($org_url);
    $pos = strpos($html, '<div class="reviews-view__reviews">');
    $part = substr($html, $pos);
    $pos2 = strpos($part, '</section>');
    $part = substr($part, 0, $pos2);

    $html = str_get_html($part);

    $reviews = [];

    if (count($html->find('.business-review-view'))) {

        foreach ($html->find('.business-review-view') as $div) {
            $review = [];

            if (count($div->find('.business-review-view__author a'))) {
                $reviewAuthor=$div->find('.business-review-view__author a span')[0]->innertext;
                $review['author'] = $reviewAuthor;
            }
            if (count($div->find('.business-review-view__date'))) {
                $reviewDate=$div->find('.business-review-view__date meta')[0]->content;
                $review['date'] = $reviewDate;
            }
            if (count($div->find('.business-review-view__body-text'))) {
                $reviewText=$div->find('.business-review-view__body-text')[0]->innertext;
                $review['text'] = $reviewText;
            }
            $reviews[] = $review;
        }
    }

    update_yandex_reviews_database($reviews);
}

function update_yandex_reviews_database($reviews) {
    global $wpdb;

    // get all dates of current reviews
    $currentReviews = $wpdb->get_results(
        'SELECT date from wp_exp_reviews',
        OBJECT_K
    );

    // for every review from yandex
    foreach ($reviews as $review) {
        $review['date'] = date('Y-m-d H:i:s', strtotime(date($review['date'])));
        // if there is no review with such date
        if (!$currentReviews[$review['date']]) {
            // add this review to database
            $wpdb->insert('wp_exp_reviews', [
                'text' => $review['text'],
                'author' => $review['author'],
                'accepted' => false,
                'source' => 'yandex',
                'date' => $review['date']
            ]);
        }
    }
}

/*
 * Adds new section in wordpress admin panel
 */
function custom_administrating() {
    add_menu_page('Управление сайтом', 'Админ. панель', 'upload_files', 'custom_administrating', 'custom_administrating_options');
    add_submenu_page('custom_administrating', 'Запись на массаж', 'Запись на массаж', 'upload_files', 'application_form', 'application_form_administrating');
    add_submenu_page('custom_administrating', 'Заказ обратного звонка', 'Заказ обратного звонка', 'upload_files', 'callback_form', 'callback_form_administrating');
    add_submenu_page('custom_administrating', 'Тест выбора массажа', 'Тест выбора массажа', 'upload_files', 'test_form', 'test_form_administrating');
    add_submenu_page('custom_administrating', 'Отзывы', 'Отзывы', 'manage_options', 'review_form', 'review_form_administrating');
    add_submenu_page('custom_administrating', 'Прайс-лист', 'Прайс-лист', 'manage_options', 'prices', 'prices_administrating');
    add_submenu_page('custom_administrating', 'Акции', 'Акции', 'manage_options', 'promotions', 'promotions_administrating');
    add_submenu_page('custom_administrating', 'О компании', 'О компании', 'manage_options', 'company_info', 'company_info_administrating');
    add_submenu_page('custom_administrating', 'Видео', 'Видео', 'manage_options', 'site_video', 'video_administrating');
    add_submenu_page('custom_administrating', 'Фото', 'Фото', 'manage_options', 'site_photo', 'photo_administrating');
}

/*
 * Defines functionality of custom administrating panel
 */
function custom_administrating_options() {
    if (!current_user_can('upload_files'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }
    render_template('includes/admin/main');
}

/*
 * Application form data
 */
function application_form_administrating() {
    if (!current_user_can('upload_files'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    global $wpdb;

    $dbData = $wpdb->get_results(
        'SELECT phone, name, massage, specialist, certificate, date
        FROM wp_exp_applications 
        WHERE datediff(current_date(), date) < 50
        ORDER BY id DESC',
        ARRAY_A
    );

    for ($i = 0; $i < count($dbData); $i++) {
        $dbData[$i]['date'] = date_create($dbData[$i]['date'])->format('H:i d.m.Y');
        $dbData[$i]['massage'] = $wpdb->get_var(
            $wpdb->prepare('SELECT full_name FROM wp_exp_massages WHERE id = %d', $dbData[$i]['massage'])
        );
        $dbData[$i]['specialist'] = $wpdb->get_var(
            $wpdb->prepare('SELECT surname FROM wp_exp_specialists WHERE id = %d', $dbData[$i]['specialist'])
        );
    }

    render_template('includes/admin/application', ['data' => json_encode($dbData)]);
}

/*
 * Callback form data
 */
function callback_form_administrating() {
    if (!current_user_can('upload_files'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    global $wpdb;

    $dbData = $wpdb->get_results(
        'SELECT phone, date
        FROM wp_exp_callback_requests 
        WHERE datediff(current_date(), date) < 10
        ORDER BY id DESC',
        ARRAY_A
    );

    for ($i = 0; $i < count($dbData); $i++) {
        $dbData[$i]['date'] = date_create($dbData[$i]['date'])->format('H:i d.m.Y');
    }

    render_template('includes/admin/callback', ['data' => json_encode($dbData)]);
}

/*
 * Test form data
 */
function test_form_administrating() {
    if (!current_user_can('upload_files'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    global $wpdb;

    $dbData = $wpdb->get_results(
        'SELECT name, phone, age, problems, spine_disease, expectations, previous_experience, date
        FROM wp_exp_choosing_test_results
        WHERE datediff(current_date(), date) < 60
        ORDER BY id DESC',
        ARRAY_A
    );

    for ($i = 0; $i < count($dbData); $i++) {
        $dbData[$i]['date'] = date_create($dbData[$i]['date'])->format('H:i d.m.Y');
        $dbData[$i]['problems'] = implode(';<br>', explode(';', $dbData[$i]['problems']));
        $dbData[$i]['expectations'] = implode(';<br>', explode(';', $dbData[$i]['expectations']));
    }
    render_template('includes/admin/test-form', ['data' => json_encode($dbData)]);
}

/*
 * Review form data
 */
function review_form_administrating() {
    if (!current_user_can('manage_options'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    global $wpdb;

    $reviews = $wpdb->get_results(
        'SELECT *
        FROM wp_exp_reviews
        ORDER BY date DESC',
        ARRAY_A
    );

    $specialists = $wpdb->get_results(
        'SELECT id, surname
        FROM wp_exp_specialists
        WHERE is_showed = 1',
        ARRAY_A
    );

    $massageTypes = $wpdb->get_results(
        'SELECT id, name
        FROM wp_exp_massage_types',
        ARRAY_A
    );

    for ($i = 0; $i < count($reviews); $i++) {
        $reviews[$i]['date'] = date_create($reviews[$i]['date'])->format('H:i d.m.Y');
    }

    render_template('includes/admin/reviews', ['data' => json_encode([
        'reviews' => $reviews,
        'specialists' => $specialists,
        'massageTypes' => $massageTypes
    ])]);
}

/*
 * Receiving prices from database and rendering admin price-list
 */
function prices_administrating() {
    if (!current_user_can('manage_options'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    global $wpdb;

    $pricesData = [
        'massages' => $wpdb->get_results('SELECT id, full_name, first_price, standard_price, old_price, duration FROM wp_exp_massages'),
        'procedures' => $wpdb->get_results('SELECT * FROM wp_exp_price_procedures'),
        'additions' => $wpdb->get_results('SELECT * FROM wp_exp_price_additions'),
    ];

    render_template('includes/admin/prices', ['data' => json_encode($pricesData)]);
}

/*
 * Receiving promotions from database and rendering admin page for changing them
 */
function promotions_administrating() {
    if (!current_user_can('manage_options'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    render_template('includes/admin/promotions', ['data' => json_encode(get_promotions())]);
}

/*
 * Receiving company info from database and rendering admin page for changing it
 */
function company_info_administrating() {
    if (!current_user_can('manage_options'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    render_template('includes/admin/company-info', ['data' => json_encode(get_company_data())]);
}

/*
 * Receiving videos from database and rendering admin page for changing it
 */
function video_administrating() {
    if (!current_user_can('manage_options'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    global $wpdb;

    $massageVideos = $wpdb->get_results(
        'SELECT name AS massage, wp_exp_massage_video.code, massage_id, poster, sticker_position, sticker_text
        FROM wp_exp_massage_video
        RIGHT OUTER JOIN wp_exp_massages
        ON wp_exp_massages.id = wp_exp_massage_video.massage_id',
        ARRAY_A
    );

    $videoReviews = get_video_reviews();

    render_template('includes/admin/videos', ['data' => json_encode([
        'massageVideos' => $massageVideos,
        'videoReviews' => $videoReviews
    ])]);
}

/*
 * Receiving photos from database and rendering admin page for changing it
 */
function photo_administrating() {
    if (!current_user_can('manage_options'))  {
        wp_die(__('У вас недостаточно прав для просмотра этого раздела'));
    }

    render_template('includes/admin/photos', ['data' => json_encode([
        'famousClients' => get_famous_clients(),
        'massageResults' => [
            'face' => get_massage_result_photos('face'),
            'figure' => get_massage_result_photos('figure')
        ]
    ])]);
}

/*
 * Handles user data obtained from application form
 */
function handle_application_form() {
    global $wpdb;

    try {
        $name = trim($_REQUEST['name']);
        $phone = extract_phone(trim($_REQUEST['phone']));

        if (!$name) {
            throw new Exception('Необходимо указать имя');
        }
        if (!$phone) {
            throw new Exception('Необходимо указать телефон');
        }
        if (!is_valid_phone($phone)) {
            throw new Exception('Телефон указан некорректно');
        }

        $wpdb->insert('wp_exp_applications', [
            'phone' => $phone,
            'name' => $name,
            'massage' => $_REQUEST['massage-id'] ? $_REQUEST['massage-id'] : null,
            'specialist' => $_REQUEST['specialist-id'] ? $_REQUEST['specialist-id'] : null,
            'certificate' => $_REQUEST['need-certificate'] ? 1 : 0,
            'date' => current_time('mysql')
        ]);

        $emailMessage = "Телефон: $phone<br>Имя: $name<br>";
        if ($_REQUEST['massage-id']) {
            $emailMessage .= 'Желаемый массаж: ' . $wpdb->get_var(
                $wpdb->prepare(
                    'SELECT full_name FROM wp_exp_massages WHERE id = %d', $_REQUEST['massage-id']
                )
            ) . '<br>';
        }
        if ($_REQUEST['specialist-id']) {
            $emailMessage .= 'Выбранный специалист: ' . $wpdb->get_var(
                $wpdb->prepare(
                    'SELECT surname FROM wp_exp_specialists WHERE id = %d', $_REQUEST['specialist-id']
                )
            ) . '<br>';
        }
        if ($_REQUEST['need-certificate']) {
            $emailMessage .= 'Нужен сертификат';
        }

        wp_mail(
            SUPPORT_EMAILS,
            'Новая заявка на массаж',
            $emailMessage,
            array('Content-Type: text/html; charset=UTF-8')
        );

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

/*
 * Handles user data obtained from callback form
 */
function handle_callback_form() {
    global $wpdb;

    try {
        $phone = extract_phone(trim($_REQUEST['phone']));

        if (!$phone) {
            throw new Exception('Необходимо указать телефон');
        }
        if (!is_valid_phone($phone)) {
            throw new Exception('Телефон указан некорректно');
        }

        $wpdb->insert('wp_exp_callback_requests', [
            'phone' => $phone,
            'date' => current_time('mysql')
        ]);

        wp_mail(SUPPORT_EMAILS, 'Заявка на обратный звонок',
            "
            <p>Получена новая заявка на обратный звонок</p>
            <p>
              <span>Телефон:</span>
              <a href='tel:$phone'>$phone</a>
            </p>
            ",
            array('Content-Type: text/html; charset=UTF-8')
        );

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

/*
 * Handles user data obtained from massage choosing test
 */
function handle_test_form() {
    global $wpdb;

    try {
        $name = trim($_REQUEST['name']);
        $phone = extract_phone(trim($_REQUEST['phone']));
        $age = $_REQUEST['age'];
        $problems = $_REQUEST['problems'];
        $spineDisease = $_REQUEST['spine-disease'];
        $expectations = $_REQUEST['expectations'];
        $previousExperience = $_REQUEST['previous-experience'];

        if (!$name) {
            throw new Exception('Необходимо указать имя');
        }
        if (!$phone) {
            throw new Exception('Необходимо указать телефон');
        }
        if (!is_valid_phone($phone)) {
            throw new Exception('Телефон указан некорректно');
        }

        $wpdb->insert('wp_exp_choosing_test_results', [
            'phone' => $phone,
            'name' => $name,
            'age' => $age,
            'problems' => $problems,
            'spine_disease' => $spineDisease,
            'expectations' => $expectations,
            'previous_experience' => $previousExperience,
            'date' => current_time('mysql')
        ]);

        wp_mail(SUPPORT_EMAILS, 'Тест на подходящий массаж',
            "
            <p>Пройден тест по выбору подходящего массажа</p>
            <p>
              <span>Имя:</span>
              <span>$name</span>
            </p>
            <p>
              <span>Телефон:</span>
              <a href='tel:$phone'>$phone</a>
            </p>
            <p>
              <span>Возраст:</span>
              <span>$age</span>
            </p>
            <p>
              <span>Проблемы:</span>
              <span>$problems</span>
            </p>
            <p>
              <span>Заболевания позвоночника:</span>
              <span>$spineDisease</span>
            </p>
            <p>
              <span>Чего хочет добиться массажем:</span>
              <span>$expectations</span>
            </p>
            <p>
              <span>Какие массажи были пройдены ранее:</span>
              <span>$previousExperience</span>
            </p>
            ",
            array('Content-Type: text/html; charset=UTF-8')
        );

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_review_form() {
    global $wpdb;

    try {
        $name = trim($_REQUEST['name']);
        $email = trim($_REQUEST['email']);
        $review = trim($_REQUEST['review']);

        if (!$name) {
            throw new Exception('Необходимо указать имя');
        }
        if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email указан некорректно');
        }
        if (!$review) {
            throw new Exception('Отзыв не может быть пустым');
        }
        if (preg_match('/<[A-z]/', $review)) {
            throw new Exception('Отзыв содержит некорректные символы');
        }

        $wpdb->insert('wp_exp_reviews', [
            'text' => $review,
            'author' => $name,
            'email' => $email,
            'source' => 'site',
            'date' => current_time('mysql')
        ]);

        wp_mail(SUPPORT_EMAILS, 'Новый отзыв',
            "
            <p>На сайте оставили новый отзыв</p>
            <p>
              <span>Автор:</span>
              <span>$name</span><a href='mailto:$email'>, $email</a>
            </p>
            <p>
              <span>Отзыв:</span>
              <span>$review</span>
            </p>
            ",
            array('Content-Type: text/html; charset=UTF-8')
        );

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function get_reviews_data() {
    global $wpdb;
    $reviews_per_page = 15;
    $page = isset($_GET['page_num']) ? $_GET['page_num'] : 1;

    $reviews = $wpdb->get_results(
        'SELECT text, author, specialist_id, massage_type, source, date 
        FROM wp_exp_reviews
        WHERE accepted = 1
        ORDER BY date DESC',
        ARRAY_A
    );

    if (isset($_GET['massage']) || isset($_GET['specialist'])) {
        $reviews = array_filter($reviews, function ($item) {
            if (isset($_GET['massage']) && $item['massage_type'] !== $_GET['massage']) {
                return false;
            }
            if (isset($_GET['specialist']) && $item['specialist_id'] !== $_GET['specialist']) {
                return false;
            }

            return true;
        });
    }

    $outputReviews = [];
    foreach ($reviews as $review) {
        $review['date'] = date_create($review['date'])->format('d.m.Y');
        $outputReviews[] = $review;
    }

    return [
        'reviews' => array_slice($outputReviews, ($page - 1) * $reviews_per_page,$reviews_per_page),
        'pagination' => get_reviews_pagination(count($reviews), $page)
    ];
}

function get_reviews_pagination($reviewsCount, $currentPage) {
    $args = [
        'base'         => '/reviews/%_%',
        'format'       => '?page_num=%#%',
        'total'        => ceil($reviewsCount / 15),
        'current'      => $currentPage,
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

function handle_reviews_filters() {
    exit(json_encode(get_reviews_data()));
}

function handle_review_change() {
    global $wpdb;

    try {
        if (isset($_REQUEST['massage_type'])) {
            $wpdb->update('wp_exp_reviews', [
                'massage_type' => $_REQUEST['massage_type'] === 'default' ? null : $_REQUEST['massage_type']
            ], [
                'id' => $_REQUEST['id']
            ]);
        } else if (isset($_REQUEST['specialist_id'])) {
            $wpdb->update('wp_exp_reviews', [
                'specialist_id' => $_REQUEST['specialist_id'] === 'default' ? null : $_REQUEST['specialist_id']
            ], [
                'id' => $_REQUEST['id']
            ]);
        } else {
            $wpdb->query(
                $wpdb->prepare(
                    'UPDATE wp_exp_reviews
                    SET `accepted` = !`accepted`
                    WHERE id = %d', $_REQUEST['id']
                )
            );
        }
        $response['result'] = true;
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_review_delete() {
    global $wpdb;

    try {
        $wpdb->delete('wp_exp_reviews', [
            'id' => $_REQUEST['id']
        ]);
        $response['result'] = true;
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_price_change() {
    global $wpdb;

    try {
        if ($_REQUEST['type'] === 'massage') {
            $changedTable = 'wp_exp_massages';
        } else if ($_REQUEST['type'] === 'procedure') {
            $changedTable = 'wp_exp_price_procedures';
        } else {
            $changedTable = 'wp_exp_price_additions';
        }

        $updateResult = $wpdb->update($changedTable,
            [
                $_REQUEST['field'] => $_REQUEST['value'] !== '' ? $_REQUEST['value'] : null
            ],
            [
                'id' => $_REQUEST['procedureId']
            ]
        );

        $response = [
            'result' => true,
            'updateResult' => $updateResult
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_promotion_change() {
    global $wpdb;

    try {
        $wpdb->update(
            'wp_exp_promotions',
            [
                'application_heading' => $_REQUEST['application_heading'],
                'application_text' => $_REQUEST['application_text'],
                'price_list_label' => $_REQUEST['price_list_label'],
                'price_list_star_placement' => $_REQUEST['price_list_star_placement'],
                'card_title' => $_REQUEST['card_title'],
                'card_text' => $_REQUEST['card_text'],
                'button_text' => $_REQUEST['button_text'],
                'button_color' => $_REQUEST['button_color']
            ],
            [
                'id' => $_REQUEST['id']
            ]
        );

        if (isset($_FILES['image']) && $_FILES['image']['error'] === 0 && $_FILES['image']['tmp_name']) {
            $wpdb->update(
                'wp_exp_promotions',
                ['image' => process_upload($_FILES['image'])],
                ['id' => $_REQUEST['id']]
            );
        }

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_company_info_change() {
    global $wpdb;

    try {
        foreach ($_REQUEST as $key => $value) {
            $wpdb->update(
                'wp_exp_company_info',
                ['value' => $value],
                ['option_name' => $key]
            );

            if (str_ends_with($key, '-link')) {
                $socialMedia = substr($key, 0, strpos($key, '-link'));
                $wpdb->update(
                    'wp_exp_socials',
                    ['link' => $value],
                    ['code' => $socialMedia]
                );
            }
        }

        $response = [
            'result' => true,
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_massage_video_change() {
    global $wpdb;

    try {
        if (!isset($_REQUEST['code']) || !$_REQUEST['code']) {
            throw new Exception('Нужно указать код видео с Youtube');
        }

        $wpdb->update(
            'wp_exp_massage_video', [
                'code' => $_REQUEST['code'],
                'sticker_position' => $_REQUEST['sticker_text'] ? $_REQUEST['sticker_position'] : null,
                'sticker_text' => $_REQUEST['sticker_text'] ? $_REQUEST['sticker_text'] : null,
            ], [
                'massage_id' => $_REQUEST['massage_id']
            ]
        );

        if (isset($_FILES['poster']) && $_FILES['poster']['error'] === 0 && $_FILES['poster']['tmp_name']) {
            $wpdb->update(
                'wp_exp_massage_video',
                ['poster' => process_upload($_FILES['poster'])],
                ['massage_id' => $_REQUEST['massage_id']]
            );
        }

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_review_video_change() {
    global $wpdb;

    try {
        if (isset($_REQUEST['id'])) {
            $wpdb->update(
                'wp_exp_video_reviews',
                ['code' => $_REQUEST['code'], 'sorting' => $_REQUEST['sorting']],
                ['id' => $_REQUEST['id']]
            );
            if (isset($_FILES['poster']) && $_FILES['poster']['error'] === 0 && $_FILES['poster']['tmp_name']) {
                $wpdb->update(
                    'wp_exp_video_reviews',
                    ['poster' => process_upload($_FILES['poster'])],
                    ['id' => $_REQUEST['id']]
                );
            }
        } else {
            if (!isset($_REQUEST['code']) || !$_REQUEST['code']) {
                throw new Exception('Нужно указать код видео с Youtube');
            }
            if (!isset($_FILES['poster']) || $_FILES['poster']['error'] !== 0 || !$_FILES['poster']['tmp_name']) {
                throw new Exception('Постер не был загружен или в процессе загрузки произошла ошибка');
            }

            $wpdb->insert(
                'wp_exp_video_reviews', [
                    'code' => $_REQUEST['code'],
                    'sorting' => $_REQUEST['sorting'],
                    'poster' => process_upload($_FILES['poster'])
                ]
            );
        }

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_review_video_delete() {
    global $wpdb;

    try {
        if (isset($_REQUEST['id'])) {
            $response = [
                'result' => !!$wpdb->delete('wp_exp_video_reviews', ['id' => $_REQUEST['id']])
            ];
        }
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_famous_client_change() {
    global $wpdb;

    try {
        if (!isset($_REQUEST['full_name'])) {
            throw new Exception('Необходимо указать имя');
        }

        if (isset($_REQUEST['id'])) {
            $wpdb->update(
                'wp_exp_famous_clients',
                ['full_name' => $_REQUEST['full_name']],
                ['id' => $_REQUEST['id']]
            );

            if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0 && $_FILES['photo']['tmp_name']) {
                $images = optimize_images(wp_upload_dir()['baseurl'] . process_upload($_FILES['photo']), 420, false, 840);
                $wpdb->update(
                    'wp_exp_famous_clients',
                    [
                        'photo_mobile_webp_1x' => $images['mobile']['webp']['1x'],
                        'photo_mobile_webp_2x' => $images['mobile']['webp']['2x'],
                        'photo_mobile_webp_3x' => $images['mobile']['webp']['3x'],
                        'photo_mobile_jpg_1x' => $images['mobile']['jpg']['1x'],
                        'photo_mobile_jpg_2x' => $images['mobile']['jpg']['2x'],
                        'photo_mobile_jpg_3x' => $images['mobile']['jpg']['3x'],
                        'photo_desktop_webp_1x' => $images['desktop']['webp']['1x'],
                        'photo_desktop_webp_2x' => $images['desktop']['webp']['2x'],
                        'photo_desktop_jpg_1x' => $images['desktop']['jpg']['1x'],
                        'photo_desktop_jpg_2x' => $images['desktop']['jpg']['2x']
                    ],
                    ['id' => $_REQUEST['id']]
                );
            }
        } else {
            if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== 0 || !$_FILES['photo']['tmp_name']) {
                throw new Exception('Фото не было загружено или в процессе загрузки произошла ошибка');
            }

            $images = optimize_images(wp_upload_dir()['baseurl'] . process_upload($_FILES['photo']), 420, false, 840);

            $wpdb->insert(
                'wp_exp_famous_clients', [
                    'full_name' => $_REQUEST['full_name'],
                    'photo_mobile_webp_1x' => $images['mobile']['webp']['1x'],
                    'photo_mobile_webp_2x' => $images['mobile']['webp']['2x'],
                    'photo_mobile_webp_3x' => $images['mobile']['webp']['3x'],
                    'photo_mobile_jpg_1x' => $images['mobile']['jpg']['1x'],
                    'photo_mobile_jpg_2x' => $images['mobile']['jpg']['2x'],
                    'photo_mobile_jpg_3x' => $images['mobile']['jpg']['3x'],
                    'photo_desktop_webp_1x' => $images['desktop']['webp']['1x'],
                    'photo_desktop_webp_2x' => $images['desktop']['webp']['2x'],
                    'photo_desktop_jpg_1x' => $images['desktop']['jpg']['1x'],
                    'photo_desktop_jpg_2x' => $images['desktop']['jpg']['2x']
                ]
            );
        }

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_famous_client_delete() {
    global $wpdb;

    try {
        if (isset($_REQUEST['id'])) {
            $response = [
                'result' => !!$wpdb->delete('wp_exp_famous_clients', ['id' => $_REQUEST['id']])
            ];
        }
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_result_photo_change() {
    global $wpdb;

    try {
        $collageUploadingResult = null;
        if (isset($_REQUEST['collage'])) {
            $collageUploadingResult = upload_collage_photo();

            if (!$collageUploadingResult && !isset($_REQUEST['id'])) {
                throw new Exception('Фото для коллажа не было загружено или в процессе загрузки произошла ошибка');
            }
        }

        if (isset($_REQUEST['id'])) {
            $collageAdditionalPhotoId = $wpdb->get_var(
                $wpdb->prepare(
                    'SELECT id from wp_exp_massage_result_photo WHERE main_photo_id = %d', [$_REQUEST['id']]
                )
            );

            $wpdb->update(
                'wp_exp_massage_result_photo',
                ['massage_id' => $_REQUEST['massage_id']],
                ['id' => $_REQUEST['id']]
            );

            if ($collageAdditionalPhotoId) {
                $wpdb->update(
                    'wp_exp_massage_result_photo',
                    ['massage_id' => $_REQUEST['massage_id']],
                    ['id' => $collageAdditionalPhotoId]
                );
            }

            if (isset($_FILES['photo']) && $_FILES['photo']['error'] === 0 && $_FILES['photo']['tmp_name']) {
                $images = optimize_images(wp_upload_dir()['baseurl'] . process_upload($_FILES['photo']), 325, false, 600);
                $wpdb->update(
                    'wp_exp_massage_result_photo',
                    [
                        'photo_mobile_webp_1x' => $images['mobile']['webp']['1x'],
                        'photo_mobile_webp_2x' => $images['mobile']['webp']['2x'],
                        'photo_mobile_webp_3x' => $images['mobile']['webp']['3x'],
                        'photo_mobile_jpg_1x' => $images['mobile']['jpg']['1x'],
                        'photo_mobile_jpg_2x' => $images['mobile']['jpg']['2x'],
                        'photo_mobile_jpg_3x' => $images['mobile']['jpg']['3x'],
                        'photo_desktop_webp_1x' => $images['desktop']['webp']['1x'],
                        'photo_desktop_webp_2x' => $images['desktop']['webp']['2x'],
                        'photo_desktop_jpg_1x' => $images['desktop']['jpg']['1x'],
                        'photo_desktop_jpg_2x' => $images['desktop']['jpg']['2x']
                    ],
                    ['id' => $_REQUEST['id']]
                );
            }

            if (!isset($_REQUEST['collage']) && !$collageUploadingResult) {
                $wpdb->delete('wp_exp_massage_result_photo', ['main_photo_id' => $_REQUEST['id']]);
            } else if ($collageUploadingResult) {
                $newData = [
                    'photo_mobile_webp_1x' => $collageUploadingResult['mobile']['webp']['1x'],
                    'photo_mobile_webp_2x' => $collageUploadingResult['mobile']['webp']['2x'],
                    'photo_mobile_webp_3x' => $collageUploadingResult['mobile']['webp']['3x'],
                    'photo_mobile_jpg_1x' => $collageUploadingResult['mobile']['jpg']['1x'],
                    'photo_mobile_jpg_2x' => $collageUploadingResult['mobile']['jpg']['2x'],
                    'photo_mobile_jpg_3x' => $collageUploadingResult['mobile']['jpg']['3x'],
                ];

                if ($collageAdditionalPhotoId) {
                    $wpdb->update('wp_exp_massage_result_photo', $newData, ['id' => $collageAdditionalPhotoId]);
                } else {
                    $newData['main_photo_id'] = $_REQUEST['id'];
                    $newData['massage_id'] = $_REQUEST['massage_id'];
                    $wpdb->insert('wp_exp_massage_result_photo', $newData);
                }
            }
        } else {
            if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== 0 || !$_FILES['photo']['tmp_name']) {
                throw new Exception('Фото не было загружено или в процессе загрузки произошла ошибка');
            }

            $images = optimize_images(wp_upload_dir()['baseurl'] . process_upload($_FILES['photo']), 325, false, 600);

            $wpdb->insert(
                'wp_exp_massage_result_photo', [
                    'massage_id' => $_REQUEST['massage_id'],
                    'photo_mobile_webp_1x' => $images['mobile']['webp']['1x'],
                    'photo_mobile_webp_2x' => $images['mobile']['webp']['2x'],
                    'photo_mobile_webp_3x' => $images['mobile']['webp']['3x'],
                    'photo_mobile_jpg_1x' => $images['mobile']['jpg']['1x'],
                    'photo_mobile_jpg_2x' => $images['mobile']['jpg']['2x'],
                    'photo_mobile_jpg_3x' => $images['mobile']['jpg']['3x'],
                    'photo_desktop_webp_1x' => $images['desktop']['webp']['1x'],
                    'photo_desktop_webp_2x' => $images['desktop']['webp']['2x'],
                    'photo_desktop_jpg_1x' => $images['desktop']['jpg']['1x'],
                    'photo_desktop_jpg_2x' => $images['desktop']['jpg']['2x']
                ]
            );

            if (isset($collageUploadingResult)) {
                $mainPhotoId = $wpdb->insert_id;
                $wpdb->insert(
                    'wp_exp_massage_result_photo', [
                        'massage_id' => $_REQUEST['massage_id'],
                        'main_photo_id' => $mainPhotoId,
                        'photo_mobile_webp_1x' => $collageUploadingResult['mobile']['webp']['1x'],
                        'photo_mobile_webp_2x' => $collageUploadingResult['mobile']['webp']['2x'],
                        'photo_mobile_webp_3x' => $collageUploadingResult['mobile']['webp']['3x'],
                        'photo_mobile_jpg_1x' => $collageUploadingResult['mobile']['jpg']['1x'],
                        'photo_mobile_jpg_2x' => $collageUploadingResult['mobile']['jpg']['2x'],
                        'photo_mobile_jpg_3x' => $collageUploadingResult['mobile']['jpg']['3x'],
                    ]
                );
            }
        }

        $response = [
            'result' => true
        ];
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function handle_result_photo_delete() {
    global $wpdb;

    try {
        if (isset($_REQUEST['id'])) {
            $wpdb->delete('wp_exp_massage_result_photo', ['id' => $_REQUEST['id']]);
            $wpdb->delete('wp_exp_massage_result_photo', ['main_photo_id' => $_REQUEST['id']]);
            $response = [
                'result' => true
            ];
        }
    } catch (Exception $e) {
        status_header(400);
        $response = [
            'result' => false,
            'error' => $e->getMessage()
        ];
    }

    exit(json_encode($response));
}

function upload_collage_photo() {
    if (!isset($_FILES['collage-photo']) || $_FILES['collage-photo']['error'] !== 0 || !$_FILES['collage-photo']['tmp_name']) {
        return false;
    }

    return optimize_images(wp_upload_dir()['baseurl'] . process_upload($_FILES['collage-photo']), 400, false, false);
}
