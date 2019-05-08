<template>
	<div>
		<Button type="primary" @click="showModal = true">{{btnText}}</Button>
		<Modal  
			v-model="showModal"
			@on-ok="confirm"
			@on-cancel="cancel"
			title="自定义列表"
			:mask-closable="false"
			width="800">
			<div class="cloumns-modal-continer">
				<div class="cloumns-modal-content">
					<ul>
						<li v-for="item in titleList" :key='item' class="single-selected">{{item}}</li>
					</ul>
					<section class="columns-list">
						<CheckboxGroup v-model="idList" @on-change="changeColumns">
							<li v-for="item in customList" :key="item.key" class="checkbox-item">
								<Checkbox :label="item.key">{{item.title}}</Checkbox>
							</li>
						</CheckboxGroup>
					</section>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script>
export default {
	name: 'TableColumns',
	props: {
	    value: {
	    	type: Array,
            default: () => {
                return []
            }
	    },
	    customList: Array,  // 所有待选择的数据集
	    btnText: {
	    	type: String,
	    	default: '自定义显示列'
	    }
	},
	data() {
		return {
			activeTimes: 0,
			allIdList: [], // 所有项的id顺序集合
			idList: [], // 选中项的id集合
			titleList: [], // 选中项的title集合
			oldSelectList: [], // 存储数组一开始的内容
			showModal: false
	  	}
	},
	watch: {
		'customList': function(){
			this.init(this.value)
			this.allIdList = JSON.parse(JSON.stringify(this.customList))
		},
		'value': function(){
			this.init(this.value)
			if(!this.value.length) this.getAllIdList() // 为空，变成全选
			if(!this.activeTimes){ // 第一次获取数据，保存旧数组
				this.oldSelectList = []
				for(let i = 0; i < this.value.length; i++){
					this.oldSelectList.push(this.value[i])
				}
			}
			this.activeTimes ++
		}
	},
	mounted(){
		this.init(this.value)
		if(!this.value.length) this.getAllIdList() // 为空，变成全选
		this.allIdList = JSON.parse(JSON.stringify(this.customList))
	},
	methods: {
		getAllIdList() {
			let allIds = []
			for(let i = 0; i < this.allIdList.length; i++){
				allIds.push(this.allIdList[i].key)
			}
			this.$emit('input', allIds)
		},
		init(selectIdList) {
			this.idList = []
			this.titleList = []
			for(let i = 0; i < selectIdList.length; i++){
				this.idList.push(selectIdList[i])
				for(let j = 0; j < this.customList.length; j++){
					if(this.customList[j].key === selectIdList[i]){
						this.titleList.push(this.customList[j].title)
					}
				}
			}
		},
		changeColumns(val) {
			let orderIdList = []
			for(let i = 0; i < this.allIdList.length; i++){
				for(let j = 0; j < val.length; j++){
					if(this.allIdList[i].key === val[j]){
						orderIdList.push(this.allIdList[i].key)
					}
				}
			}
			this.$emit('input', orderIdList)
		},
		confirm() {
			this.oldSelectList = []
			for(let i = 0; i < this.value.length; i++){
				this.oldSelectList.push(this.value[i])
			}
			this.$emit('on-confirm')
		},
		cancel() {
			this.$emit('input', this.oldSelectList)
		},
		getCustomFields (allFields, selectIds) {
			let arr = []
			for(let i = 0; i < allFields.length; i++){
				for(let j = 0; j < selectIds.length; j++){
					if(allFields[i].key === selectIds[j]){
						arr.push(allFields[i])
					}
				}
			}
			if(!arr.length) arr = JSON.parse(JSON.stringify(allFields))

			return arr
		}
	}
}
</script>

<style lang="less">
	.cloumns-modal-content {
		li {
			list-style: none;
			display: inline-block;
		}
		ul {
			padding-bottom: 20px;
			border-bottom: 1px dashed #DCE1E7;
			margin-bottom: 20px;
		}
		.single-selected {
			margin: 3px 5px;
			line-height: 22px;
			padding: 0 15px;
			background-color: #5f93e1;
			border-radius: 2px;
			color: #FFF;
			font-size: 12px;
			cursor: move;
		}
		.checkbox-item {
			margin: 10px 5px;
		}
		.columns-list {
			max-height: 260px;
			overflow-y: auto;
		}
	}
</style>