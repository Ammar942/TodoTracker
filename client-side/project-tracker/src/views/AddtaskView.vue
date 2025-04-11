<template>
  <div>
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-3xl font-semibold mb-6">Add New Task</h2>

      <form
        @submit.prevent="handleSubmit"
        class="bg-white p-6 rounded-md shadow-lg space-y-5"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Project Name</label
          >
          <input
            v-model="task.project"
            type="text"
            required
            class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div v-if="message">
          <p class="text-red-500 text-sm mt-2">{{ message }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Task Name</label
          >
          <input
            v-model="task.name"
            type="text"
            required
            class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Priority</label
          >
          <select
            v-model="task.priority"
            required
            class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option disabled value="">Select priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >End Date</label
          >
          <input
            v-model="task.endDate"
            type="datetime-local"
            required
            class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Set Reminder (Optional)</label
          >
          <select
            v-model="task.reminder"
            class="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option disabled value="">Select reminder time</option>
            <option value="24h">24 hours before</option>
            <option value="12h">12 hours before</option>
            <option value="1h">1 hour before</option>
          </select>
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Add Task
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const task = ref({
  projectName: "",
  taskName: "",
  priority: "",
  endDate: "",
  reminder: "",
});
const message = ref("");

const handleSubmit = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }
  try {
    const response = await fetch("http://localhost:5000/tasks/add-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task.value),
    });

    if (response.ok) {
      router.push("/");
    } else {
      const errorData = await response.json();
      message.value = errorData.message || "Failed to add task";
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
onMounted(() => {
  if (route.query.projectName) {
    task.value.project = route.query.projectName;
  }
});
</script>
