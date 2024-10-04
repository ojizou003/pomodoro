'use client';

import Task from "@/components/task";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import useLocalStorageState from 'use-local-storage-state';

type FormType = {
  title: string;
}


export default function Home() {
    const [tasks, setTasks] = useLocalStorageState<(string | { id: string; title: string; })[]>('tasks', {
      defaultValue: []
  });

    const {handleSubmit, register, formState: {
    isValid},
    reset
  } = useForm<FormType>({
    mode: 'onChange', 
    defaultValues: {
      title: "",
    },
  });

    const onSubmit = async (data: FormType) => {
      setTasks((prev) => [
        ...prev, 
        {
          id: crypto.randomUUID(), 
          title: data.title,
        }, 
      ]);

      reset();
    };

  return (
    <main className="px-6 pt-4">
      <form onSubmit={handleSubmit(onSubmit)} className=" max-w-lg mx-auto bg-muted p-4 border rounded-lg space-y-2">
        <div>
            <label className="font-bold" htmlFor="title">Task</label>
            <Input {...register('title', {
              required: true
            })} autoComplete="off" id='title' />
        </div>
        <Button disabled={!isValid}>ENTRY</Button>
      </form>

      <h2 className="max-w-lg mx-auto font-bold mt-4">Task-List</h2>

      <div className="max-w-lg mx-auto space-y-2">
        {tasks.map((task) => {
          return ( 
            <Task key={task.id} task={task}/>
          );
        })}
      </div>
    </main>
  );
}
