import {FirebaseAdmin} from "../config/firebaseAdmin";
import {ApiError} from "../helper/apiError";
import {Task} from "../models/Task";

/**
 * Responsible for handling Task Folder logic
 * @extends FirebaseAdmin
 */
export class TaskRepository extends FirebaseAdmin {
  /**
   * Gets all the tasks from the user from all
   * task folders
   * @param {userId} userId - UID of the user.
   */
  public async getTasksByUserId(userId: string)
  : Promise<FirebaseFirestore.DocumentData[] | null> {
    const db = this.getDb();

    const foldersSnap = await db
      .collection("task_folders").doc(userId)
      .collection("folders").get();

    if (foldersSnap.empty) return null;

    const taskFetchPromises = foldersSnap.docs.map(async (folderDoc) => {
      const taskSnap = await db
        .collection("task_folders").doc(userId)
        .collection("folders").doc(folderDoc.id)
        .collection("tasks").get();

      return taskSnap.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data(),
      }));
    });

    const taskArrays = await Promise.all(taskFetchPromises);

    const allTasks = taskArrays.flat();

    return allTasks.length > 0 ? allTasks : null;
  }

  /**
   * Gets all the tasks from the user within the task folder.
   * @param {userId} userId - UID of the user
   * @param {taskFolderId} taskFolderId - UID of the folder.
   * @return {Promise<FirebaseFirestore.DocumentData[] | null>}
   * Returns an array of tasks from the user within the folder.
   */
  public async getTasksByFolder(userId: string, taskFolderId: string)
  : Promise<{
    pending: FirebaseFirestore.DocumentData[];
    inProgress: FirebaseFirestore.DocumentData[];
    completed: FirebaseFirestore.DocumentData[];
  }> {
    try {
      const db = this.getDb();

      const taskSnap = await db
        .collection("task_folders").doc(userId)
        .collection("folders").doc(taskFolderId)
        .collection("tasks")
        .orderBy("end_date", "asc")
        .get();

      if (taskSnap.empty) {
        // Return empty buckets instead of throwing, if you prefer
        return {pending: [], inProgress: [], completed: []};
      }

      // Initialize buckets
      const pending: FirebaseFirestore.DocumentData[] = [];
      const inProgress: FirebaseFirestore.DocumentData[] = [];
      const completed: FirebaseFirestore.DocumentData[] = [];

      // Distribute each doc into the right bucket
      taskSnap.docs.forEach((doc) => {
        const data = {id: doc.id, ...doc.data()} as FirebaseFirestore.DocumentData;
        const status = (doc.data().status as string).toLowerCase();

        switch (status) {
        case "pending":
          pending.push(data);
          break;
        case "in progress":
        case "in_progress":
          inProgress.push(data);
          break;
        case "completed":
          completed.push(data);
          break;
        default:
          // you could log or handle unexpected statuses here
          pending.push(data);
        }
      });
      return {pending, inProgress, completed};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error; // Re-throw ApiError for handling in the service layer
      } else {
        throw new ApiError(
          "Error fetching tasks from folder",
          500, "Error fetching tasks from folder: " + error.message
        );
      }
    }
  }

  /**
   * Gets a specific task from the user with its ID.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder
   * @param {taskId} taskId - UID of the task.
   * @return {Promise<FirebaseFirestore.DocumentData | null | undefined>}
   * Returns found task.
   */
  public async getTaskByTaskId(
    userId: string, taskFolderId: string, taskId: string)
  : Promise<FirebaseFirestore.DocumentData | null | undefined> {
    const db = this.getDb();

    const taskDoc = await db
      .collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId)
      .collection("tasks").doc(taskId).get();

    return taskDoc.exists ? taskDoc.data() : null;
  }

  /**
   * Creates a task on the user.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   * @param {task} task - Task details
   */
  public async createTask(
    userId: string, taskFolderId: string, task: Task): Promise<void> {
    try {
      const db = this.getDb();
      await db
        .collection("task_folders").doc(userId)
        .collection("folders").doc(taskFolderId)
        .collection("tasks").add(task);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error; // Re-throw ApiError for handling in the service layer
      } else {
        throw new ApiError(
          "Error creating task",
          500, "Error creating task: " + error.message
        );
      }
    }
  }

  /**
   * Updates a task on the user.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   * @param {taskId} taskId - UID of the task.
   * @param {task} task - Updated task details.
   */
  public async updateTask(
    userId: string, taskFolderId: string, taskId: string, task: Partial<Task>
  ): Promise<void> {
    const db = this.getDb();
    await db
      .collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId)
      .collection("tasks").doc(taskId).update(task);
  }

  /**
   * Deletes a task on the user.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   * @param {taskId} taskId - UID of the task.
   */
  public async deleteTask(
    userId: string, taskFolderId: string, taskId: string): Promise<void> {
    const db = this.getDb();
    await db.collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId)
      .collection("tasks").doc(taskId).delete();
  }
}
