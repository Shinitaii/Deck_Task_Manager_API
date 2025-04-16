import {Request, Response} from "express";
import {TaskFolderService} from "../services/TaskFolderService";
import {TaskFolder} from "../models/TaskFolder";
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
  public async createTaskFolder(req: Request, res: Response): Promise<void> {
    try {
      const {userId, taskFolderDetails} = req.body;
      const creation = await this.taskFolderService
        .createTaskFolder(userId, taskFolderDetails as TaskFolder);

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
  public async updateTaskFolder(req: Request, res: Response): Promise<void> {
    try {
      const {userId, taskFolderId, taskFolderDetails} = req.body;
      const update = await this.taskFolderService
        .updateTaskFolder(userId, taskFolderId,
          taskFolderDetails as Partial<TaskFolder>
        );

      if (!update) {
        res.status(400).json({
          success: false,
          message: "Unable to update task folder."}
        );
        return;
      }

      res.status(200).json(
        {success: true, message: "Successfully updated task folder."}
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in updating task folder.");
      }
    }
  }

  /**
   * Fetches all task folders from the user.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async getTaskFolders(req: Request, res: Response): Promise<void> {
    try {
      const {userId} = req.body;
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
  public async deleteTaskFolder(req: Request, res: Response): Promise<void> {
    try {
      const {userId, taskFolderId} = req.body;

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
