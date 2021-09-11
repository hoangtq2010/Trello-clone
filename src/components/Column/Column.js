import Card from "components/Card/Card";
import React from "react";
import './Column.scss';

import { mapOrder } from "../../utilities/sorts"

function Column(props) {
    const { column } = props
    const cards = mapOrder(column.cards, column.cardOder, 'id')

    return(
        <div className="column">
            <header>{column.title}</header>
            <ul className="card-list">
                {cards.map((card, index) => <Card key={index} card={card}/>)}
                
                {/* <li className="task-item">Add what you'd like to work on below</li>
                <li className="task-item">Add what you'd like to work on below</li>
                <li className="task-item">Add what you'd like to work on below</li>
                <li className="task-item">Add what you'd like to work on below</li>
                <li className="task-item">Add what you'd like to work on below</li> */}
            </ul>
            <footer>Add another card</footer>
        </div>
    )
}

export default Column