import {Router, Request, Response} from "express";
import {TaskFolderController} from "../controllers/TaskFolderController";
import {TaskFolderService} from "../services/TaskFolderService";
import {TaskFolderRepository} from "../repositories/TaskFolderRepository";
import {TaskController} from "../controllers/TaskController";
import {TaskService} from "../services/TaskService";
import {TaskRepository} from "../repositories/TaskRepository";
// eslint-disable-next-line new-cap
const router = Router();
const taskFolderController = new TaskFolderController(
  new TaskFolderService(
    new TaskFolderRepository()));
const taskController = new TaskController(
  new TaskService(
    new TaskRepository()));


/* TASK FOLDERS */

/**
 *
 * @route POST api/v1/task/create-task-folder
 * @description Creates a task folder.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/create-task-folder", async (req: Request, res: Response) => {
  await taskFolderController.createTaskFolder(req, res);
});

/**
 *
 * @route GET api/v1/task/get-task-folders
 * @description Fetches all task folders.
 * @returns Success 200
 * @returns Error 500
 */
router.get("/get-task-folders", async (req:Request, res: Response) => {
  await taskFolderController.getTaskFolders(req, res);
});

/**
 *
 * @route PUT api/v1/task/update-task-folder
 * @description Updates a task folder.
 * @returns Success 200
 * @returns Error 500
 */
router.put("/update-task-folder", async (req: Request, res: Response) => {
  await taskFolderController.updateTaskFolder(req, res);
});

/**
 *
 * @route DELETE api/v1/task/delete-task-folder
 * @description Deletes a task folder.
 * @returns Success 200
 * @returns Error 500
 */
router.delete("/delete-task-folder", async (req: Request, res: Response) => {
  await taskFolderController.deleteTaskFolder(req, res);
});

/* TASKS */

/**
 *
 * @route POST api/v1/task/create-task
 * @description Creates a task.
 * @returns Success 200
 * @returns Error 500
 */
router.post("/create-task", async (req: Request, res: Response) => {
  await taskController.createTask(req, res);
});

/**
 *
 * @route GET api/v1/task/fetch-tasks/all
 * @description Gets all tasks from user
 * @returns Success 200
 * @returns Error 500
 */
router.get("/fetch-tasks/all", async (req: Request, res: Response) => {
  await taskController.getTasksByUser(req, res);
});

/**
 *
 * @route GET api/v1/task/fetch-tasks/date
 * @description Gets all tasks with selected date
 * @returns Success 200
 * @returns Error 500
 */
router.get("/fetch-tasks/date", async (req: Request, res: Response) => {
  await taskController.getTasksByDate(req, res);
});

/**
 *
 * @route GET api/v1/task/fetch-tasks/folder/all
 * @description Gets all tasks within the selected folder.
 * @returns Success 200
 * @returns Error 500
 */
router.get("/fetch-tasks/folder/:folderId", async (req: Request, res: Response) => {
  await taskController.getTasksByFolder(req, res);
});

/**
 *
 * @route GET api/v1/task/fetch-tasks/folder/date
 * @description Gets all tasks within the selected folder
 * with selected date
 * @returns Success 200
 * @returns Error 500
 */
router.get("/fetch-tasks/folder/date", async (req: Request, res: Response) => {
  await taskController.getTasksByDateInFolder(req, res);
});

/**
 *
 * @route PUT api/v1/task/update-task
 * @description Updates a task
 * @returns Success 200
 * @returns Error 500
 */
router.put("/update-task", async (req: Request, res: Response) => {
  await taskController.updateTask(req, res);
});

/**
 *
 * @route DELETE api/v1/task/delete-task
 * @description Deletes a task
 * @returns Success 200
 * @returns Error 500
 */
router.delete("/delete-task", async (req: Request, res: Response) => {
  await taskController.deleteTask(req, res);
});

export default router;
