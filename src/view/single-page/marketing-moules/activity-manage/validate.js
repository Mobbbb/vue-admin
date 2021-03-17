// 选择时间段，开始时间大于当前时间
export const validNowTime = (rule, value, callback) => {
  let now = new Date();
  let dataTime = new Date(value[0]);
  if (dataTime < now) {
    callback(new Error("选择时间不能小于当前时间"));
  } else {
    callback();
  }
}
// 选择时间年月日时分秒，大于当前时间
export const moreThanCurrentTime = (rule, value, callback) => {
  let now = new Date();
  let dataTime = new Date(value);
  if (dataTime < now) {
    callback(new Error("选择时间不能小于当前时间"));
  } else {
    callback();
  }
}
// 请选择时间，时间范围选择器默认['','']
export const  validTime = (rule, value, callback) => {
  if (value[0] && value[1]) callback();
  else callback(new Error("请选择时间"));
}

// 二维数组至少有一个值的数组长度大于0
export const  noEmpty = (rule, value, callback) => {
  if (value[0].length || (value[1] && value[1].length)) callback();
  else callback(new Error("至少选择一种奖励模板"));
}

// 整数校验,小于100
export const  numValidate = (rule, value, callback) => {
  if (value % 1 !== 0) {
    callback(new Error("请输入整数"));
  } else if (value > 100) {
    callback(new Error("0-100的整数"));
  } else {
    callback();
  }
}

// 整数校验,9位限制
export const  integerValidate = (rule, value, callback) => {
  if (value % 1 !== 0) {
    callback(new Error("请输入整数"));
  } else if (String(value).length > 9) {
    callback(new Error("最多9位数"));
  } else {
    callback();
  }
}

// 整数校验,4位限制
export const  fourValid = (rule, value, callback) => {

  if (value % 1 !== 0) {
    callback(new Error("请输入整数"));
  } else if (String(value).length > 4) {
    callback(new Error("最多4位数"));
  } else {
    callback();
  }
}

// 数组对象中，每个对象非空
export const  mustTwo = (rule, value, callback) => {
  for(let val of value){
    if(!val.ladderValue||!val.rewardValue){
      callback(new Error("请将信息填写完整"));
      break
    }else if(val.ladderValue % 1 !== 0 || val.rewardValue % 1 !== 0 || val.ladderValue<=0 || val.rewardValue<=0){
      callback(new Error("限大于0的整数"));
      break
    }
  }
  callback();
}
// 数组对象中，每个对象非空
export const  mustAward = (rule, value, callback) => {
  for(let val of value){
    if(!val.rewardValue){
      callback(new Error("请将信息填写完整"));
      break
    }else if(val.rewardValue % 1 !== 0 || val.rewardValue<=0 ){
      callback(new Error("限大于0的整数"));
      break
    }else if(String(val.rewardValue).length > 9){
      callback(new Error("最多9位数"));
      break
    }
  }
  callback();
}

