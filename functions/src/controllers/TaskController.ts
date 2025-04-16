import {Request, Response} from "express";
import {TaskService} from "../services/TaskService";
import {Task} from "../models/Task";
/**
 * Handles the HTTP requests for task-related
 * logic.
 */
export class TaskController {
  /**
  * Service responsible for handling task operations.
  */
  private taskService : TaskService;

  /**
   * Initializes the class with taskService
   * @param {taskService} taskService
   */
  constructor(taskService: TaskService) {
    this.taskService = taskService;
  }

  /**
   * Fetches all tasks from the user.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async getTasksByUser(req: Request, res: Response): Promise<void> {
    try {
      const {userId} = req.body;
      const tasks = await this.taskService.getTasksByUser(userId);

      if (!tasks) {
        res.status(400).json(
          {success: false, message: "Cannot fetch tasks."}
        );
      }

      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in fetching all the tasks.");
      }
    }
  }

  /**
   * Fetches all tasks from the user with its selected date.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async getTasksByDate(req: Request, res: Response): Promise<void> {
    try {
      const {userId, date} = req.body;
      const tasks = await this.taskService.getTasksByDate(userId, date);

      if (!tasks) {
        res.status(400).json(
          {success: false, message: "Cannot fetch tasks."}
        );
      }

      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in " +
          "fetching selected date tasks.");
      }
    }
  }

  /**
   * Fetches all tasks from the user with its selected folder.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async getTasksByFolder(req: Request, res: Response): Promise<void> {
    try {
      const {userId, taskFolderId} = req.body;
      const tasks = await this.taskService
        .getTasksInFolder(userId, taskFolderId);

      if (!tasks) {
        res.status(400).json(
          {success: false, message: "Cannot fetch tasks."}
        );
      }

      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in" +
          " fetching selected folder tasks.");
      }
    }
  }

  /**
   * Fetches all tasks from the user with its selected folder.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async getTasksByDateInFolder(
    req: Request, res: Response
  ): Promise<void> {
    try {
      const {userId, taskFolderId, date} = req.body;
      const tasks = await this.taskService
        .getTasksByDateInFolder(userId, taskFolderId, date);

      if (!tasks) {
        res.status(400).json(
          {success: false, message: "Cannot fetch tasks."}
        );
      }

      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in " +
          "fetching selected date tasks in folder.");
      }
    }
  }

  /**
   * Creates a task for the user.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async createTask(req: Request, res: Response): Promise<void> {
    try {
      const {taskFolderId} = req.params;
      const {userId, taskDetails} = req.body;
      const creation = await this.taskService
        .createTask(userId, taskFolderId, taskDetails as Task);

      if (!creation) {
        res.status(400).json({
          success: false,
          message: "Unable to create task."}
        );
        return;
      }

      res.status(200).json(creation);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in creating the task.");
      }
    }
  }

  /**
   * Updates task.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const {taskFolderId} = req.params;
      const {userId, taskId, taskDetails} = req.body;
      const update = await this.taskService
        .updateTask(userId, taskFolderId, taskId,
          taskDetails as Partial<Task>
        );

      if (!update) {
        res.status(400).json({
          success: false,
          message: "Unable to update task."}
        );
        return;
      }

      res.status(200).json(
        {success: true, message: "Successfully updated task."}
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred in updating task.");
      }
    }
  }

  /**
   * Deletes a task.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const {taskFolderId} = req.params;
      const {userId, taskId} = req.body;

      const deletion = await this.taskService
        .deleteTask(userId, taskFolderId, taskId);

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
