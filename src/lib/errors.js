export class PublicError extends Error {
  constructor(message) {
    super(message);
  }
}

export class AuthenticationError extends PublicError {
  constructor() {
    super("You must be logged in to view this content");
    this.name = "AuthenticationError";
  }
}

export class LoginError extends PublicError {
  constructor() {
    super("Invalid email or password");
    this.name = "LoginError";
  }
}

export class EmailInUseError extends PublicError {
  constructor() {
    super("Email is already in use");
    this.name = "EmailInUseError";
  }
}

// export class NotFoundError extends PublicError {
//   constructor() {
//     super("Resource not found");
//     this.name = "NotFoundError";
//   }
// }

export class TokenExpiredError extends PublicError {
  constructor() {
    super("Token has expired");
    this.name = "TokenExpiredError";
  }
}

export class AuthorizationError extends PublicError {
  constructor() {
    super("Not authorized to view this page");
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends PublicError {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class DuplicateValueError extends PublicError {
  constructor(message = "Deplicate Resource found") {
    super(message);
    this.name = "DuplicateValueError";
  }
}

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}
