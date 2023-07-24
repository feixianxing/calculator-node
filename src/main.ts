import Calculator from "./utils/calculator"
import readLine from 'readline'
import type {ReadLine} from 'readline'

// 创建计算器实例对象
const cal:Calculator = new Calculator()

// 创建readline实例对象，实现控制台的输入输出
const readline:ReadLine = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log('⭐ '+cal.operatorSym)
console.log('👍 example: ')
console.log('1+1 <press Enter>')
console.log('2')
console.log("")

async function ask():Promise<void>{
    return new Promise((resolve)=>{
        readline.question('', (input:string)=>{
            // 读取用户的输入
            cal.infix = input
            // 计算
            cal.calculate()
            // 输出计算结果
            console.log(cal.getResult())
            // 一个计算周期结束
            resolve()
        })
    })
}

async function execute(){
    while(true){
        await ask()
    }
}

execute()
