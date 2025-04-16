import {FirebaseAdmin} from "../config/firebaseAdmin";
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
  : Promise<FirebaseFirestore.DocumentData[] | null> {
    const db = this.getDb();

    const taskSnap = await db
      .collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId)
      .collection("tasks").get();

    if (taskSnap.empty) return null;

    return taskSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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
    const db = this.getDb();
    await db
      .collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId)
      .collection("tasks").add(task);
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
