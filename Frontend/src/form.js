document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginDiv = document.querySelector(".login");
  const signupDiv = document.querySelector(".signup");

  // ----------------------------
  // Password show/hide toggle
  // ----------------------------
  document.querySelectorAll(".eye-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const field = icon.parentElement.querySelector(".password");
      field.type = field.type === "password" ? "text" : "password";
      icon.classList.toggle("bx-show");
      icon.classList.toggle("bx-hide");
    });
  });

  // ----------------------------
  // Toggle login/signup forms
  // ----------------------------
  document.querySelector(".signup-link")?.addEventListener("click", e => {
    e.preventDefault();
    loginDiv.style.display = "none";
    signupDiv.style.display = "block";
  });

  document.querySelector(".login-link")?.addEventListener("click", e => {
    e.preventDefault();
    signupDiv.style.display = "none";
    loginDiv.style.display = "block";
  });

  // ----------------------------
  // Helper: fetch POST request
  // ----------------------------
  async function postData(url, payload) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      return { success:false, message: "Server error" };
    }
  }

  // ----------------------------
  // LOGIN
  // ----------------------------
  loginForm?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value.trim();
    const errorMsg = loginForm.querySelector(".error-msg");

    if(!email || !password) { 
      errorMsg.textContent = "Fill all fields"; 
      return; 
    }

    const data = await postData("http://localhost:8000/users/login", { email, password });
    if(data.token) {
      localStorage.setItem("authToken", data.token);
      window.location.href = "home.html";
    } else {
      errorMsg.textContent = data.message || "Login failed";
    }
  });

  // ----------------------------
  // SIGNUP
  // ----------------------------
  signupForm?.addEventListener("submit", async e => {
    e.preventDefault();
    const firstName = signupForm.firstName.value.trim();
    const lastName = signupForm.lastName.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();
    const confirmPassword = signupForm.confirmPassword.value.trim();
    const errorMsg = signupForm.querySelector(".error-msg");

    if(!firstName || !lastName || !email || !password || !confirmPassword) {
      errorMsg.textContent = "Fill all fields"; 
      return; 
    }
    if(password !== confirmPassword){
      errorMsg.textContent = "Passwords do not match"; 
      return; 
    }

    const data = await postData("http://localhost:8000/users/register", { firstName, lastName, email, password });
    if(data.token) {
      // Direct login after signup
      localStorage.setItem("authToken", data.token);
      window.location.href = "home.html";
    } else {
      errorMsg.textContent = data.message || "Signup failed";
    }
  });
});
