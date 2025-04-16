import {Timestamp} from "firebase-admin/firestore";

/**
 * An interface for the task.
 */
export interface Task {
    task_folder_id: string,
    title: string,
    description: string,
    status: string,
    priority: string,
    start_date: Timestamp,
    end_date: Timestamp,
    done_date: Timestamp,
}
