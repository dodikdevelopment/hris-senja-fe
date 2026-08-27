<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  SearchIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  CheckCircleIcon,
} from "lucide-vue-next";
import { useOptionStore } from "@/stores/option";

const router = useRouter();

const optionStore = useOptionStore();
const { employmentTypes, jobStatuses } = storeToRefs(optionStore);
const { fetchEmploymentTypes, fetchJobStatuses } = optionStore;

const filters = ref({
  search: "",
  type: "",
  status: "",
});

onMounted(() => {
  fetchEmploymentTypes();
  fetchJobStatuses();
});

// Diteruskan ke EmployeeList lewat query string; halaman itu membaca
// route.query saat mount dan langsung memakainya sebagai filter awal.
const handleSearch = () => {
  const query = {};
  if (filters.value.search) query.search = filters.value.search;
  if (filters.value.type) query.type = filters.value.type;
  if (filters.value.status) query.status = filters.value.status;

  router.push({ name: "admin.employees", query });
};
</script>

<template>
  <!-- Search Section -->
  <form
    class="bg-white border border-[#DCDEDD] rounded-[20px] mb-6 p-4"
    @submit.prevent="handleSearch"
  >
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
    >
      <!-- Search Bar -->
      <div class="flex-1 relative">
        <div
          class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
        >
          <SearchIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          v-model="filters.search"
          class="w-full pl-12 pr-4 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 focus:bg-white transition-all duration-300"
          placeholder="Cari karyawan berdasarkan nama, jabatan..."
        />
      </div>

      <!-- Filter and Action Buttons -->
      <div
        class="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto"
      >
        <!-- Employment Type Filter -->
        <div class="relative w-full sm:w-auto">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <BriefcaseIcon class="h-4 w-4 text-gray-400" />
          </div>
          <select
            v-model="filters.type"
            class="w-full sm:w-auto pl-10 pr-8 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 transition-all duration-300 bg-white appearance-none"
          >
            <option value="">All Types</option>
            <option
              v-for="employmentType in employmentTypes"
              :key="employmentType.value"
              :value="employmentType.value"
            >
              {{ employmentType.label }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <ChevronDownIcon class="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="relative w-full sm:w-auto">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <CheckCircleIcon class="h-4 w-4 text-gray-400" />
          </div>
          <select
            v-model="filters.status"
            class="w-full sm:w-auto pl-10 pr-8 py-3 border border-[#DCDEDD] rounded-[16px] hover:border-[#0C51D9] hover:border-2 focus:border-[#0C51D9] focus:border-2 transition-all duration-300 bg-white appearance-none"
          >
            <option value="">All Status</option>
            <option
              v-for="jobStatus in jobStatuses"
              :key="jobStatus.value"
              :value="jobStatus.value"
            >
              {{ jobStatus.label }}
            </option>
          </select>
          <div
            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
          >
            <ChevronDownIcon class="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <!-- Search Button -->
        <button
          type="submit"
          class="btn-primary w-full sm:w-auto rounded-[8px] border border-[#2151A0] hover:brightness-110 focus:ring-2 focus:ring-[#0C51D9] transition-all duration-300 blue-gradient blue-btn-shadow px-6 py-3 flex items-center justify-center sm:justify-start gap-2"
        >
          <SearchIcon class="w-4 h-4 text-white" />
          <span class="text-brand-white text-base font-semibold">Search</span>
        </button>
      </div>
    </div>
  </form>
</template>
