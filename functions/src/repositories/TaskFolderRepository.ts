import {FirebaseAdmin} from "../config/firebaseAdmin";
import {TaskFolder} from "../models/TaskFolder";

/**
 * Responsible for handling Task Folder logic
 * @extends FirebaseAdmin
 */
export class TaskFolderRepository extends FirebaseAdmin {
  /**
   * Gets all the task folders from the user.
   * @param {userId} userId - UID of the user
   * @return {Promise<FirebaseFirestore.DocumentData[] | null>}
   * Returns an array of task folders from the user.
   */
  public async getTaskFoldersByUserId(userId: string)
  : Promise<FirebaseFirestore.DocumentData[] | null> {
    const db = this.getDb();

    const taskFolderSnap = await db.collection("task_folders").doc(userId)
      .collection("folders").get();
    if (taskFolderSnap.empty) return null;

    return taskFolderSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  /**
   * Gets a specific task folder from the user with its ID.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   * @return {Promise<FirebaseFirestore.DocumentData | null | undefined>}
   * Returns found task.
   */
  public async getTaskFolderByTaskFolderId(
    userId: string, taskFolderId: string)
  : Promise<FirebaseFirestore.DocumentData | null | undefined> {
    const db = this.getDb();

    const taskFolderDoc = await db.collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId).get();
    return taskFolderDoc.exists ? taskFolderDoc.data() : null;
  }

  /**
   * Creates a task folder on the user.
   * @param {userId} userId - UID of the user.
   * @param {taskFolder} taskFolder - Task Folder details
   */
  public async createTaskFolder(
    userId: string, taskFolder: TaskFolder): Promise<void> {
    const db = this.getDb();
    await db.collection("task_folders").doc(userId)
      .collection("folders").add(taskFolder);
  }

  /**
   * Updates a task folder on the user.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   * @param {taskFolder} taskFolder - Updated task folder details.
   */
  public async updateTaskFolder(
    userId: string, taskFolderId: string, taskFolder: Partial<TaskFolder>
  ): Promise<void> {
    const db = this.getDb();
    await db.collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId).update(taskFolder);
  }

  /**
   * Deletes a task folder on the user.
   * @param {userId} userId - UID of the user.
   * @param {taskFolderId} taskFolderId - UID of the task folder.
   */
  public async deleteTaskFolder(
    userId: string, taskFolderId: string): Promise<void> {
    const db = this.getDb();
    await db.collection("task_folders").doc(userId)
      .collection("folders").doc(taskFolderId).delete();
  }
}
