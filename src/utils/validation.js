// Form validation utilities for SmartGuard

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Password is required';
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
}

export function validateFullName(name) {
  if (!name || !name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}
