<template>
    <section class="app-calculator">
        <section class="app-calculator-result">
            <section class="result-preInput">{{preInput}}</section>
            <section class="result-curInput">{{curInput}}</section>
        </section>
        <section class="app-calculator-keyboard" @click.stop="keyboardClick">
            <just-button class="touch-keyboard">%</just-button>
            <just-button class="touch-keyboard">√</just-button>
            <just-button class="touch-keyboard">X²</just-button>
            <just-button class="touch-keyboard">1/X</just-button>
            <just-button class="touch-keyboard">CE</just-button>
            <just-button class="touch-keyboard">C</just-button>
            <just-button class="touch-keyboard"><i class="fa fa-long-arrow-left"></i></just-button>
            <just-button class="touch-keyboard">÷</just-button>
            <just-button class="touch-keyboard">7</just-button>
            <just-button class="touch-keyboard">8</just-button>
            <just-button class="touch-keyboard">9</just-button>
            <just-button class="touch-keyboard">×</just-button>
            <just-button class="touch-keyboard">4</just-button>
            <just-button class="touch-keyboard">5</just-button>
            <just-button class="touch-keyboard">6</just-button>
            <just-button class="touch-keyboard">－</just-button>
            <just-button class="touch-keyboard">1</just-button>
            <just-button class="touch-keyboard">2</just-button>
            <just-button class="touch-keyboard">3</just-button>
            <just-button class="touch-keyboard">＋</just-button>
            <just-button class="touch-keyboard">±</just-button>
            <just-button class="touch-keyboard">0</just-button>
            <just-button class="touch-keyboard">.</just-button>
            <just-button class="touch-keyboard">＝</just-button>
        </section>
        <section class="app-calculator-records">
            <section class="records-header">历史记录</section>
            <section class="records-body" v-if="records.length > 0">
                <section
                v-for="(item, index) in records"
                :key="index"
                class="records-item">
                    <section class="records-item-preInput">{{item.preInput}} = </section>
                    <section class="records-item-curInput">{{item.curInput}}</section>
                </section>
            </section>
            <section class="records-empty" v-else>
                暂无
            </section>
        </section>
    </section>
</template>

<script>
import CalculatorService from './calculatorService'

const service = new CalculatorService()

export default {
    name: 'calculator',
    data () {
        return {
            preValue: 0,
            preInput: '',
            curInput: '',
            inputKey: '',
            calculate: {
                ifCalculate: false,
                optStr: ''
            },
            records: []
        }
    },
    methods: {
        keyboardClick (e) {
            if (this.curInput === '溢出') this.curInput = ''
            const clickValue = e.target.innerText || 'back'
            const inputKey = service.nums.includes(clickValue) ? 'num' : clickValue
            service.keyFun[inputKey].clickFn(this, clickValue)
            this.inputKey = inputKey
        }
    }
}
</script>

<style lang="scss">
.app-calculator {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: calc(100% - 300px) 300px;
    grid-template-rows: 200px calc(100% - 200px);
    width: 100%;
    height: 100%;
    background-color: rgba($color: #ffffff, $alpha: 0.8);
    padding: 5px;
    &-result {
        padding-right: 10px;
    }
    &-keyboard {
        padding-right: 10px;
        display: grid;
        grid-row-gap: 5px;
        grid-column-gap: 5px;
        grid-template-columns: repeat(4, calc((100% - 15px) / 4));
        grid-template-rows: repeat(6, calc((100% - 25px) / 6));
        .touch-keyboard {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5em;
            background-color: #ffffff;
            transition: background-color .3s;
            &:hover {
                background-color: rgba(227,227,227,1);
            }
        }
    }
    &-records {
        grid-row: 1 / span 2;
        .records-header {
            border-bottom: 2px solid #1890ff;
            display: inline-block;
            padding-bottom: 5px;
            font-weight: 600;
        }
        .records-body {
            padding: 10px 0;
            overflow-y: auto;
            height: calc(100% - 30px);
        }
        .records-empty {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #ccc;
        }
        .records-item {
            margin-bottom: 40px;
            transition: background-color .3s;
            &:hover {
                background-color: rgba($color: #ccc, $alpha: .7);
            }
            &-curInput {
                text-align: right;
                font-size: 1.4em;
                margin-top: 5px;
                font-weight: 600;
                padding: 0 20px 10px 0;
            }
            &-preInput {
                text-align: right;
                color: #797373;
                font-size: .9em;
                letter-spacing: 2px;
                padding: 10px 20px 0 0;
            }
        }
    }
    .result-preInput {
        text-align: right;
        font-size: 1.3em;
        overflow: hidden;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin: 20px 0;
        color: #797373;
    }
    .result-curInput {
        text-align: right;
        font-size: 2.7em;
        font-weight: 600;
    }
}
</style>