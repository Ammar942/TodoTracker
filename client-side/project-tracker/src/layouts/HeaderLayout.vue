<template>
  <header class="bg-indigo-600 p-4 shadow-lg">
    <div class="flex justify-between items-center max-w-6xl mx-auto text-white">
      <div class="font-bold text-xl">
        <router-link to="/" class="text-white hover:text-indigo-300">
          Todo Tracker
        </router-link>
      </div>

      <button
        @click="toggleMenu"
        class="sm:hidden text-white focus:outline-none"
      >
        <svg
          v-if="!isMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <nav class="hidden sm:block">
        <ul class="flex space-x-6">
          <li>
            <router-link to="/" class="hover:text-indigo-300"
              >Projects</router-link
            >
          </li>
          <li>
            <router-link to="/add-project" class="hover:text-indigo-300"
              >Add Project</router-link
            >
          </li>
          <li>
            <router-link to="/add-task" class="hover:text-indigo-300"
              >Add Task</router-link
            >
          </li>
          <li class="ms-10">
            <router-link
              @click="logouthandler"
              to="/login"
              class="hover:text-indigo-300"
              >Logout</router-link
            >
          </li>
        </ul>
      </nav>
    </div>

    <div
      v-if="isMenuOpen"
      class="sm:hidden mt-3 bg-indigo-500 text-white px-4 py-2 rounded shadow max-w-6xl mx-auto"
    >
      <ul class="space-y-3">
        <li>
          <router-link
            @click="toggleMenu"
            to="/"
            class="block hover:text-indigo-300"
            >Projects</router-link
          >
        </li>
        <li>
          <router-link
            @click="toggleMenu"
            to="/add-project"
            class="block hover:text-indigo-300"
            >Add Project</router-link
          >
        </li>
        <li>
          <router-link
            @click="toggleMenu"
            to="/add-task"
            class="block hover:text-indigo-300"
            >Add Task</router-link
          >
        </li>
        <li>
          <router-link
            @click="
              () => {
                logouthandler();
                toggleMenu();
              }
            "
            to="/login"
            class="block hover:text-indigo-300"
            >Logout</router-link
          >
        </li>
      </ul>
    </div>
  </header>

  <RouterView />
</template>

<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const logouthandler = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
</script>
