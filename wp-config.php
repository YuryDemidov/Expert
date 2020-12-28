<?php
/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://ru.wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
/** Имя базы данных для WordPress */
define( 'DB_NAME', 'expert' );

/** Имя пользователя MySQL */
define( 'DB_USER', 'expert_user' );

/** Пароль к базе данных MySQL */
define( 'DB_PASSWORD', '111111' );

/** Имя сервера MySQL */
define( 'DB_HOST', 'localhost' );

/** Кодировка базы данных для создания таблиц. */
define( 'DB_CHARSET', 'utf8mb4' );

/** Схема сопоставления. Не меняйте, если не уверены. */
define( 'DB_COLLATE', '' );

/**#@+
 * Уникальные ключи и соли для аутентификации.
 *
 * Смените значение каждой константы на уникальную фразу.
 * Можно сгенерировать их с помощью {@link https://api.wordpress.org/secret-key/1.1/salt/ сервиса ключей на WordPress.org}
 * Можно изменить их, чтобы сделать существующие файлы cookies недействительными. Пользователям потребуется авторизоваться снова.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'ZH7V ]<yc=V2F2[L-yK,BN3SAygxB&}6a,{iV*RvWHrUXnWq+rI).pwMW*NiL(2T' );
define( 'SECURE_AUTH_KEY',  'TK-q3m,N>J%!Cy`.<F^Iw(=Ho[N[I%>~[=8:Z8[!y>h`^oeV4^Vmk-@s&3fG/lkg' );
define( 'LOGGED_IN_KEY',    '{U!qsm4b6bw]=>;D{_CoTBFryN%~=%^go%aLjdYHw+ezt|&uj~R*/1$G=b6M}hnA' );
define( 'NONCE_KEY',        'Erq}|p5Sppw%!FW9YuwQ~%;MHB}#POgdn|wzD*k$&AJChZQd{;X~imWYYN?qm(OZ' );
define( 'AUTH_SALT',        '4?v}Q`oNOe2xPa77ZdUngdqh|5r(L`j+&H75U(tpeuiws9(L++3n;|<u$_ONm==N' );
define( 'SECURE_AUTH_SALT', '8npAU~St;Y[#XQkk}KhW=(<j>F9m&qtSYT@V7]Z+rXnZS1{#29*fK/z]hJy4t:+w' );
define( 'LOGGED_IN_SALT',   ']+xT9}N_`e>s4/;UBVt/2AyuKL2P*|]7bFHMcG^gbua4r+A|4_D&CA(dq:mOn[;<' );
define( 'NONCE_SALT',       'rgEZngOiIJ_?`r[wUR2yd~KFi$QS;(MntXo~W>SMvLU x?>D`y1{iX18j;y^2ecL' );

/**#@-*/

/**
 * Префикс таблиц в базе данных WordPress.
 *
 * Можно установить несколько сайтов в одну базу данных, если использовать
 * разные префиксы. Пожалуйста, указывайте только цифры, буквы и знак подчеркивания.
 */
$table_prefix = 'exp_';

/**
 * Для разработчиков: Режим отладки WordPress.
 *
 * Измените это значение на true, чтобы включить отображение уведомлений при разработке.
 * Разработчикам плагинов и тем настоятельно рекомендуется использовать WP_DEBUG
 * в своём рабочем окружении.
 *
 * Информацию о других отладочных константах можно найти в документации.
 *
 * @link https://ru.wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Это всё, дальше не редактируем. Успехов! */

/** Абсолютный путь к директории WordPress. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Инициализирует переменные WordPress и подключает файлы. */
require_once ABSPATH . 'wp-settings.php';

