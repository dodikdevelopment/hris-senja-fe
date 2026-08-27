import { defineStore } from "pinia";
import { axiosInstance } from '@/plugins/axios';
import { handleError } from "@/helpers/errorHelper";

export const useTaskStore = defineStore("task", {
    state: () => ({
        tasks: [],
        myTasks: [],
        comments: [],
        loading: false,
        loadingMyTasks: false,
        loadingComments: false,
        savingComment: false,
        error: null,
        success: null,
    }),

    actions: {
        async fetchProjectTasks(projectId) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosInstance.get('project-tasks', {
                    params: {
                        project_id: projectId
                    }
                });

                this.tasks = response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * Task yang di-assign ke employee yang sedang login.
         * Backend membaca ?assignee=me dan mengurutkan berdasarkan due_date terdekat.
         */
        async fetchMyTasks({ limit = 5, orderBy = 'due_date' } = {}) {
            this.loadingMyTasks = true;
            this.error = null;

            try {
                const response = await axiosInstance.get('project-tasks', {
                    params: {
                        assignee: 'me',
                        order_by: orderBy,
                        limit,
                    }
                });

                this.myTasks = response.data.data;
                return this.myTasks;
            } catch (error) {
                this.error = handleError(error);
                this.myTasks = [];
                return [];
            } finally {
                this.loadingMyTasks = false;
            }
        },

        async fetchComments(taskId) {
            this.loadingComments = true;
            this.error = null;

            try {
                const response = await axiosInstance.get(`project-tasks/${taskId}/comments`);
                this.comments = response.data.data;
            } catch (error) {
                this.error = handleError(error);
                this.comments = [];
            } finally {
                this.loadingComments = false;
            }
        },

        async addComment(taskId, body) {
            this.savingComment = true;
            this.error = null;

            try {
                const response = await axiosInstance.post(`project-tasks/${taskId}/comments`, { body });
                this.comments.push(response.data.data);
                return response.data.data;
            } catch (error) {
                this.error = handleError(error);
                return null;
            } finally {
                this.savingComment = false;
            }
        },

        async deleteComment(commentId) {
            this.error = null;

            try {
                await axiosInstance.delete(`task-comments/${commentId}`);
                this.comments = this.comments.filter(c => c.id !== commentId);
                return true;
            } catch (error) {
                this.error = handleError(error);
                return false;
            }
        },

        async createTask(payload) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosInstance.post('project-tasks', payload);

                this.success = response.data.message;
                return response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async updateTask(id, payload) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosInstance.post(`project-tasks/${id}`, {
                    ...payload,
                    _method: 'PUT',
                });

                // Update task in local state
                const taskIndex = this.tasks.findIndex(t => t.id === id);
                if (taskIndex !== -1 && response.data.data) {
                    this.tasks[taskIndex] = response.data.data;
                }

                this.success = response.data.message;
                return response.data.data;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async deleteTask(id) {
            this.loading = true;
            this.error = null;

            try {
                const response = await axiosInstance.delete(`project-tasks/${id}`);

                this.success = response.data.message;
            } catch (error) {
                this.error = handleError(error);
            } finally {
                this.loading = false;
            }
        },

        async updateTaskStatus(taskId, newStatus) {
            this.error = null;

            try {
                // Find the task to get current data
                const task = this.tasks.find(t => t.id === taskId);
                if (!task) return;

                // Use existing updateTask endpoint
                const response = await axiosInstance.post(`project-tasks/${taskId}`, {
                    ...task,
                    status: newStatus,
                    _method: 'PUT',
                });

                // Update task status in local state
                const taskIndex = this.tasks.findIndex(t => t.id === taskId);
                if (taskIndex !== -1) {
                    this.tasks[taskIndex].status = newStatus;
                }

                return response.data;
            } catch (error) {
                this.error = handleError(error);
                throw error;
            }
        },
    }
})
