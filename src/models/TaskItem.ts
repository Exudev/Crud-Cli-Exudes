export class TaskItem {
    public constructor(
        public id: number,
        public task: string,
        public complete: boolean = false
    
    ){}

printDetails(): void{
    console.log(`${this.id} ${this.task} ${this.complete ? "(complete)": ""}`)
    } 
}     
