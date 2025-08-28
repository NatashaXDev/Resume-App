// Global state
let currentUser = null;
let uploadedFile = null;

// DOM Elements
const landingPage = document.getElementById("landing-page");
const builderPage = document.getElementById("builder-page");
const loginModal = document.getElementById("loginModal");
const signupModal = document.getElementById("signupModal");
const notification = document.getElementById("notification");
const uploadArea = document.getElementById("uploadArea");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const resumeForm = document.getElementById("resumeForm");

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  setupEventListeners();
  checkAuthState();
});

// Event Listeners
function setupEventListeners() {
  // File upload
  uploadArea.addEventListener("click", () => fileInput.click());
  uploadArea.addEventListener("dragover", handleDragOver);
  uploadArea.addEventListener("dragleave", handleDragLeave);
  uploadArea.addEventListener("drop", handleDrop);
  fileInput.addEventListener("change", handleFileSelect);

  // Form submission
  resumeForm.addEventListener("submit", handleResumeSubmit);

  // Modal close on outside click
  window.addEventListener("click", handleOutsideClick);

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeydown);
}

// Authentication functions
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  // Simulate login
  if (email && password) {
    currentUser = { email, name: email.split("@")[0] };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    closeModal("login");
    showBuilder();
    showNotification(
      "Welcome back! You have successfully logged in.",
      "success"
    );
  } else {
    showNotification("Please fill in all fields.", "error");
  }
}

function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  // Simulate signup
  if (name && email && password) {
    currentUser = { email, name };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    closeModal("signup");
    showBuilder();
    showNotification(
      `Welcome ${name}! Your account has been created successfully.`,
      "success"
    );
  } else {
    showNotification("Please fill in all fields.", "error");
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  showLanding();
  showNotification("You have been logged out successfully.", "success");
}

function checkAuthState() {
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showBuilder();
  }
}

// Page navigation
function showLanding() {
  landingPage.classList.add("active");
  builderPage.classList.remove("active");
}

function showBuilder() {
  landingPage.classList.remove("active");
  builderPage.classList.add("active");
}

// Modal functions
function showModal(type) {
  const modal = type === "login" ? loginModal : signupModal;
  modal.classList.add("active");
  modal.style.display = "flex";

  // Focus first input
  setTimeout(() => {
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeModal(type) {
  const modal = type === "login" ? loginModal : signupModal;
  modal.classList.remove("active");
  setTimeout(() => {
    modal.style.display = "none";
    // Clear form
    const form = modal.querySelector("form");
    if (form) form.reset();
  }, 300);
}

function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => showModal(to), 300);
}

function handleOutsideClick(event) {
  if (event.target.classList.contains("modal")) {
    const modalType = event.target.id === "loginModal" ? "login" : "signup";
    closeModal(modalType);
  }
}

function handleKeydown(event) {
  if (event.key === "Escape") {
    if (loginModal.classList.contains("active")) closeModal("login");
    if (signupModal.classList.contains("active")) closeModal("signup");
  }
}

// File upload functions
function handleDragOver(event) {
  event.preventDefault();
  uploadArea.classList.add("dragover");
}

function handleDragLeave(event) {
  event.preventDefault();
  uploadArea.classList.remove("dragover");
}

function handleDrop(event) {
  event.preventDefault();
  uploadArea.classList.remove("dragover");

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    handleFile(file);
  }
}

function handleFile(file) {
  // Validate file type
  if (file.type !== "application/pdf") {
    showNotification("Please upload a PDF file only.", "error");
    return;
  }

  // Validate file size (20MB = 20 * 1024 * 1024 bytes)
  const maxSize = 20 * 1024 * 1024;
  if (file.size > maxSize) {
    showNotification("File size must be less than 20MB.", "error");
    return;
  }

  uploadedFile = file;

  // Update UI
  fileName.textContent = file.name;
  fileSize.textContent = formatFileSize(file.size);
  fileInfo.style.display = "flex";
  uploadArea.style.display = "none";

  showNotification("Resume uploaded successfully!", "success");
}

function removeFile() {
  uploadedFile = null;
  fileInput.value = "";
  fileInfo.style.display = "none";
  uploadArea.style.display = "block";
  showNotification("File removed.", "success");
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Form submission
function handleResumeSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const companyName = formData.get("companyName");
  const jobTitle = formData.get("jobTitle");
  const jobDescription = formData.get("jobDescription");

  // Validate required fields
  if (!companyName || !jobTitle || !jobDescription) {
    showNotification("Please fill in all required fields.", "error");
    return;
  }

  if (!uploadedFile) {
    showNotification("Please upload your resume.", "error");
    return;
  }

  // Simulate analysis
  showNotification(
    "Analyzing your resume... This may take a few moments.",
    "success"
  );

  // Simulate processing time
  setTimeout(() => {
    showNotification(
      "Resume analysis complete! Your tailored resume is ready.",
      "success"
    );
    // Here you would typically redirect to results page or show results
  }, 3000);
}

// Notification system
function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add("show");

  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 5000);
}

// Utility functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Add loading states for better UX
function showLoading(element) {
  const originalText = element.textContent;
  element.textContent = "Loading...";
  element.disabled = true;

  return function hideLoading() {
    element.textContent = originalText;
    element.disabled = false;
  };
}

// Initialize tooltips and other enhancements
function initializeEnhancements() {
  // Add subtle animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll(".form-section, .floating-card").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// Call enhancements after DOM is loaded
document.addEventListener("DOMContentLoaded", initializeEnhancements);

/*
Copyright (c) 2025 Natasha Smith Licensed under the MIT License
*/
