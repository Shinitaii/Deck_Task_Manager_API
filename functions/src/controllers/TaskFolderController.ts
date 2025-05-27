import {Response} from "express";
import {TaskFolderService} from "../services/TaskFolderService";
import {NewTaskFolder, TaskFolder} from "../models/TaskFolder";
import {AuthenticatedRequest} from "../interface/AuthenticatedRequest";
/**
 * Handles the HTTP requests for task folder-related
 * logic.
 */
export class TaskFolderController {
  /**
  * Service responsible for handling task folder operations.
  */
  private taskFolderService : TaskFolderService;

  /**
   * Initializes the class with taskFolderService
   * @param {taskFolderService} taskFolderService
   */
  constructor(taskFolderService: TaskFolderService) {
    this.taskFolderService = taskFolderService;
  }

  /**
   * Creates a task folder for the user.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async createTaskFolder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {taskFolderDetails} = req.body as {taskFolderDetails: NewTaskFolder};
      const userId = req.user?.user_id;

      const taskFolder: TaskFolder = {
        ...taskFolderDetails,
        user_id: userId,
      };

      const creation = await this.taskFolderService
        .createTaskFolder(userId, taskFolder);

      if (!creation) {
        res.status(400).json({
          success: false,
          message: "Unable to create task folder."}
        );
        return;
      }

      res.status(200).json(creation);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in creating the task folder.");
      }
    }
  }

  /**
   * Updates task folder.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async updateTaskFolder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {taskFolderId} = req.params;
      const {taskFolderDetails} = req.body;
      const userId = req.user?.user_id;

      if (!taskFolderId) {
        res.status(400).json({success: false, message: "Task folder ID is required."});
        return;
      }

      const update = await this.taskFolderService.updateTaskFolder(
        userId, taskFolderId, taskFolderDetails as Partial<TaskFolder>
      );

      if (!update.success) {
        res.status(400).json({success: false, message: update.message});
        return;
      }

      res.status(200).json(update);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      console.error(errMsg);
      res.status(500).json({success: false, message: "An error occurred while updating task folder."});
    }
  }

  /**
   * Fetches all task folders from the user.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async getTaskFolders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const folders = await this.taskFolderService.getTaskFoldersOfUser(userId);

      if (!folders) {
        res.status(400).json(
          {success: false, message: "Cannot fetch folders."}
        );
      }

      res.status(200).json(folders);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in fetching task folders.");
      }
    }
  }

  /**
   * Deletes a task folder.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async deleteTaskFolder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {taskFolderId} = req.params;
      const userId = req.user?.user_id;

      const deletion = await this.taskFolderService
        .deleteTaskFolder(userId, taskFolderId);

      if (!deletion) {
        res.status(400).json(
          {success: false, message: "Cannot delete task folder."}
        );
      }

      res.status(200).json(
        {success: true, message: "Successfully deleted task folder"}
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in deleting task folder.");
      }
    }
  }
}
