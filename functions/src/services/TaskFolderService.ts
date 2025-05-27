import {BaseResponse} from "../models/BaseResponse";
import {TaskFolder} from "../models/TaskFolder";
import {TaskFolderRepository} from "../repositories/TaskFolderRepository";

/**
 * Handles business logic of task folder-related requests.
 */
export class TaskFolderService {
  private taskFolderRepository : TaskFolderRepository;
  /**
     * Initializes the class with TaskFolderRepository
     * @param {taskFolderRepository} taskFolderRepository
     */
  constructor(taskFolderRepository: TaskFolderRepository) {
    this.taskFolderRepository = taskFolderRepository;
  }

  /**
     * Business logic of fetching the task folders from user.
     * @param {userId} userId - UID of the user
     * @return {Promise<BaseResponse>} Response containing the
     * task folders.
     */
  public async getTaskFoldersOfUser(userId: string): Promise<object> {
    try {
      const response = await this.taskFolderRepository
        .getTaskFoldersByUserId(userId);

      return {success: true, message: "Task Folders Successfuly Retrieved", data: response};
    } catch (error) {
      return {success: false, message: "Error fetching task folders: " + error};
    }
  }

  /**
     * Business logic of creating a task folder for the user.
     * Returns an error if title or description is empty.
     * @param {userId} userId - UID of the user
     * @param {taskFolder} taskFolder - Task folder details
     * @return {Promise<BaseResponse>} Response indicating status
     */
  public async createTaskFolder(userId: string, taskFolder: TaskFolder)
    : Promise<object> {
    try {
      const newTaskFolder = await this.taskFolderRepository
        .createTaskFolder(userId, taskFolder);

      return {
        success: true,
        message: "Successfully created task folder.",
        data: newTaskFolder,
      };
    } catch (error) {
      return {
        success: false,
        message: "Error creating task folder: " + error,
      };
    }
  }

  /**
     * Business logic of updating a task folder of the user.
     * Errors if title or description is empty.
     * @param {userId} userId - UID of the user
     * @param {taskFolderId} taskFolderId - UID of the task folder
     * @param {taskFolder} taskFolder - New task folder details
     * @return {Promise<BaseResponse>} Response indicating status
     */
  public async updateTaskFolder(
    userId: string, taskFolderId: string, taskFolder: Partial<TaskFolder>
  ): Promise<BaseResponse> {
    try {
      await this.taskFolderRepository
        .updateTaskFolder(userId, taskFolderId, taskFolder);

      return {
        success: true,
        message: "Successfully updated task folder.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Error creating task folder: " + (error instanceof Error ? error.message : error),
      };
    }
  }

  /**
     * Business logic of deleting a task folder of the user.
     * @param {userId} userId - UID of the user.
     * @param {taskFolderId} taskFolderId - UID of the task folder
     * @return {Promise<BaseResponse>} Response indicating status
     */
  public async deleteTaskFolder(
    userId: string, taskFolderId: string
  ): Promise<BaseResponse> {
    try {
      await this.taskFolderRepository
        .deleteTaskFolder(userId, taskFolderId);

      return {
        success: true,
        message: "Successfully deleted task folder",
      };
    } catch (error) {
      return {
        success: true,
        message: "Error deleting task folder: " + error,
      };
    }
  }
}
