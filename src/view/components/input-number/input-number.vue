<template>
    <div class="append-input-wrap">
        <InputNumber
            :min="min"
            :max="max"
            :value="value"
            :precision="precision"
            :style="styles"
            @on-change="numberInput"
            class="my-number-input">
        </InputNumber>
        <div class="append-input">{{appendText}}</div>
    </div>
</template>

<script>

export default {
    name:'input-number',
    props: {
        min: {
            type: Number,
            default: -Infinity
        },
        max: {
            type: Number,
            default: Infinity
        },
        value: {
            type: Number,
            default: null
        },
        precision: {
            type: Number
        },
        appendText: {
            type: String
        },
        styles: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            
        }
    },
    mounted () {
        
    },
    methods: {
        numberInput (value) {
            this.$emit('input', value)
            this.$emit('on-change', value)
        }
    }
}
</script>

<style scoped>
    .append-input-wrap{
        display: inline-flex;
        position: relative;
        align-items: center;
    }
    .append-input{
        height: 32px;
        padding: 0 7px;
        color: #515a6e;
        text-align: center;
        background-color: #f8f8f9;
        border: 1px solid #dcdee2;
        border-left: 0;
        border-radius: 4px;
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        line-height: 33px;
        white-space: nowrap;
        vertical-align: middle;
    }
    .my-number-input{
        border-radius: 4px 0 0 4px;
        box-shadow: none;
        line-height: 29px;
    }
</style>
