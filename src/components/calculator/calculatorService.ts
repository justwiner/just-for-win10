import {trimStart} from '@/lib/tools'

interface CalculatorV {
    curInput: string,
    preValue: number,
    preInput: string,
    inputKey: string,
    preOptStr: string,
    calculate: calculate,
    records: Record[]
}

interface calculate {
    ifCalculate: Boolean,
    optStr: string
}

interface KeyFun {
    [key: string]: any
}

interface Record {
    curInput: string,
    preValue: number,
    preInput: string,
}

class CalculatorService {
    public calculateKey = ['÷', '×', '－', '＋']
    public nums = '1234567890.'
    public maxInputLength = 15
    public keyFun: KeyFun = {
        '%': {
            clickFn: (context: CalculatorV) => {
                if (this.checkIfEmptyInput(context.curInput)) return
                context.curInput = (+context.curInput * 100).toString()
            },
            calculateFn: () => {

            }
        },
        '√': {
            clickFn: (context: CalculatorV) => {
                if (this.checkIfEmptyInput(context.curInput)) return
                context.curInput = Math.sqrt(+context.curInput).toString()
            },
            calculateFn: () => {
                
            }
        },
        'X²': {
            clickFn: (context: CalculatorV) => {
                if (this.checkIfEmptyInput(context.curInput)) return
                context.curInput = Math.pow(+context.curInput, 2).toString()
                if (context.curInput === 'Infinity') {
                    context.curInput = '溢出'
                    context.calculate = {
                        ifCalculate: true,
                        optStr: ''
                    }
                }
            },
            calculateFn: () => {
                
            }
        },
        '1/X': {
            clickFn: (context: CalculatorV) => {
                if (this.checkIfEmptyInput(context.curInput)) return
                if (+context.curInput === 0) return
                context.curInput = (1 / +context.curInput).toString()
            },
            calculateFn: () => {
                
            }
        },
        'CE': {
            clickFn: (context: CalculatorV) => {
                context.curInput = ''
            }
        },
        'C': {
            clickFn: (context: CalculatorV) => {
                context.curInput = ''
                context.preInput = ''
                context.preValue = 0,
                context.inputKey = '',
                context.preOptStr = '',
                context.calculate = {
                    ifCalculate: false,
                    optStr: ''
                }
            }
        },
        'back': {
            clickFn: (context: CalculatorV) => {
                if (this.checkIfEmptyInput(context.curInput)) return
                context.curInput = context.curInput.substr(0, context.curInput.length - 1);
            }
        },
        '÷': {
            clickFn: (context: CalculatorV) => {
                this.calculate('÷', context)
            },
            calculateFn: (a:number, b:number): number => {
                return a/b
            }
        },
        '×': {
            clickFn: (context: CalculatorV) => {
                this.calculate('×', context)
            },
            calculateFn: (a:number, b:number): number => {
                return a*b
            }
        },
        '－': {
            clickFn: (context: CalculatorV) => {
                this.calculate('－', context)
            },
            calculateFn: (a:number, b:number): number => {
                return a-b
            }
        },
        '＋': {
            clickFn: (context: CalculatorV) => {
                this.calculate('＋', context)
            },
            calculateFn: (a:number, b:number): number => {
                return a+b
            }
        },
        '±': {
            clickFn: (context: CalculatorV) => {
                if (this.checkIfEmptyInput(context.curInput)) return
                context.curInput = '-' + context.curInput
            }
        },
        '＝': {
            clickFn (context: CalculatorV) {
                if (!context.preOptStr) return
                const service = new CalculatorService()
                if (service.checkIfEmptyInput(context.curInput)) return
                let valVal = 0
                if (service.calculateKey.includes(context.inputKey)) {
                    valVal = service.keyFun[context.preOptStr].calculateFn(+context.curInput, +context.curInput)
                } else {
                    valVal = service.keyFun[context.preOptStr].calculateFn(+context.preValue, +context.curInput)
                    
                }
                service.addRecord(context.preInput + `${context.curInput}`, valVal + '', context)
                context.curInput = valVal + ''
                context.preValue = 0
                context.preOptStr = ''
                context.preInput = ''
            }
        },
        'num': {
            clickFn: (context: CalculatorV, inputVal:string) => {
                this.input(inputVal, context)
            }
        }
    }
    public checkIfEmptyInput (curInput: string):Boolean {
        return (curInput === '')
    }
    public input (inputKey: string, context: CalculatorV) {
        if (context.calculate.ifCalculate) {
            context.preValue = +context.curInput
            context.curInput = ''
        }
        if (context.curInput === '' && inputKey === '.') return
        if (context.curInput.startsWith('0') && context.curInput.length >= 1 && !(context.curInput + inputKey).includes('0.')) {
            context.curInput = trimStart(context.curInput, '0')
        }
        if (context.curInput.includes('.') && inputKey === '.') return
        if (context.curInput.length >= this.maxInputLength) return
        context.curInput = context.curInput + inputKey
        context.calculate = {
            ifCalculate: false,
            optStr: ''
        }
    }
    public calculate (optStr: string, context: CalculatorV) {
        const backupCurInput = context.curInput
        if (this.checkIfEmptyInput(context.curInput)) return
        if (this.calculateKey.includes(context.inputKey) && this.calculateKey.includes(optStr)) {
            context.preInput = context.preInput.substr(0, context.preInput.length - 1) + optStr
            context.preOptStr = optStr
            context.inputKey = ''
            return
        }
        if (!context.preValue) {
            context.preValue = +backupCurInput
            context.curInput = backupCurInput
            context.preOptStr = optStr
        } else {
            const calValue = this.keyFun[context.preOptStr].calculateFn(+context.preValue, +backupCurInput)
            context.curInput = calValue + ''
            context.preOptStr = optStr
        }
        context.calculate = {
            ifCalculate: true,
            optStr
        }
        context.preInput += (backupCurInput + ` ${optStr}`)
    }
    public addRecord (preInput: string, curInput: string, context: CalculatorV) {
        context.records.unshift({
            preInput,
            curInput,
            preValue: +curInput
        })
    }
}

export default CalculatorService