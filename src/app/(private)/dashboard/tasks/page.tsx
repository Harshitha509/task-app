import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db";
import { tasks, TodoStatus, TaskType } from "@/db/schema";
import { currentUser } from "@clerk/nextjs";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UpdateTaskForm } from "@/components/updatetask";
import DeleteTask from "@/components/deletetask";
import Link from "next/link";

export default async function Tasks() {
  const user = await currentUser();
  const allTasks = await db.select().from(tasks).orderBy(desc(tasks.createdAt));

  async function createPost(formData: FormData) {
    "use server";

    const content = formData.get("content")?.toString();
    const userId = user?.id;

    if (!userId || !content) return alert("Please fill out both fields");

    const status =
      formData.get("status")?.toString() || TodoStatus.Pending; // Default to Pending if status is not provided
    const userName = user?.firstName + " " + user?.lastName;

    const type =
      formData.get("type") === "backlog" ? TaskType.Backlog : TaskType.Tasks;

    if (!content) throw Error("Content must be there...");

    await db.insert(tasks).values({ content, userId, userName, status, type });

    revalidatePath("/");

    formData.set("content", "");
  }

  
  return (
    <div className="bg-purple-300"><Link href={'/'}><Button className="bg-purple-500 m-4">Back to home</Button></Link>
    <div className="flex gap-8 min-h-screen flex-col items-center px-8 py-10 overflow-y-auto">
      
      <Dialog>
        <DialogTrigger>Add Task</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adding Task</DialogTitle>
            <DialogDescription>
              <div className="flex items-start w-full gap-3 py-6 border-b">
                <div className="flex gap-2 items-center">
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <form action={createPost} className="w-full flex flex-col gap-2">
                  <h3 className="font-medium text-base ">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <Textarea
                    name="content"
                    className="w-full"
                    placeholder="Start a new task..."
                  />
                  <div className="flex gap-2 items-center">
                    <label htmlFor="status" className="font-medium text-base">
                      Status:
                    </label>
                    <select
                      name="status"
                      id="status"
                      className="border rounded-md px-2 py-1"
                    >
                      {Object.values(TodoStatus).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="font-medium text-base">Type:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="backlog"
                        name="type"
                        value="backlog"
                        required
                      />
                      <label htmlFor="backlog">Backlog</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="task"
                        name="type"
                        value="task"
                        required
                      />
                      <label htmlFor="task">Task</label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size={"lg"}>
                      Add Task
                    </Button>
                  </div>
                </form>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-4xl grid grid-cols-3 gap-3">
      {allTasks.filter((task) => task.type === TaskType.Tasks).map((task) => (
        
  <div
    key={task.id}
    className={`flex items-center justify-between p-4 border rounded-md mb-4 ${
      task.status === TodoStatus.Pending ? 'bg-red-400' :
      task.status === TodoStatus.InProgress ? 'bg-yellow-400' :
      task.status === TodoStatus.Done ? 'bg-green-500' : ''
    }`}
  >
    <div>
      <h3 className="font-medium text-base">{task.content}</h3>
      <p className="text-base ">
        Status: {task.status} |<br /> Type: {task.type}
      </p>
    </div>
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger>
          <Pencil />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
            <DialogDescription>
            <UpdateTaskForm
                  task={{
                    id: task.id,
                    content: task.content,
                    status: task.status as TodoStatus,
                    type: task.type as TaskType,
                  }}
                 
                />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      
        <DeleteTask task={{id: task.id}}/>
    
    </div>
  </div>
))}

      </div>
    </div>
    </div>
  );
}