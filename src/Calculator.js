import React from 'react';
import { hot } from "react-hot-loader";
import "./Calculator.scss";
const inputState = Object.freeze({ integer: 1, decimal: 2, display: 3 });

// borrowed from http://www.jacklmoore.com/notes/rounding-in-javascript/
// I have to assume jacklmoore is macklemore's brother
function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

class Calculator extends React.Component {
	constructor(props) {
		super(props);

		//state stuff
		this.clearState = {
			currentInput: 0,
			inputState: inputState.integer,
			sign: 1,
			decimalPlaces: 1,
			lhsOperand: null,
			operator: null
		};
		this.state = this.clearState;

		//callbacks
		this.clear = this.clear.bind(this);
		this.evaluate = this.evaluate.bind(this);
		this.onOperandButtonPress = this.onOperandButtonPress.bind(this);
		this.onOperatorButtonPress = this.onOperatorButtonPress.bind(this);
		this.invertValue = this.invertValue.bind(this);
		this.onDecimalButtonPress = this.onDecimalButtonPress.bind(this);
	}

	clear() {
		this.setState(this.clearState);
	}

	evaluate() {
		if (this.state.lhsOperand !== null && this.state.operator != null) {
			this.setState((state) => {
				let result;
				switch (state.operator) {
					case '+':
						result = state.lhsOperand + state.currentInput;
						break;
					case '-':
						result = state.lhsOperand - state.currentInput;
						break;
					case '×':
						result = state.lhsOperand * state.currentInput;
						break;
					case '÷':
						result = state.lhsOperand / state.currentInput;
						break;
				}

				return {
					currentInput: result,
					inputState: inputState.display,
					sign: 1,
					decimalPlaces: 1,
					lhsOperand: null,
					operator: null
				}
			});
		}
	}

	invertValue() {
		this.setState((state, props) => {
			return { currentInput: state.currentInput * -1, sign: state.sign * -1 }
		});
	}

	inputInteger(input) {
		this.setState((state) => {
			let newValue = state.currentInput * 10 + (input * state.sign);
			return { currentInput: newValue }
		});
	}

	inputDecimal(input) {
		this.setState((state) => {
			let newValue = state.currentInput + ((input * state.sign) / Math.pow(10, state.decimalPlaces));
			newValue = round(newValue, state.decimalPlaces);
			return { currentInput: newValue, decimalPlaces: (state.decimalPlaces + 1) }
		});
	}

	inputOperator(input) {
		if (null === this.state.lhsOperand) {
			this.setState((state) => {
				return {
					lhsOperand: state.currentInput,
					currentInput: 0,
					operator: input
				};
			})
		}
	}

	onOperandButtonPress(input) {
		switch (this.state.inputState) {
			case inputState.integer:
				this.inputInteger(input);
				break;
			case inputState.decimal:
				this.inputDecimal(input);
				break;
			case inputState.display:
				this.clear();
				this.inputInteger(input);
				break;
		}
	}

	onDecimalButtonPress() {
		switch (this.state.inputState) {
			case inputState.integer:
				this.setState({
					inputState: inputState.decimal
				});
				break;
			case inputState.decimal:
				break;
			case inputState.display:
				this.setState({
					currentInput: 0,
					inputState: inputState.decimal,
					sign: 1,
					decimalPlaces: 1,
					lhsOperand: null,
					operator: null
				});
				break;
		}
	}

	onOperatorButtonPress(input) {
		switch (this.state.inputState) {
			case inputState.integer:
				this.inputOperator(input);
				break;
			case inputState.decimal:
				this.setState({
					inputState: inputState.integer
				});
				this.inputOperator(input);
				break;
			case inputState.display:
				this.setState({
					inputState: inputState.integer
				});
				this.inputOperator(input);
				break;
		}
	}

	render() {
		let numPad1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, idx) => {
			return <Button key={value} value={value} onClick={() => { this.onOperandButtonPress(value); }} />
		});

		let currentInputDisplay = this.state.inputState == inputState.decimal ?
			this.state.currentInput.toFixed(Math.max(1, this.state.decimalPlaces - 1)) :
			this.state.currentInput;

		let display = (this.state.lhsOperand !== null ? this.state.lhsOperand + " " + this.state.operator + " " : '') + currentInputDisplay;

		return (
			<span>
				<div className="calculator">
					<Display value={display} />
					<div className="calculator-controls">
						<Button id="calculator-button-clear" value="clear" onClick={this.clear} />
						<ButtonGroup id="operators-group">
							<Button value="=" onClick={this.evaluate} />
							<Button value="+" onClick={() => { this.onOperatorButtonPress('+'); }} />
							<Button value="-" onClick={() => { this.onOperatorButtonPress('-'); }} />
							<Button value="×" onClick={() => { this.onOperatorButtonPress('×'); }} />
							<Button value="÷" onClick={() => { this.onOperatorButtonPress('÷'); }} />
						</ButtonGroup>
						<ButtonGroup id="operands-group">
							{numPad1to9}
							<Button value="±" onClick={this.invertValue} />
							<Button value="0" onClick={() => { this.onOperandButtonPress(0); }} />
							<Button value="." onClick={this.onDecimalButtonPress} />
						</ButtonGroup>
					</div>
				</div>
				<br />
				Input State: {this.state.inputState}<br />
				Sign: {this.state.sign}<br />
				Decimal Places: {this.state.decimalPlaces}
			</span>
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
				<span className="calculator-button-text">
					{this.props.value}
				</span>
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