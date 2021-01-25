<?php

/*
 * Place here all your WordPress add_filter() and add_action() calls.
 */

add_filter('wordless_pug_configuration', 'custom_pug_options', 10, 1);

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
// Admin panel handlers
add_action('admin_post_review_change', 'handle_review_change');
add_action('admin_post_review_delete', 'handle_review_delete');

/*
 * Change pug template engine options such as expression language (php / js)
 * or caching of generated pages
 */
function custom_pug_options(array $options): array {
    $options['expressionLanguage'] = 'js';
    $options['cache'] = false;

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

        $emailMessage = 'Телефон: ' . $phone . '\n' . 'Имя: ' . $name . '\n';
        if ($_REQUEST['massage-id']) {
            $emailMessage .= 'Желаемый массаж: ' . $wpdb->get_var(
                $wpdb->prepare(
                    'SELECT full_name FROM wp_exp_massages WHERE id = %d', $_REQUEST['massage-id']
                )
            ) . '\n';
        }
        if ($_REQUEST['specialist-id']) {
            $emailMessage .= 'Выбранный специалист: ' . $wpdb->get_var(
                $wpdb->prepare(
                    'SELECT surname FROM wp_exp_specialists WHERE id = %d', $_REQUEST['specialist-id']
                )
            ) . '\n';
        }
        if ($_REQUEST['need-certificate']) {
            $emailMessage .= 'Нужен сертификат';
        }

        wp_mail(
            'demiddinamit@mail.ru',
            'Новая заявка на массаж',
            $emailMessage
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
            'age' => $_REQUEST['age'],
            'problems' => $_REQUEST['problems'],
            'spine_disease' => $_REQUEST['spine-disease'],
            'expectations' => $_REQUEST['expectations'],
            'previous_experience' => $_REQUEST['previous-experience'],
            'date' => current_time('mysql')
        ]);

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
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Email указан некорректно');
        }
        if (!$review) {
            throw new Exception('Отзыв не может быть пустым');
        }

        $wpdb->insert('wp_exp_reviews', [
            'text' => $review,
            'author' => $name,
            'email' => $email,
            'source' => 'site',
            'date' => current_time('mysql')
        ]);

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

function handle_review_change() {
    global $wpdb;

    try {
        if ($_REQUEST['massage_type']) {
            $wpdb->update('wp_exp_reviews', [
                'massage_type' => $_REQUEST['massage_type'] === 'default' ? null : $_REQUEST['massage_type']
            ], [
                'id' => $_REQUEST['id']
            ]);
        } else if ($_REQUEST['specialist_id']) {
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

function get_request_result($request) {
    $ch = curl_init();
    curl_setopt($ch,CURLOPT_URL,$request);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $server_output = curl_exec($ch);
    curl_close($ch);
    return $server_output;
}

function extract_phone($string) {
    return str_replace(['(', ')', '-', ' '], '', $string);
}

function is_valid_phone($phone) {
    return preg_match('/^\+?([87](?!95[5-79]|99[08]|907|94[^0]|336)([348]\d|9[0-6789]|7[01247])\d{8}|[1246]\d{9,13}|68\d{7}|5[1-46-9]\d{8,12}|55[1-9]\d{9}|55[138]\d{10}|55[1256][14679]9\d{8}|554399\d{7}|500[56]\d{4}|5016\d{6}|5068\d{7}|502[45]\d{7}|5037\d{7}|50[4567]\d{8}|50855\d{4}|509[34]\d{7}|376\d{6}|855\d{8,9}|856\d{10}|85[0-4789]\d{8,10}|8[68]\d{10,11}|8[14]\d{10}|82\d{9,10}|852\d{8}|90\d{10}|96(0[79]|17[0189]|181|13)\d{6}|96[23]\d{9}|964\d{10}|96(5[569]|89)\d{7}|96(65|77)\d{8}|92[023]\d{9}|91[1879]\d{9}|9[34]7\d{8}|959\d{7,9}|989\d{9}|971\d{8,9}|97[02-9]\d{7,11}|99[^4568]\d{7, 11}|994\d{9}|9955\d{8}|996[2579]\d{8}|9989\d{8}|380[345679]\d{8}|381\d{9}|38[57]\d{8,9}|375[234]\d{8}|372\d{7,8}|37[0-4]\d{8}|37[6-9]\d{7,11}|30[69]\d{9}|34[67]\d{8}|3459\d{11}|3[12359]\d{8,12}|36\d{9}|38[169]\d{8}|382\d{8,9}|46719\d{10})$/Ui', $phone);
}
