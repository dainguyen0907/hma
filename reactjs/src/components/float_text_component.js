import { FloatingLabel } from "flowbite-react";
import React from "react";

export default function FloatTextComponent(props){

    const onHandleTextBox=(e)=>{
        props.setData(e.target.value);
    }

    return(
        <FloatingLabel variant="outlined" label={props.label} onChange={onHandleTextBox} value={props.data} type={props.type} helperText={props.helper} readOnly={props.readonly}/>
    );
}