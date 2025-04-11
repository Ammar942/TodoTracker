<template>
  <div>
    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-3xl font-semibold mb-6">📁 Projects</h2>

      <template v-if="projects">
        <div v-if="projects.length > 0">
          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-white p-4 mb-4 rounded-md shadow-lg"
          >
            <div
              class="p-4 rounded hover:bg-gray-100 flex justify-between items-start"
            >
              <RouterLink
                :to="`/projects/${project._id}`"
                class="flex-1 gap-4 block"
              >
                <div>
                  <div class="flex justify-between items-center">
                    <h3 class="text-xl font-medium">{{ project.name }}</h3>
                  </div>
                  <p class="text-gray-700 mt-5 ml-5">
                    {{ project.description }}
                  </p>
                </div>
              </RouterLink>

              <div class="ml-4 text-right">
                <button
                  @click.stop="deleteProject(project._id)"
                  class="cursor-pointer text-xl font-bold mb-4"
                  title="Delete project"
                >
                  🗑️
                </button>

                <p v-if="project.deadline" class="text-sm text-gray-600 mt-2">
                  📅 Deadline: {{ formatDate(project.deadline) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-gray-500">No projects found.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
const projects = ref([]);
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "/login";
}

const fetchProjects = async () => {
  try {
    const response = await fetch("http://localhost:5000/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      projects.value = data.data;
      console.log("Projects fetched successfully:", projects.value);
      if (projects) {
        console.log("Projects:", projects.value);
        console.log("Projects:", projects.value.length);
      }
    } else {
      console.error("Failed to fetch projects");
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
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
    projects.value = projects.value.filter((p) => p._id !== projectId);
  } catch (err) {
    console.error("Error deleting project", err);
  }
};
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
onMounted(() => {
  fetchProjects();
});
</script>
