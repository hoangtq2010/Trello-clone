import Card from 'components/Card/Card'
import React from 'react'
import './Column.scss'

import { mapOrder } from '../../utilities/sorts'

import { Container, Draggable } from 'react-smooth-dnd'

function Column(props) {
    const { column, onCardDrop } = props //data tu cha->con
    const cards = mapOrder(column.cards, column.cardOrder, 'id')

    return (
        <div className="column">
            <header className="column-drag-handle">{column.title}</header>
            <div className="card-list">
                <Container
                    orientation="vertical" //default
                    groupName="hoangkissdev-columns"
                    onDrop={dropResult => onCardDrop(column.id, dropResult)}
                    getChildPayload={index => cards[index]}
                    dragClass="card-ghost"
                    dropClass="card-ghost-drop"
                    dropPlaceholder={{
                      animationDuration: 150,
                      showOnTop: true,
                      className: 'card-drop-preview'
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, index) => (
                        <Draggable key={index}>
                            <Card card={card}/>
                        </Draggable>
                    ))}
                </Container>
            </div>
            <footer>
                <div className="footer-actions">
                    <i className="fa fa-plus icon" />Add another card
                </div>
            </footer>
        </div>
    )
}

export default Column