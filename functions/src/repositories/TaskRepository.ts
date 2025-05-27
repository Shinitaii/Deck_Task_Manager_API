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
    try {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new ApiError(
        "Error fetching tasks by user ID",
        500, "Error fetching tasks by user ID: " + error.message
      );
    }
  }

  /**
 * Gets tasks nearing their end date and are not yet completed.
 * @param {string} userId - UID of the user
 * @param {number} daysThreshold - Number of days before end_date to consider as 'nearing'
 * @return {Promise<any[]>}
 * Returns an array of tasks nearing their end date.
 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getNearingDueTasks(userId: string, daysThreshold = 3): Promise<any[]> {
    const db = this.getDb();
    const taskFolderSnap = await db.collection("task_folders").doc(userId)
      .collection("folders").get();

    if (taskFolderSnap.empty) return [];

    const now = new Date();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nearingTasks: any[] = [];

    await Promise.all(
      taskFolderSnap.docs.map(async (folderDoc) => {
        const folderId = folderDoc.id;
        const folderTitle = folderDoc.data().title;

        const tasksSnap = await db.collection("task_folders").doc(userId)
          .collection("folders").doc(folderId)
          .collection("tasks").orderBy("end_date", "asc").get();

        tasksSnap.docs.forEach((doc) => {
          const data = doc.data();
          const status = data.status;

          if (status === "pending" || status === "in progress") {
            const endDate = data.end_date ? new Date(data.end_date) : null;

            if (endDate) {
              const diffInDays = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

              if (diffInDays <= daysThreshold && diffInDays >= 0) {
                nearingTasks.push({
                  id: doc.id,
                  task_folder_id: folderId,
                  title: data.title,
                  description: data.description,
                  status: data.status,
                  priority: data.priority,
                  start_date: data.start_date,
                  end_date: data.end_date,
                  folder_source: folderTitle,
                });
              }
            }
          }
        });
      })
    );

    return nearingTasks;
  }


  /**
 * Gets all the tasks from the user within the task folder, including folder_source.
 * @param {string} userId - UID of the user
 * @param {string} taskFolderId - UID of the folder.
 * @param {string} orderBy - The field to order tasks by.
 * @return {Promise<{
 *  pending: FirebaseFirestore.DocumentData[];
 *  inProgress: FirebaseFirestore.DocumentData[];
 *  completed: FirebaseFirestore.DocumentData[];
 * }>}
 * Returns categorized tasks with folder source.
 */
  public async getTasksByFolder(
    userId: string,
    taskFolderId: string,
    orderBy: string
  ): Promise<{
    pending: FirebaseFirestore.DocumentData[];
    inProgress: FirebaseFirestore.DocumentData[];
    completed: FirebaseFirestore.DocumentData[];
  }> {
    try {
      const db = this.getDb();

      // Get folder title (folder_source)
      const folderDoc = await db
        .collection("task_folders").doc(userId)
        .collection("folders").doc(taskFolderId)
        .get();

      if (!folderDoc.exists) {
        throw new ApiError("Task folder not found", 404);
      }

      const folderTitle = folderDoc.data()?.title || "Untitled Folder";

      // Fetch tasks
      const taskSnap = await db
        .collection("task_folders").doc(userId)
        .collection("folders").doc(taskFolderId)
        .collection("tasks")
        .orderBy(orderBy, "asc")
        .get();

      if (taskSnap.empty) {
        return {pending: [], inProgress: [], completed: []};
      }

      // Initialize buckets
      const pending: FirebaseFirestore.DocumentData[] = [];
      const inProgress: FirebaseFirestore.DocumentData[] = [];
      const completed: FirebaseFirestore.DocumentData[] = [];

      // Distribute each doc into the right bucket, adding folder_source
      taskSnap.docs.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
          folder_source: folderTitle,
        } as FirebaseFirestore.DocumentData;

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
          pending.push(data);
        }
      });

      return {pending, inProgress, completed};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      } else {
        throw new ApiError(
          "Error fetching tasks from folder",
          500,
          "Error fetching tasks from folder: " + error.message
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
