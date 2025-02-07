import toast from 'react-hot-toast'


export const showToastWarning =(message)=>{
    toast(`⚠️ ${message}`,{
        style:{
            background:"#f59e0b",
            color:"#fff"
        },
        icon:"⚠️"
    })
}

export const showToastInfo =(message)=>{
    toast(`ℹ️ ${message}`,{
        style:{
            background:"#3b82f6",
            color:"#fff"
        },
        // icon:"ℹ️"
    })
}


// module.exports = {showToastInfo,showToastWarning}