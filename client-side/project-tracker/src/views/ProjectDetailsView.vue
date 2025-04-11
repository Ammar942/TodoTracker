<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-center text-blue-800">
      📁 Project Details
    </h1>

    <div v-if="project" class="bg-white shadow-md rounded-xl p-6">
      <div class="mb-4 flex justify-between items-start">
        <div class="flex-1">
          <h2 class="text-2xl font-semibold text-gray-800">
            {{ project.name }}
          </h2>
          <p class="text-gray-600 ml-2 mt-2">{{ project.description }}</p>
        </div>

        <div class="text-right ml-4">
          <button
            @click="deleteProject(project._id)"
            class="cursor-pointer text-xl mb-4"
            title="Delete Project"
          >
            🗑️
          </button>
          <p v-if="project.deadline" class="text-sm text-gray-500 mt-1">
            📅 Deadline: {{ formatDate(project.deadline) }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 items-center justify-center mb-6">
        <select
          v-model="filters.status"
          class="cursor-pointer border px-3 py-2 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Statuses</option>
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select
          v-model="filters.priority"
          class="cursor-pointer border px-3 py-2 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          v-model="filters.deadline"
          class="cursor-pointer border px-3 py-2 rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Deadlines</option>
          <option value="today">Due Today</option>
          <option value="week">Due This Week</option>
        </select>
      </div>

      <h3 class="text-xl font-medium text-gray-700 mb-4">📝 Tasks</h3>

      <ul v-if="filteredTasks.length" class="space-y-4">
        <li
          v-for="task in filteredTasks"
          :key="task._id"
          class="border border-gray-200 bg-gray-50 rounded-lg p-4 shadow-sm"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-lg">{{ task.taskName }}</span>
            <button
              @click="deleteTask(task._id)"
              class="text-sm cursor-pointer"
            >
              🗑️
            </button>
          </div>

          <p class="text-sm text-gray-600 mb-2">
            📅 Due: {{ formatDate(task.endDate) }}
          </p>
          <p class="text-sm text-gray-600 mb-2">📌 Status: {{ task.status }}</p>
          <p v-if="task.reminder" class="text-sm text-blue-600">
            🔔 Reminder: before {{ task.reminder }}
          </p>

          <div class="mt-4 flex items-center justify-between">
            <select
              v-if="task.status !== 'Completed'"
              v-model="task.status"
              @change="updateTaskStatus(task._id, task.status)"
              class="px-2 py-1 border rounded bg-white text-sm"
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div
              v-if="task.status === 'Completed' && task.timeSpent"
              class="text-sm text-green-700"
            >
              ⏱️ Time Spent: {{ formatTime(task.timeSpent) }}
            </div>

            <span
              class="text-xs font-medium px-3 py-1 rounded-full"
              :class="{
                'bg-red-200 text-red-800': task.priority === 'High',
                'bg-yellow-200 text-yellow-800': task.priority === 'Medium',
                'bg-green-200 text-green-800': task.priority === 'Low',
              }"
            >
              Priority: {{ task.priority }}
            </span>
          </div>
        </li>
      </ul>

      <div
        v-else
        class="text-center mt-6 flex flex-col items-center justify-center"
      >
        <p class="text-gray-500 mb-4">No tasks available.</p>
        <RouterLink
          :to="{
            path: '/add-task',
            query: { projectName: project.name },
          }"
          class="bg-indigo-200 text-blue-500 px-4 py-2 rounded-lg shadow hover:bg-blue-700 hover:text-white"
        >
          ➕ Add Task
        </RouterLink>
      </div>
    </div>

    <div v-else class="text-gray-600 text-center mt-6">Loading project...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const project = ref(null);

const filters = ref({
  status: "",
  priority: "",
  deadline: "",
});
const fetchProjectDetails = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(
      `http://localhost:5000/projects/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    if (data.status === "success") {
      project.value = data.data;
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error("Failed to fetch project details", error);
  }
};
const deleteProject = async (projectId) => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`http://localhost:5000/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push("/");
  } catch (err) {
    console.error("Error deleting project", err);
  }
};
const deleteTask = async (taskId) => {
  const token = localStorage.getItem("token");
  try {
    await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    project.value.tasks = project.value.tasks.filter((t) => t._id !== taskId);
  } catch (err) {
    console.error("Error deleting task", err);
  }
};
const updateTaskStatus = async (taskId, newStatus) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });
    const data = await res.json();
    if (data?.data?.timeSpent) {
      project.value.tasks = project.value.tasks.map((task) => {
        if (task._id === taskId) {
          return { ...task, timeSpent: data.data.timeSpent };
        }
        return task;
      });
    }
  } catch (err) {
    console.error("Error updating status", err);
  }
};

const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return today.toDateString() === d.toDateString();
};

const isThisWeek = (date) => {
  const today = new Date();
  const d = new Date(date);
  const diff = d - today;
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
};

const filteredTasks = computed(() => {
  if (!project.value) return [];
  return project.value.tasks.filter((task) => {
    const matchesStatus =
      !filters.value.status || task.status === filters.value.status;
    const matchesPriority =
      !filters.value.priority || task.priority === filters.value.priority;
    const matchesDeadline =
      !filters.value.deadline ||
      (filters.value.deadline === "today" &&
        isToday(task.endDate) &&
        task.status !== "Completed") ||
      (filters.value.deadline === "week" &&
        isThisWeek(task.endDate) &&
        task.status !== "Completed");

    return matchesStatus && matchesPriority && matchesDeadline;
  });
});
const formatTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hrs}h ${mins}m ${secs}s`;
};
onMounted(fetchProjectDetails);

const formatDate = (dateStr) => new Date(dateStr).toLocaleString();
</script>
