/* Peer Review Schema file */

CREATE TABLE `users` (
    `id`    BIGINT unsigned NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(256),
    `password`  VARCHAR(64),
    `email`     VARCHAR(256),
    `created_date`  DATETIME,
    `updated_date`  DATETIME,
    PRIMARY KEY (`id`),
    INDEX `name` (`name`)
);

    


