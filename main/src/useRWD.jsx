import { useState,useEffect} from 'react';

const useRWD=()=>{
    const [device,setDevice]=useState("mobile");

    const handleRWD=()=>{
        if(window.innerWidth >= 1200)
            setDevice("xl");
        else if (window.innerWidth >= 992)
            setDevice("lg");
        else if (window.innerWidth >= 768)
            setDevice("md");
        else if (window.innerWidth >= 540)
            setDevice("sm");
        else if (window.innerWidth >= 576)
            setDevice("xs");
        else
            setDevice("none");
    }

    useEffect(()=>{ 
        window.addEventListener('resize',handleRWD);
        return(()=>{
            window.removeEventListener('resize',handleRWD);
        })
    },[]);

    return device;
}

export default useRWD;