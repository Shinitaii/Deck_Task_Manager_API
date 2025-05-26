import {Response} from "express";
import {TaskService} from "../services/TaskService";
import {Task} from "../models/Task";
import {AuthenticatedRequest} from "../interface/AuthenticatedRequest";
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
  public async getTasksByUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.user_id;
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
  public async getTasksByDate(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {date} = req.body;
      const userId = req.user?.user_id;
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
  public async getTasksByFolder(req: AuthenticatedRequest, res: Response): Promise<void> {
    const {folderId} = req.params;
    const userId = req.user?.user_id;
    const tasks = await this.taskService
      .getTasksInFolder(userId, folderId);

    if (!tasks) {
      res.status(400).json(
        {success: false, message: "Cannot fetch tasks."}
      );
    }

    res.status(200).json({
      success: true,
      message: "Cannot fetch tasks.",
      data: tasks,
    });
  }

  /**
   * Fetches all tasks from the user with its selected folder.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async getTasksByDateInFolder(
    req: AuthenticatedRequest, res: Response
  ): Promise<void> {
    try {
      const {taskFolderId, date} = req.body;
      const userId = req.user?.user_id;
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
  public async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    const {taskDetails} = req.body;
    const taskFolderId = taskDetails.task_folder_id;
    const userId = req.user?.user_id;
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
  }

  /**
   * Updates task.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {taskFolderId} = req.params;
      const {taskId, taskDetails} = req.body;
      const userId = req.user?.user_id;
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
  public async deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {taskFolderId} = req.params;
      const {taskId} = req.body;
      const userId = req.user?.user_id;

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
