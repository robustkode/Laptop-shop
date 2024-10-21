PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_product_orders` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`product_id` text(36) NOT NULL,
	`product_variant_id` text(36),
	`price` real NOT NULL,
	`value` text,
	`variant_name` text,
	`quantity` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	`created_day` text,
	`user_id` text(36),
	`status` text,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_product_orders`("id", "product_id", "product_variant_id", "price", "value", "variant_name", "quantity", "created_at", "updated_at", "created_day", "user_id", "status") SELECT "id", "product_id", "product_variant_id", "price", "value", "variant_name", "quantity", "created_at", "updated_at", "created_day", "user_id", "status" FROM `product_orders`;--> statement-breakpoint
DROP TABLE `product_orders`;--> statement-breakpoint
ALTER TABLE `__new_product_orders` RENAME TO `product_orders`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `orders_product_id_idx` ON `product_orders` (`product_id`);--> statement-breakpoint
CREATE INDEX `orders_product_variant_id_idx` ON `product_orders` (`product_variant_id`);