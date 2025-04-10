<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const form = ref({
  name: "",
  email: "",
  password: "",
});
const showPassword = ref(false);
const error = ref("");
const message = ref("");

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  try {
    error.value = "";
    message.value = "";

    const formData = {
      username: form.value.name,
      email: form.value.email,
      password: form.value.password,
    };

    const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      message.value = data.message;

      form.value.name = "";
      form.value.email = "";
      form.value.password = "";
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      error.value = data.message || "Something went wrong. Please try again.";
    }
  } catch (err) {
    error.value = "Network error. Please try again.";
  }
};
</script>
<template>
  <div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-[100px]">
    <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">
      Sign Up
    </h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Name</label
        >
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
          placeholder="Enter your name"
          class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700"
          >Email</label
        >
        <input
          type="email"
          id="email"
          v-model="form.email"
          required
          placeholder="Enter your email"
          class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div class="mb-6 relative">
        <label for="password" class="block text-sm font-medium text-gray-700"
          >Password</label
        >
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          v-model="form.password"
          required
          placeholder="Enter your password"
          class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
        />
        <span
          class="absolute right-3 top-12 transform -translate-y-1/2 cursor-pointer text-gray-500"
          @click="togglePassword"
        >
          <svg
            v-if="showPassword"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.964 9.964 0 012.293-3.95M6.284 6.284A9.964 9.964 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.963 9.963 0 01-4.37 5.818M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3l18 18"
            />
          </svg>
        </span>
      </div>

      <button
        type="submit"
        class="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Sign Up
      </button>

      <p v-if="error" class="mt-4 text-red-600 text-sm text-center">
        {{ error }}
      </p>
      <p v-if="message" class="mt-4 text-green-600 text-sm text-center">
        {{ message }}
      </p>
    </form>
    <p class="mt-4 text-sm text-center">
      have an account?
      <router-link to="/login" class="text-indigo-600 hover:text-indigo-800"
        >Login</router-link
      >
    </p>
  </div>
</template>
