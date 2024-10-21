CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`phone` text,
	`password` text NOT NULL,
	`salt` text NOT NULL,
	`role` integer DEFAULT 1
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_unique` ON `users` (`phone`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`images` text DEFAULT 'null',
	`price` real DEFAULT '0' NOT NULL,
	`original_price` real DEFAULT '0',
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
CREATE TABLE `admins` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`email` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admins_email_unique` ON `admins` (`email`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`email_verified` integer DEFAULT 0,
	`telegram` text,
	`created_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_telegram_unique` ON `customers` (`telegram`);