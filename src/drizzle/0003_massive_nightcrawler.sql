CREATE TABLE `product_orders` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`product_id` text(36) NOT NULL,
	`product_variant_id` text(36),
	`price` real NOT NULL,
	`value` text,
	`quantity` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `orders_product_id_idx` ON `product_orders` (`product_id`);--> statement-breakpoint
CREATE INDEX `orders_product_variant_id_idx` ON `product_orders` (`product_variant_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`images` text DEFAULT 'null',
	`price` real DEFAULT 0 NOT NULL,
	`original_price` real DEFAULT 0,
	`inventory` integer DEFAULT 0 NOT NULL,
	`rating` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`text` text NOT NULL,
	`brand` text NOT NULL,
	`condition` text NOT NULL,
	`generation` text,
	`ram` text,
	`storage` text,
	`storage_type` text,
	`created_at` integer NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "name", "description", "images", "price", "original_price", "inventory", "rating", "status", "text", "brand", "condition", "generation", "ram", "storage", "storage_type", "created_at", "updated_at") SELECT "id", "name", "description", "images", "price", "original_price", "inventory", "rating", "status", "text", "brand", "condition", "generation", "ram", "storage", "storage_type", "created_at", "updated_at" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
PRAGMA foreign_keys=ON;