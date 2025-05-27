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
   * Fetches all tasks from the user.
   * @param {Request} req - The HTTP request object.
   * @param {Response} res - The HTTP response object.
   * @return {Promise<void>} A JSON response containing the action.
   */
  public async getNearingDueTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    const tasks = await this.taskService.getNearingDueTasks(userId);

    res.status(200).json(tasks);
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
    const {folderId} = req.params;
    const {date} = req.query;
    const targetDate = new Date(date as string);
    const userId = req.user?.user_id;
    const tasks = await this.taskService
      .getTasksByDateInFolder(userId, folderId, targetDate);

    if (!tasks) {
      res.status(400).json(
        {success: false, message: "Cannot fetch tasks."}
      );
    }

    res.status(200).json(tasks);
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

      if (!taskId || !taskFolderId) {
        res.status(400).json({success: false, message: "Task ID and Task Folder ID are required."});
        return;
      }

      const allowedPriorities = ["High", "Medium", "Low"];
      const allowedStatuses = ["Pending", "In Progress", "Completed"];

      // Validate priority and status if provided
      if (taskDetails.priority && !allowedPriorities.includes(taskDetails.priority)) {
        res.status(400).json({success: false, message: "Invalid priority value."});
        return;
      }

      if (taskDetails.status && !allowedStatuses.includes(taskDetails.status)) {
        res.status(400).json({success: false, message: "Invalid status value."});
        return;
      }

      // Validate date consistency if both provided
      if (taskDetails.start_date && taskDetails.end_date) {
        const startDate = new Date(taskDetails.start_date);
        const endDate = new Date(taskDetails.end_date);
        if (endDate < startDate) {
          res.status(400).json({success: false, message: "Due date cannot be earlier than start date."});
          return;
        }
      }

      const update = await this.taskService.updateTask(
        userId, taskFolderId, taskId, taskDetails as Partial<Task>
      );

      if (!update.success) {
        res.status(400).json(update);
        return;
      }

      res.status(200).json(update);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        res.status(500).json({success: false, message: "An error occurred while updating task."});
      } else {
        console.log("An unknown error occurred in updating task.");
        res.status(500).json({success: false, message: "An unknown error occurred."});
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
      const {taskId} = req.query as {taskId: string};
      const taskIdStr = typeof taskId === "string" ? taskId : undefined;
      const userId = req.user?.user_id;


      if (!taskIdStr || typeof taskIdStr !== "string") {
        res.status(400).json(
          {success: false, message: "Task ID is required and must be a string."}
        );
        return;
      }

      const deletion = await this.taskService
        .deleteTask(userId, taskFolderId, taskIdStr);

      if (!deletion) {
        res.status(400).json(
          {success: false, message: "Cannot delete task folder."}
        );
        return;
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
