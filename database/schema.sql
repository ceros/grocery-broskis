/* Peer Review Schema file */

CREATE TABLE `users` (
    `id`    BIGINT unsigned NOT NULL AUTO_INCREMENT,
    `name`  VARCHAR(256) NOT NULL,
    `password`  VARCHAR(64) NOT NULL,
    `email`     VARCHAR(256) NOT NULL,
    `created_date`  DATETIME NOT NULL,
    `updated_date`  DATETIME,
    PRIMARY KEY (`id`),
    INDEX `name` (`name`)
);

CREATE TABLE `lists` (
    `id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT unsigned NOT NULL,
    `shopper_id`    BIGINT unsigned,
    `address`   VARCHAR(512) NOT NULL,
    `latitude`  DECIMAL(16,13),
    `longitude`  DECIMAL(16,13),
    `status`    VARCHAR(64) NOT NULL, 
    `budget`    DECIMAL(15,2),
    `created_date`  DATETIME NOT NULL,
    `update_date`   DATETIME,
    PRIMARY KEY (`id`),
    INDEX `user_id` (`user_id`),
    INDEX `shopper_id` (`shopper_id`)

);

CREATE TABLE `items` (
    `id` BIGINT unsigned NOT NULL AUTO_INCREMENT,
    `list_id`   BIGINT unsigned NOT NULL,
    `description`   VARCHAR(256) NOT NULL,
    `replaceable`   BOOLEAN NOT NULL,
    `created_date`  DATETIME NOT NULL,
    `update_date`   DATETIME,
    PRIMARY KEY (`id`),
    INDEX `list_id` (`list_id`)
);

CREATE TABLE `list_stores` (
    `list_id` BIGINT unsigned,
    `store_place_id` VARCHAR(64),
    INDEX list_store (list_id, store_place_id),
    FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE ON UPDATE CASCADE
);
