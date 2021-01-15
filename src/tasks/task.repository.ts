import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { Repository, EntityRepository } from "typeorm";
import { TaskStatus } from './task-status.enum';
// Task at entity not a model : model like interface
@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task()
        task.description = description
        task.title = title
        task.status = TaskStatus.OPEN
        await task.save()
        return task;
    }
    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto
        const query = this.createQueryBuilder('task')
        if (status) {
            query.andWhere('task.status = :status', { status })
        }
        if (search) {
            // @ %% for like regex
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
        }

        const tasks = await query.getMany()

        return tasks;
    }
}