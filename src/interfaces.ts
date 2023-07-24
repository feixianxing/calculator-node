enum PRIO_LV{
    // 算数运算符优先权等级
    PRIO_LV0 = 0,
    PRIO_LV1 = 1,
    PRIO_LV2 = 2,
    PRIO_LV3 = 3,
    PRIO_LV4 = 4
}

enum ABS_ODEVITY{
    // 绝对值符号个数的奇偶性
    ABS_ODD = 1,
    ABS_EVEN = 2
}

// 简单实现的栈, 实现在'./utils/stack.ts'
interface Stack<Type>{
    stack: Type[];
    push(item:Type): void;
    pop(): Type;
    empty(): boolean|undefined;
    top(): Type|undefined;
}

export { PRIO_LV, ABS_ODEVITY, Stack }