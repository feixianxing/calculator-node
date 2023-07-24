import { PRIO_LV, ABS_ODEVITY } from '../interfaces'
import Stack from './stack'

class Calculator{
    // 构造函数, 初始化成员变量
    constructor(){
        this.operatorSym = "支持运算符：+, - , *, /, %（百分号）, ^（幂次方）, | |（绝对值），！（阶乘）。其他符号：( ) [ ] { }"
        this.result = 0.0
    }

    // 表达式自定义标准格式化
    getFormat():void{
        this.stdInfix = this.infix

        // 实现正负数
        for(let i=0; i<this.stdInfix.length; i++){
            if(this.stdInfix.at(i)==='-' || this.stdInfix.at(i)==='+'){ // -x转换为0-x, +x转换为0+x
                if(i===0){
                    this.stdInfix = '0'+this.stdInfix
                }else if(this.stdInfix.at(i-1)==='('){
                    // 在 '('和'-'/'+'之间插入'0'
                    this.stdInfix = 
                        this.stdInfix.slice(0, i) + '0' + this.stdInfix.slice(i)
                }
            }
        }
    }

    // 获取算术符号优先级
    getPrior(c:string):PRIO_LV{
        // 返回优先级
        if (c === '+' || c === '-') {
            return PRIO_LV.PRIO_LV1;
        }
        else if (c === '*' || c === '/') {
            return PRIO_LV.PRIO_LV2;
        }
        else if (c === '%' || c === '^') {
            return PRIO_LV.PRIO_LV3;
        }
        else if (c === '!') {
            return PRIO_LV.PRIO_LV4;
        }
        else {
            return PRIO_LV.PRIO_LV0;
        }
    }

    //后缀表达式转换
    getPostfix():void{
        let absNumber: ABS_ODEVITY = ABS_ODEVITY.ABS_ODD    // 绝对值符号个数的奇偶性
        let tmp: string = ""
        
        for(let i=0; i<this.stdInfix.length; i++){
            tmp = ""
            switch(this.stdInfix.at(i)){
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                case '^':
                case '!':
                    if (this.symStack.empty() 
                    || this.symStack.top() === '(' 
                    || this.symStack.top() === '[' 
                    || this.symStack.top() === '{' 
                    || (
                        this.symStack.top() === '|' 
                        && absNumber === ABS_ODEVITY.ABS_ODD
                        )
                    ){
                        this.symStack.push(this.stdInfix[i])
                    }else{
                        while (!this.symStack.empty() 
                        && (this.getPrior(this.symStack.top()) >= this.getPrior(this.stdInfix[i]))) {
                            tmp += this.symStack.top()
                            this.postfix.push(tmp)
                            this.symStack.pop()
                            tmp = ""
                        }
                        this.symStack.push(this.stdInfix[i])
                    }
                    break
                case '|':
                    if(absNumber === ABS_ODEVITY.ABS_ODD){
                        this.symStack.push(this.stdInfix[i])
                        absNumber = ABS_ODEVITY.ABS_EVEN
                    }else{
                        while (!this.symStack.empty() && this.symStack.top() !== '|') {
                            tmp += this.symStack.top()
                            this.postfix.push(tmp)
                            this.symStack.pop()
                            tmp = ""
                        }
                        if (!this.symStack.empty() && this.symStack.top() === '|') {
                            tmp += this.symStack.top()
                            this.postfix.push(tmp)  //左绝对值符号'|'加入后缀表达式，用于绝对值的检测计算
                            this.symStack.pop()
                            absNumber = ABS_ODEVITY.ABS_ODD
                        }
                    }
                    break
                case '(':
                case '[':
                case '{':
                    this.symStack.push(this.stdInfix[i])
                    break
                case ')':
                    while (!this.symStack.empty() && this.symStack.top() !== '(') {
                        tmp += this.symStack.top()
                        this.postfix.push(tmp)
                        this.symStack.pop()
                        tmp = ""
                    }
                    if (!this.symStack.empty() && this.symStack.top() === '(') {
                        this.symStack.pop()				//将左括号出栈丢弃
                    }
                    break
                case ']':
                    while (!this.symStack.empty() && this.symStack.top() !== '[') {
                        tmp += this.symStack.top()
                        this.postfix.push(tmp)
                        this.symStack.pop()
                        tmp = ""
                    }
                    if (!this.symStack.empty() && this.symStack.top() === '[') {
                        this.symStack.pop();						//将左括号出栈丢弃
                    }
                    break
                case '}':
                    while (!this.symStack.empty() && this.symStack.top() !== '{') {
                        tmp += this.symStack.top()
                        this.postfix.push(tmp)
                        this.symStack.pop()
                        tmp = ""
                    }
                    if (!this.symStack.empty() && this.symStack.top() === '{') {
                        this.symStack.pop()						//将左括号出栈丢弃
                    }
                    break
                default:    // 均不是以上涉及的符号，则认为是数字
                    if ((this.stdInfix[i] >= '0' && this.stdInfix[i] <= '9')) {
                        tmp += this.stdInfix[i]
                        while (i + 1 < this.stdInfix.length 
                            && (this.stdInfix[i+1] >= '0' 
                            && this.stdInfix[i+1] <= '9' 
                            || this.stdInfix[i+1] === '.')) {		//小数处理
                            tmp += this.stdInfix[i + 1]			//是连续的数字，则追加
                            i++
                        }
                        if (tmp[tmp.length - 1] === '.') {
                            tmp += '0'					//将x.做x.0处理
                        }
                        this.postfix.push(tmp)
                    }
                    break
            }//end switch
        }// end for

        while(!this.symStack.empty()){  // 将栈中剩余符号加入后缀表达式
            tmp = ""
            tmp += this.symStack.top()
            this.postfix.push(tmp)
            this.symStack.pop()
        }
    }		
    
    //计算后缀表达式，得到最终计算结果，将结果传递到Calculator类的result属性
	calResult():void{
        let tmp: string = ""
        let number: number = 0
        let op1: number = 0
        let op2: number = 0

        for (let i=0; i<this.postfix.length; i++){
            tmp = this.postfix[i];
            if (tmp[0]>='0' && tmp[0]<='9') {
                number = Number(tmp)
                this.figStack.push(number)
            }
            else if (this.postfix[i]==="+"){
                if (!this.figStack.empty()) {
                    op2 = this.figStack.top()
                    this.figStack.pop()
                }
                if (!this.figStack.empty()) {
                    op1 = this.figStack.top();
                    this.figStack.pop();
                }
                this.figStack.push(op1 + op2);
            }
            else if (this.postfix[i] === "-") {
                if (!this.figStack.empty()) {
                    op2 = this.figStack.top()
                    this.figStack.pop()
                }
                if (!this.figStack.empty()) {
                    op1 = this.figStack.top()
                    this.figStack.pop()
                }
                this.figStack.push(op1 - op2)
            }
            else if (this.postfix[i] === "*") {
                if (!this.figStack.empty()) {
                    op2 = this.figStack.top()
                    this.figStack.pop()
                }
                if (!this.figStack.empty()) {
                    op1 = this.figStack.top()
                    this.figStack.pop()
                }
                this.figStack.push(op1* op2)
            }
            else if (this.postfix[i] === "/") {
                if (!this.figStack.empty()) {
                    op2 = this.figStack.top()
                    this.figStack.pop()
                }
                if (!this.figStack.empty()) {
                    op1 = this.figStack.top()
                    this.figStack.pop()
                }
                if (op2 !== 0) {
                    //除数不为0，未做处理，默认
                }
                this.figStack.push(op1 / op2)
            }
            else if (this.postfix[i] === "%") {
                if (!this.figStack.empty()) {
                    op2 = this.figStack.top()
                    this.figStack.pop()
                }
                if (!this.figStack.empty()) {
                    op1 = this.figStack.top()
                    this.figStack.pop()
                }
                this.figStack.push(op1 % op2);			//可进行小数求余
            }
            else if (this.postfix[i] === "^") {
                if (!this.figStack.empty()) {
                    op2 = this.figStack.top()
                    this.figStack.pop()
                }
                if (!this.figStack.empty()) {
                    op1 = this.figStack.top()
                    this.figStack.pop()
                }
                this.figStack.push(Math.pow(op1, op2))
            }
            else if (this.postfix[i] === "|") {
                if (!this.figStack.empty()) {
                    op1 = this.figStack.top()
                    this.figStack.pop()
                }
                this.figStack.push(Math.abs(op1))
            }
            else if (this.postfix[i] === "!") {
                if (!this.figStack.empty()) {
                    op1 = this.figStack.top()
                    this.figStack.pop()
                }
                if (op1 > 0) {
                    //阶乘数应大于；为小数时(转化为整数求阶)
                    let factorial:number = 1
                    for (let i=1; i<=op1; ++i)
                    {
                        factorial *= i
                    }
                    op1 = factorial
                }
                this.figStack.push(op1)
            }
        }//end for
        if (!this.figStack.empty()) {
            this.result = this.figStack.top()
        }
    }

    // 给外部调用的计算方法
	calculate():void{
        this.getFormat()    // 表达式自定义标准格式化
        this.getPostfix()   // 后缀表达式转换
        this.calResult()    // 获取算术结果
    }

    //获取结果
	getResult():number{
        return this.result    
    }

    operatorSym:string = ""     //运算符号
	infix:string = ""			//表达式缓存

    private postfix: string[] = []  // 后缀表达式向量
    private symStack: Stack<string> = new Stack<string>() // 符号栈
    private figStack: Stack<number> = new Stack<number>() // 数字栈
    private stdInfix: string = ""   // 自定义标准格式化表达式
    private result: number = 0      // 最终计算结果 
}

export default Calculator