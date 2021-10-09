import React from 'react'
import { Container as BootstrapContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap'

import './AppBar.scss'

function AppBar() {
    return (
        <nav className="navbar-app">App Bar
            <BootstrapContainer className="hoang-trello-container">
                <Row>
                    <Col sm={5} xs={12} className="col-no-padding">
                        <div className="app-actions">
                            <div className="item all"><i className="fa fa-th" /></div>
                            <div className="item home"><i className="fa fa-home" /></div>
                            <div className="item boards"><i className="fa fa-columns" />&nbsp;&nbsp;<strong>Boards</strong></div>
                            <div className="item search">
                                <InputGroup className="group-search">
                                    <FormControl
                                        className="input-search"
                                        placeholder="Jump to..."/>
                                    <InputGroup.Text className="input-icon-search"><i className="fa fa-search"/></InputGroup.Text>
                                </InputGroup>
                            </div>
                        </div>
                    </Col>
                    <Col sm={5} xs={12} className="col-no-padding">
                        <div className="app-actions">
                            <div className="item quick"><i className="fa fa-plus-square-o" /></div>
                            <div className="item news"><i className="fa fa-info-circle" /></div>
                            <div className="item notification"><i className="fa fa-bell-o" /></div>
                        </div>
                    </Col>
                </Row>

            </BootstrapContainer>
        </nav>
    )
}

export default AppBar


