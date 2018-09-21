import React from 'react';
import { hot } from "react-hot-loader";
import "./Calculator.scss";

class Calculator extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			lhsOperand: 0,
			rhsOperand: null,
			operator: null
		};

		this.clear = this.clear.bind(this);
		this.evaluate = this.evaluate.bind(this);
		this.operandInput = this.operandInput.bind(this);
		this.operatorInput = this.operatorInput.bind(this);

	}

	clear() {
		this.setState({
			lhsOperand: 0,
			rhsOperand: null,
			operator: null
		});
	}

	evaluate() {
		if (this.state.rhsOperand) {

			let evaluatedValue = 0;
			switch (this.state.operator) {
				case '+':
					evaluatedValue = parseFloat(this.state.lhsOperand) + parseFloat(this.state.rhsOperand);
					break;
				case '-':
					evaluatedValue = parseFloat(this.state.lhsOperand) - parseFloat(this.state.rhsOperand);
					break;
				case '×':
					evaluatedValue = parseFloat(this.state.lhsOperand) * parseFloat(this.state.rhsOperand);
					break;
				case '÷':
					evaluatedValue = parseFloat(this.state.lhsOperand) / parseFloat(this.state.rhsOperand);
					break;
			}

			this.setState({
				lhsOperand: evaluatedValue,
				rhsOperand: null,
				operator: null
			});
		}
	}

	appendInput(current, input) {
		if (input == '.') {
			if (!current) {
				return '0.0';
			} else {
				console.log(current.toString());
				if (current.toString().indexOf('.') == -1) {
					return current + '.0';
				} else {
					return current;
				}
			}
		}

		if (!current) {
			return input;
		}

		if (current.toString().indexOf('.') != -1) {
			
		}


	}

	operandInput(input) {
		//if the operator is populated, input goes onto the rhs, otherwise lhs
		this.setState((state) => {
			if (this.state.operator) {
				return {
					rhsOperand: this.appendInput(state.rhsOperand, input)
				}
			} else {
				return {
					lhsOperand: this.appendInput(state.lhsOperand, input)
				}
			}
		});

	}

	operatorInput(input) {
		//if there is already an operator
		if (this.state.operator) {
			//if we have a right hand side also
			if (this.state.rhsOperand != null) {
				//evaluate the current expression and then add the new operator
				let self = this;
				this.evaluate();
			}
		}
		//if there isn't an operator, set it to the input
		this.setState({
			operator: input
		});
	}

	render() {
		let renderValue = [this.state.lhsOperand, this.state.operator, this.state.rhsOperand].join(' ');

		return (
			<div className="calculator">
				<Display value={renderValue} />
				<div className="calculator-controls">
					<Button id="calculator-button-clear" value="clear" onClick={this.clear} />
					<ButtonGroup id="operators-group">
						<Button value="+" onClick={() => { this.operatorInput('+'); }} />
						<Button value="-" onClick={() => { this.operatorInput('-'); }} />
						<Button value="×" onClick={() => { this.operatorInput('×'); }} />
						<Button value="÷" onClick={() => { this.operatorInput('÷'); }} />
						<Button value="=" onClick={this.evaluate} />
					</ButtonGroup>
					<ButtonGroup id="operands-group">
						<Button value="1" onClick={() => { this.operandInput(1); }} />
						<Button value="2" onClick={() => { this.operandInput(2); }} />
						<Button value="3" onClick={() => { this.operandInput(3); }} />
						<Button value="4" onClick={() => { this.operandInput(4); }} />
						<Button value="5" onClick={() => { this.operandInput(5); }} />
						<Button value="6" onClick={() => { this.operandInput(6); }} />
						<Button value="7" onClick={() => { this.operandInput(7); }} />
						<Button value="8" onClick={() => { this.operandInput(8); }} />
						<Button value="9" onClick={() => { this.operandInput(9); }} />
						<Button value="" />
						<Button value="0" onClick={() => { this.operandInput(0); }} />
						<Button value="." onClick={() => { this.operandInput('.'); }} />
					</ButtonGroup>
				</div>
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

class Button extends React.Component {
	render() {
		return (
			<button className="calculator-button" onClick={this.props.onClick} {...this.props}>
				{this.props.value}
			</button>
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