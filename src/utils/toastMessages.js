import toast from 'react-hot-toast'


exports.showToastWarning =(message)=>{
    toast(`⚠️ ${message}`,{
        style:{
            background:"#f59e0b",
            color:"#fff"
        },
        icon:"⚠️"
    })
}

exports.showToastInfo =(message)=>{
    toast(`ℹ️ ${message}`,{
        style:{
            background:"#3b82f6",
            color:"#fff"
        },
        icon:"ℹ️"
    })
}

