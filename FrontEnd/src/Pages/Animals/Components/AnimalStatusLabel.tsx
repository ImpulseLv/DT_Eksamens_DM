import React from "react";
import {AnimalStatuss} from "../../../Types/Animal";

interface AnimalStatusLabelProps {
    status: AnimalStatuss
    ;
}

export const AnimalStatusLabel = (props:AnimalStatusLabelProps) => {
    let text;
    let color;
    switch(props.status) {
        case AnimalStatuss.free:
            color = 'green';
            text = 'Free';
            break;
        case AnimalStatuss.booked:
            color = 'gray';
            text = 'Booked';
            break;
        case AnimalStatuss.taken:
            color = 'red';
            text = 'Taken';
            break;
        default:
            color = 'red';
            text = '[ERROR]'
    }

    return <div style={{color:color}}>{text}</div>

}