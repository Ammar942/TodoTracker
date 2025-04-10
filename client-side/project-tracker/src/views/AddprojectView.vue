<template>
  <div>
    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-3xl font-semibold mb-6">Add New Project</h2>
      <form
        @submit.prevent="handleSubmit"
        class="bg-white p-6 rounded-md shadow-lg"
      >
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Project Name</label
          >
          <input
            type="text"
            id="name"
            v-model="project.name"
            required
            class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div v-if="message">
            <p class="text-red-500 text-sm mt-2">{{ message }}</p>
          </div>
        </div>

        <div class="mb-4">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            id="description"
            v-model="project.description"
            required
            class="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Project
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login";
}
const project = ref({
  name: "",
  description: "",
});
const message = ref("");
const router = useRouter();

const handleSubmit = async () => {
  try {
    const response = await fetch("http://localhost:5000/projects/add-project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project.value),
    });

    if (response.ok) {
      router.push("/");
    } else {
      const data = await response.json();
      message.value = data.message || "Failed to add project";
      console.error("Failed to add project");
    }
  } catch (error) {
    console.log(error);
    console.error("Error adding project:", error);
  }
};
</script>
