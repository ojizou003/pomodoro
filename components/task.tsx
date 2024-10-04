'use client';

import { Task as TaskType } from '@/types/task';
import { Pause, Play, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import useLocalStorageState from 'use-local-storage-state';
import { useStopwatch } from 'react-timer-hook';
import { useEffect } from 'react';

export default function Task({task}: {task: TaskType}){
    const [setTasks] = useLocalStorageState<(string | { id: string; title: string; })[]>('tasks', {
        defaultValue: []
    });

    const [mode, setMode] = useLocalStorageState<'working' | 'break'>('working');

    const {
        seconds,
        minutes,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch();

    useEffect(() => {
        if (minutes >= 25 && mode === 'working'){
            alert('休憩時間です');
            setMode('break');
            setTasks((prev) => prev.map((item) => {
                if (item.id === task.id) {
                    return {
                        ...item,
                        completed: true,
                    }
                }
            }))
            reset();
        }

        if (minutes >= 5 && mode === 'break'){
            alert('作業時間です');
            setMode('working');
            reset();
        }
    }, [minutes, mode, setMode, reset, setTasks, task.id])

    const getFormatedTime = (time: number) => {
        return time < 10 ? `0${time}`: time;
    }
    
    return (
        <div className="p-4 flex gap-2 items-center border rounded-md" key={typeof task === 'string' ? task : task.id}>
        
        {task.completed && (<span className='px-2 py-1.5 border rounded bg-muted text-muted-foreground text-xs'>完了</span>)}

        {typeof task === 'string' ? task : task.title}

        <span className="flex-1"></span>

        <p className='text-muted-foreground tabular-nums text-sm'>{getFormatedTime(minutes)}:{getFormatedTime(seconds)}</p>

        {isRunning ? (<Button 
            variant="ghost" 
            className="text-muted-foreground"
            size="icon" 
            onClick={pause}
            >
            <Pause size={18}/>
            <span className="sr-only">タスク停止</span>
        </Button>): (<Button 
            variant="ghost" 
            className="text-muted-foreground"
            size="icon" 
            onClick={start}
            >
            <Play size={18}/>
            <span className="sr-only">タスク開始</span>
        </Button>)}
        <Button 
            variant="ghost" 
            className="text-muted-foreground"
            size="icon" 
            onClick={() => {
                setTasks((prev) => prev.filter((item) => item.id !== task.id));
            }}
            >
            <Trash size={18}/>
            <span className="sr-only">タスクを削除</span>
        </Button>
        </div>
    )
}