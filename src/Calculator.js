import React from 'react';
import { hot } from "react-hot-loader";
import "./Calculator.scss";

// borrowed from http://www.jacklmoore.com/notes/rounding-in-javascript/
// I have to assume jacklmoore is macklemore's brother
function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

//enum objects, for clarity
const inputState = Object.freeze({ integer: 1, decimal: 2, display: 3 });
const sign = Object.freeze({ positive: 1, negative: -1 });

//this is my calculator object
//i used it to get more familiar with react and also
//to play with the idea of state machines
class Calculator extends React.Component {
	constructor(props) {
		super(props);

		//state stuff
		this.clearState = {
			currentInput: 0,
			inputState: inputState.integer,
			sign: sign.positive,
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
		//resets the state back to initial
		this.setState(this.clearState);
	}

	evaluate() {
		//you need a left hand value and an operator to evaluate the expression
		//the input value is always at least 0
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
		//inverts the sign of the current value, and also inverts the current value
		//gotta do both, because of the way my input logic works
		this.setState((state, props) => {
			return { currentInput: state.currentInput * -1, sign: state.sign * -1 }
		});
	}

	inputInteger(input) {
		//value * 10 moves all digits one column left
		// + input adds the new digit to the ones column
		//input * sign, to handle negatives
		this.setState((state) => {
			let newValue = state.currentInput * 10 + (input * state.sign);
			return { currentInput: newValue }
		});
	}

	inputDecimal(input) {
		//input / 10^decimalPlaces, where decimal places is just a count of how many digits you've put in
		//ends up being input / 10|100|1000|10000|etc
		//again, input * sign, for negative values
		this.setState((state) => {
			let newValue = state.currentInput + ((input * state.sign) / Math.pow(10, state.decimalPlaces));
			newValue = round(newValue, state.decimalPlaces);
			return { currentInput: newValue, decimalPlaces: (state.decimalPlaces + 1) }
		});
	}

	inputOperator(input) {
		//if there isn't already a left hand value
		//move current value to left hand
		//set operator to input
		//start inputting right hand value
		if (null === this.state.lhsOperand) {
			this.setState((state) => {
				return {
					lhsOperand: state.currentInput,
					currentInput: 0,
					operator: input
				};
			})
		} else {
			//if there is already a full expression when you hit an operator
			//evaluate it, assign the output to the left hand value
			//continue as if there was already a left hand value
			this.evaluate();
			this.setState((state)=>{
				return {
					lhsOperand: state.currentInput,
					inputState: inputState.integer,
					currentInput: 0,
					operator: input
				};
			})
		}
	}

	// STATE DEPENDANT LOGIC FUNCTIONS //
	// SEE state_diagram.png FOR A MAP OF THIS LOGIC // 
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
		// populate the numpad
		let numPad1to9 = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, idx) => {
			return <Button key={value} value={value} onClick={() => { this.onOperandButtonPress(value); }} />
		});

		//this is really to make it display 0.0 instead of just 0
		let currentInputDisplay = this.state.inputState == inputState.decimal ?
			this.state.currentInput.toFixed(Math.max(1, this.state.decimalPlaces - 1)) :
			this.state.currentInput;

		//if there is an expression to display, show it
		//otherwise, just display the current value
		let display = (this.state.lhsOperand !== null ? this.state.lhsOperand + " " + this.state.operator + " " : '') +
		 (currentInputDisplay === 0 ? '' : currentInputDisplay);

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
				{/* Input State: {this.state.inputState}<br />
				Sign: {this.state.sign}<br />
				Decimal Places: {this.state.decimalPlaces}<br /> */}
			</span>
		);
	}
}

// COMPONENTS FOR DISPLAYING PARTS OF THE CALCULATOR //
// COULD THESE HAVE BEEN FUNCTIONS? YEAH //
// BUT THEY'RE NOT //
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

//export hot for hotloader, to save me literally seconds every day
export default hot(module)(Calculator);