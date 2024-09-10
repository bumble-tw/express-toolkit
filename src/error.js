// utils/errors.js
class ValidationError extends Error {
  constructor(message, data) {
    super(message || "Validation failed")
    this.name = "VALIDATION_ERROR"
    this.statusCode = 422
    this.data = data || null
  }
}

class DatabaseConflictError extends Error {
  constructor(message, data) {
    super(message || "Database conflict")
    this.name = "DATABASE_CONFLICT_ERROR"
    this.statusCode = 409
    this.data = data || null
  }
}

class PermissionError extends Error {
  constructor(message, data) {
    super(message || "Permission denied")
    this.name = "PERMISSION_ERROR"
    this.statusCode = 403
    this.data = data || null
  }
}

class ThirdPartyPackageError extends Error {
  constructor(message, data) {
    super(message || "Third-party package error")
    this.name = "THIRD_PARTY_PACKAGE_ERROR"
    this.statusCode = 502
    this.data = data || null
  }
}

class ThirdPartyServiceError extends Error {
  constructor(message, data) {
    super(message || "Third-party service error")
    this.name = "THIRD_PARTY_SERVICE_ERROR"
    this.statusCode = 503
    this.data = data || null
  }
}

class ApplicationError extends Error {
  constructor(message, data) {
    super(message || "Application error")
    this.name = "APPLICATION_ERROR"
    this.statusCode = 400
    this.data = data || null
  }
}

module.exports = {
  ValidationError,
  DatabaseConflictError,
  PermissionError,
  ThirdPartyPackageError,
  ThirdPartyServiceError,
  ApplicationError,
}
