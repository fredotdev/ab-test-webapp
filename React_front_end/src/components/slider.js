import {Button, Col, Form, Row} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React from "react";
import { Range } from 'react-range';

const Slider = (props) => {
    let values = props.values;
    let setValues = props.setValues;
    let labels = props.labels;

    if(labels === undefined || labels === null){
            labels = Array(props.max - props.min + 1).fill().map((_, idx) => props.min + idx)
        }

    let startProcent = 0;
    let endProcent = 0;

    if(values.length > 1){
        startProcent = (values[0] / props.max) * 100;
        endProcent = (values[1] / props.max) * 100;
    }
    else {
        startProcent = 0;
        endProcent = (values[0] / props.max) * 100;
    }

    return (
        <Row style={{paddingTop: 20}}>
            <Col sm={2}>
                {values.length == 1 && <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={labels[values[0]]} onChange={(e)=>{setValues([labels.indexOf(e.target.value)])}} />}
                {values.length > 1 && <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={labels[values[0]]} onChange={(e)=>{setValues([labels.indexOf(e.target.value), values[1]])}} />}
            </Col>
            <Col sm={8}>
                <Range
                    values={values}
                    step={props.step}
                    min={props.min}
                    max={props.max}
                    onChange={(values) => setValues(values)}
                    onFinalChange={(values) => {try{props.onFinalChange()}catch{}}}
                    renderTrack={({ props, children }) => (
                      <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                          ...props.style,
                          height: '36px',
                          display: 'flex',
                          width: '100%'
                        }}
                      >
                        <div
                          ref={props.ref}
                          style={{
                            height: '5px',
                            width: '100%',
                            borderRadius: '4px',
                            background: 'linear-gradient(90deg, rgba(204,204,204,1) 0%, rgba(204,204,204,1) ' + startProcent.toString() + '%, rgba(84,139,244,1) ' + startProcent.toString() + '%, rgba(84,139,244,1) ' + endProcent.toString() + '%, rgba(204,204,204,1) ' + endProcent.toString()+ '%, rgba(204,204,204,1) 100%)',
                              alignSelf: 'center'
                          }}
                        >
                          {children}
                        </div>
                      </div>
                    )}
                    renderThumb={({ index, props, isDragged }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '20px',
                          width: '20px',
                          borderRadius: '100%',
                          backgroundColor: '#FFF',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          boxShadow: '0px 2px 6px #AAA',
                            borderWidth: '0px',
                            outline: 0
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-35px',
                            color: '#000',
                            fontSize: '14px',
                            padding: '2px',
                            borderRadius: '5px',
                            backgroundColor: '#fff',
                          }}
                        >
                          {
                              labels == null && values[index].toFixed(1)

                          }
                          {
                              labels != null && labels[values[index].toFixed(0)]
                          }

                        </div>
                        <div
                          style={{
                            height: '12px',
                            width: '12px',
                            borderRadius: '100%',
                            backgroundColor: isDragged ? '#548BF4' : '#CCC'
                          }}
                        />
                      </div>
                    )}
                />
            </Col>
            <Col sm={2}>
                {values.length > 1 && <Form.Control size="sm" type="text" style={{textAlign: "center"}} placeholder="Start" value={labels[values[1]]} onChange={(e)=>{setValues([values[0], labels.indexOf(e.target.value)])}} />}
            </Col>
        </Row>
    )
};

export default Slider;
