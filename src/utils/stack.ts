class Stack<Type>{
    private stack: Type[] = []  // 使用数组实现，数据类型在创建时传入
    
    // 推入新元素
    push(item:Type):void{
        this.stack.push(item)
    }

    // 弹出顶层元素并返回
    pop():Type|undefined{
        return this.stack.pop()
    }

    // 是否为空
    empty():boolean{
        return this.stack.length===0
    }

    // 查看顶层元素
    top():Type{
        return this.stack[this.stack.length-1]
    }
}

export default Stack