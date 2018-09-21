import React from 'react';
import { hot } from "react-hot-loader";
import "./Calculator.scss";

class Calculator extends React.Component {
	render() {
		return (
			<div className="calculator">
				<Display value="100"/>
				<Controls />
			</div>
		);
	}
}

class Display extends React.Component {
	render() {
		return (
			<div className="calculator-display">
				<span className="calculator-display-text">{this.props.value}</span>
			</div>
		);
	}
}

class Controls extends React.Component {
	render() {
		return (
			<div className="calculator-controls">
				<Button id="calculator-button-clear" value="clear" />
				<ButtonGroup id="operators-group">
					<Button value="+" />
					<Button value="-" />
					<Button value="×" />
					<Button value="÷" />
					<Button value="=" />
				</ButtonGroup>
				<ButtonGroup id="operands-group">
					<Button value="1" />
					<Button value="2" />
					<Button value="3" />
					<Button value="4" />
					<Button value="5" />
					<Button value="6" />
					<Button value="7" />
					<Button value="8" />
					<Button value="9" />
					<Button value="±" />
					<Button value="0" />
					<Button value="." />
				</ButtonGroup>
			</div>
		);
	}
}

class Button extends React.Component {
	render() {
		return (
			<div className="calculator-button" {...this.props}>
				{this.props.value}
			</div>
		);
	}
}

class ButtonGroup extends React.Component {
	render() {
		return (
			<div className="calculator-button-group" {...this.props}>
				{this.props.children}
			</div>
		);
	}
}


export default hot(module)(Calculator);