import {Timestamp} from "firebase-admin/firestore";
import {BaseResponse} from "../models/BaseResponse";
import {Task} from "../models/Task";
import {TaskRepository} from "../repositories/TaskRepository";

/**
 * Handles business logic of task-related requests.
 */
export class TaskService {
  private taskRepository : TaskRepository;
  /**
     * Initializes the class with TaskRepository
     * @param {taskRepository} taskRepository
     */
  constructor(taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }

  /**
   * Fetches all available tasks by user.
   * @param {userId} userId - UID of the user
   * @return {Promise<BaseResponse>} Response containing the
   * tasks.
   */
  public async getTasksByUser(userId: string): Promise<BaseResponse> {
    try {
      const response = await this.taskRepository.getTasksByUserId(userId);

      return {success: true, message: response};
    } catch (error) {
      return {success: false, message: "Error fetching task: " + error};
    }
  }

  /**
     * Business logic of fetching the tasks from user.
     * @param {userId} userId - UID of the user
     * @param {taskFolderId} taskFolderId - UID of the task
     * folder.
     * @return {Promise<BaseResponse>} Response containing the
     * tasks.
     */
  public async getTasksInFolder(
    userId: string, taskFolderId: string
  ): Promise<BaseResponse> {
    try {
      const response = await this.taskRepository
        .getTasksByFolder(userId, taskFolderId);

      return {success: true, message: response};
    } catch (error) {
      return {success: false, message: "Error fetching task: " + error};
    }
  }

  /**
   * Fetches all tasks that are within the selected date.
   * @param {userId} userId - UID of the user
   * @param {date} date - Selected date.
   * @return {Promise<BaseResponse>} Results containing tasks.
   */
  public async getTasksByDate(
    userId: string, date: Date
  ): Promise<BaseResponse> {
    try {
      const response = await this.taskRepository
        .getTasksByUserId(userId);
      const selectedDate = date.toDateString();

      const filtered = response?.filter((task) => {
        const taskDate = (task.start_date as Timestamp).toDate().toDateString();
        return taskDate === selectedDate;
      });

      return {
        success: true,
        message: filtered,
      };
    } catch (error) {
      return {success: false,
        message: "Error fetching task of selected date: " + error,
      };
    }
  }

  /**
   * Fetches all tasks within the folder
   * with its selected date.
   * @param {userId} userId - UID of the user
   * @param {taskFolderId} taskFolderId - UID of the task folder
   * @param {date} date - Selected date.
   * @return {Promise<BaseResponse>} Results containing tasks.
   */
  public async getTasksByDateInFolder(
    userId: string, taskFolderId: string, date: Date
  ): Promise<BaseResponse> {
    try {
      const response = await this.taskRepository
        .getTasksByFolder(userId, taskFolderId);
      const selectedDate = date.toDateString();

      const filtered = response?.filter((task) => {
        const taskDate = (task.start_date as Timestamp).toDate().toDateString();
        return taskDate === selectedDate;
      });

      return {
        success: true,
        message: filtered,
      };
    } catch (error) {
      return {success: false,
        message: "Error fetching task of selected date: " + error,
      };
    }
  }

  /**
     * Business logic of creating a task for the user.
     * Returns an error if title or description is empty.
     * @param {userId} userId - UID of the user
     * @param {taskFolderId} taskFolderId - UID of the task
     * folder.
     * @param {task} task - task folder details
     * @return {Promise<BaseResponse>} Response indicating status
     */
  public async createTask(userId: string, taskFolderId: string, task: Task)
    : Promise<BaseResponse> {
    if (task.title === null || task.description === null) {
      return {
        success: false,
        message: "Title or Description must not be empty",
      };
    }

    try {
      await this.taskRepository
        .createTask(userId, taskFolderId, task);

      return {
        success: true,
        message: "Successfully created task.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error creating task: " + error,
      };
    }
  }

  /**
     * Business logic of updating a task of the user.
     * Errors if title or description is empty.
     * @param {userId} userId - UID of the user
     * @param {taskFolderId} taskFolderId - UID of the task folder
     * @param {taskId} taskId - UID of the task.
     * @param {task} task - New task details
     * @return {Promise<BaseResponse>} Response indicating status
     */
  public async updateTask(
    userId: string, taskFolderId: string, taskId: string, task: Partial<Task>
  ): Promise<BaseResponse> {
    try {
      if (task.title === null || task.description === null) {
        return {
          success: false,
          message: "Title or Description must not be empty",
        };
      }

      await this.taskRepository
        .updateTask(userId, taskFolderId, taskId, task);

      return {
        success: true,
        message: "Successfully updated task.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error creating task: " + error,
      };
    }
  }

  /**
     * Business logic of deleting a task of the user.
     * @param {userId} userId - UID of the user.
     * @param {taskFolderId} taskFolderId - UID of the task folder
     * @param {taskFolderId} taskId - UID of the task
     * @return {Promise<BaseResponse>} Response indicating status
     */
  public async deleteTask(
    userId: string, taskFolderId: string, taskId: string
  ): Promise<BaseResponse> {
    try {
      await this.taskRepository
        .deleteTask(userId, taskFolderId, taskId);

      return {
        success: true,
        message: "Successfully deleted task",
      };
    } catch (error) {
      return {
        success: true,
        message: "Error deleting task: " + error,
      };
    }
  }
}
