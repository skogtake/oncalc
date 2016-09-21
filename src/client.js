import React from 'react';
import ReactDOM from 'react-dom';
import math from 'mathjs';
import _ from 'lodash';

math.config({
	number: 'BigNumber',	// Default type of number:
                       		// 'number' (default), 'BigNumber', or 'Fraction'
	precision: 16        	// Number of significant digits for BigNumbers
});


//for material-ui--------------------------------------------------------------
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

let style = {};

//theme------------------------------------------------------------------------
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red100, red500, red600, cyan500 } from 'material-ui/styles/colors';

style.theme = getMuiTheme({
	palette: {
		textColor: cyan500,
    	primary1Color: red600,
    	primary2Color: red500,
    	primary3Color: red100
  	}
});

//app bar---------------------------------------------------------------------
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

//paper-----------------------------------------------------------------------
import Paper from 'material-ui/Paper';

style.paperButtons = {
	width: '100%'
};

//textfield-------------------------------------------------------------------
import TextField from 'material-ui/TextField';

style.textfield = {};

//button----------------------------------------------------------------------
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

style.flatButton = {
 	width: '100%',
    minWidth: '100%',
    height: '100%',
    borderRadius: '0px',
    cursor: 'default'
};

style.flatButton.label = {
	textTransform: 'lowercase',
	fontSize: '16px'
};

style.equalButton = {
    display: 'inline-block',
    position: 'relative',
    top: '0',
    height: '42px',
    verticalAlign: 'top',
};

style.equalButton.label = {
    fontWeight: '900',
    color: '#565656',
};

//constatnts--------------------------------------------------------------------
const funcs = [
    [{ name: 'sin' }, { name: 'asin' }, { name: 'sinh' }, { name: 'asinh' }],
    [{ name: 'cos' }, { name: 'acos' }, { name: 'cosh' }, { name: 'acosh' }],
    [{ name: 'tan' }, { name: 'atan' }, { name: 'tanh' }, { name: 'atanh' }],
    [{ name: 'sec' }, { name: 'asec' }, { name: 'sech' }, { name: 'asech' }],
    [{ name: 'csc' }, { name: 'acsc' }, { name: 'csch' }, { name: 'acsch' }],
    [{ name: 'cot' }, { name: 'acot' }, { name: 'coth' }, { name: 'acoth' }],
    [{ name: 'ln' }, { name: 'lg' }, { name: 'lb' }, { name: 'log<sub>y</sub>x', value: 'log' }],
    [{ name: '&#8730;x', value: 'sqrt' }, { name: '<sup>y</sup>&#8730;x', value: 'root' },
     { name: 'x!', value: 'fact' }, { name: '1/x', value: 'fract' }],
    [{ name: 'round' }, { name: 'ceil' }, { name: 'floor' }, { name: '&#960;', value: 'pi' }],
    [{ name: 'x<sup>2</sup>', value: 'sqr' }, { name: 'x<sup>y</sup>', value: 'power' },
     { name: 'e<sup>x</sup>', value: 'exp' }, { name: 'e' }],
    [{ name: '%', value: 'perc' }, { name: 'abs' }, { name: 'div' }, { name: 'mod' }],
    [{ name: '+' }, { name: '-' }, { name: '&#215;', value: '*' }, { name: '&#247;', value: '/'}],
    [{ name: 'C', value: 'clean' }, { name: '1' }, { name: '4' }, { name: '7' }],
    [{ name: 'CE', value: 'clear everything' }, { name: '2' }, { name: '5' }, { name: '8' }],
    [{ name: 'rad/deg' }, { name: '3' }, { name: '6' }, { name: '9' }],
    [{ name: '<i class="material-icons">keyboard_backspace</i>', value: 'backspace' },
     { name: '&#177;', value: 'plus-minus' }, { name: '.' }, { name: '0' }]

];

//components--------------------------------------------------------------------------------
let Header = React.createClass({
	render: function() {
		return (
			<header>
				<AppBar
					className="app-bar"
    				title= {
    					<span> 
    						<span className="title">ONCALC</span>
    						<span className="description"> - online calculator</span> 
    					</span> 
    				}
    				iconElementLeft={ <div></div> }
    				iconElementRight={
      					<IconMenu
        					iconButtonElement={
          						<IconButton>
          							<MoreVertIcon/>
          						</IconButton>
        					}
      					>
      						<MenuItem>yolo</MenuItem>
      						<MenuItem>ratatatatatata</MenuItem>
      					</IconMenu>
    				}
  				/>
			</header>
		);
	}
});

let Calculate = React.createClass({
	propTypes: {
		funcs: React.PropTypes.arrayOf(React.PropTypes.array).isRequired,
		keyPressed: React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			results: [],
			expression: '',
			result: '',
			input: '',
			binaryCalcFromExp: false,
			isDeg: false,
			wasEdited: false,
			prevFunc: ''
		};
	},
	scrollDown: function() { //todo-------------------------------------------------
		 let out = document.getElementById('results');
		 out.scrollTop = out.scrollHeight;
	},
	answerClick: function(index) {
		let oldResult = this.state.results[index];
		this.setState({
			input: oldResult.result,
			expression: oldResult.expression
		});
	},
	expClick: function(index) {
		
	},
	componentWillReceiveProps: function(nextProps) {
		console.log('key: ' + nextProps.keyPressed);
		this.keyHandler(nextProps.keyPressed);
	},
	keyHandler: function(key) {
		key = key.toLowerCase();
		switch(key) {
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
			case '.':
			case '+':
			case '-':
			case '*':
			case '/':
			case 'backspace':
			case 'e':
				this.handler(key);
				break;
			case '%':
				this.handler('perc');
				break;
			case '!':
				this.handler('fact');
				break;
			case '^':
				this.handler('power');
				break;
			case 'c':
				this.handler('clean');
				break;
			case 'escape':
				this.handler('clear everything');
				break;
			case 'p':
				this.handler('pi');
				break;
			case '=':
			case 'enter':
			case ' ':
				this.equalHandler();
				break;
			default:
				break;				
		}
	},
	equalHandler: function() {
	
		if (this.state.prevFunc === '') {
			return;		
		}
		console.log('equal');

		let tmpExp = '';
		let tmpRes = '';
		let tmpResults = this.state.results;
		switch(this.state.prevFunc) {
			case 'log': {
				if (!this.state.binaryCalcFromExp) {
					let leftOperand = this.state.expression.match(/<sub>(.*?)<\/sub>/g)[0].replace(/<\/?sub>/g, '');
					tmpRes = math.log(math.bignumber(this.state.input), math.bignumber(leftOperand)).toString();
				}
				else {
					tmpRes = math.log(math.bignumber(this.state.input), math.bignumber(tmpResults[tmpResults.length - 2].result)).toString();
				}
				tmpExp = this.state.expression + (this.state.input[0] !== '-' ? this.state.input : '(' + this.state.input + ')');
				break;
			}
			case 'power': {
				let leftOperand = this.state.expression.slice(0, -2); 		
				if (!this.state.binaryCalcFromExp) {
					tmpRes = math.pow(math.bignumber(leftOperand), math.bignumber(this.state.input)).toString();
					tmpExp = leftOperand + '<sup>' + this.state.input + '</sup>';
				}
				else {
					tmpRes = math.pow(math.bignumber(tmpResults[tmpResults.length - 2].result), math.bignumber(this.state.input)).toString();
					tmpExp = '(' + leftOperand + ')' + '<sup>' + this.state.input + '</sup>';
				}
				break;
			}
			case 'root': {
				if (!this.state.binaryCalcFromExp) {
					let leftOperand = this.state.expression.match(/<sup>(.*?)<\/sup>/g)[0].replace(/<\/?sup>/g, '');
					tmpRes = math.nthRoot(math.bignumber(this.state.input), math.bignumber(leftOperand)).toString();
				}
				else {
					tmpRes = math.nthRoot(math.bignumber(this.state.input), math.bignumber(tmpResults[tmpResults.length - 2].result)).toString();
				}
				tmpExp = this.state.expression + this.state.input;
				break;
			}
			case 'mod': {
				let leftOperand = this.state.expression.slice(0, -5);
				if (!this.state.binaryCalcFromExp) {
					tmpRes = math.mod(math.bignumber(leftOperand), math.bignumber(this.state.input)).toString();
					tmpExp = this.state.expression + this.state.input;
				}
				else {
					tmpRes = math.mod(math.bignumber(tmpResults[tmpResults.length - 2].result), math.bignumber(this.state.input)).toString();
					tmpExp = '(' + leftOperand + ') mod ' + this.state.input;
				}
				break;
			}
			case 'div': {
				let leftOperand = this.state.expression.slice(0, -5);
				if (!this.state.binaryCalcFromExp) {
					tmpRes = math.floor(math.divide(math.bignumber(leftOperand), math.bignumber(this.state.input))).toString();
					tmpExp = this.state.expression + this.state.input;
				}
				else {
					tmpRes = math.floor(math.divide(math.bignumber(tmpResults[tmpResults.length - 2].result), math.bignumber(this.state.input))).toString();
					tmpExp = '(' + leftOperand + ') div ' + this.state.input;
				}
				break;
			}
			case '+': {
				if (!this.state.binaryCalcFromExp) {
					let leftOperand = this.state.expression.slice(0, -3);
					tmpRes = math.add(math.bignumber(leftOperand), math.bignumber(this.state.input)).toString();
				}
				else {
					tmpRes = math.add(math.bignumber(tmpResults[tmpResults.length - 2].result), math.bignumber(this.state.input)).toString();
				}
				tmpExp = this.state.expression + (this.state.input[0] !== '-' ? this.state.input : '(' + this.state.input + ')');
				break;
			}
			case '-': {
				if (!this.state.binaryCalcFromExp) {
					let leftOperand = this.state.expression.slice(0, -3);
					tmpRes = math.subtract(math.bignumber(leftOperand), math.bignumber(this.state.input)).toString();
				}
				else {
					tmpRes = math.subtract(math.bignumber(tmpResults[tmpResults.length - 2].result), math.bignumber(this.state.input)).toString();
				}
				tmpExp = this.state.expression + (this.state.input[0] !== '-' ? this.state.input : '(' + this.state.input + ')');
				break;
			}
			case '*': {
				if (!this.state.binaryCalcFromExp) {
					let leftOperand = this.state.expression[0] === '(' ? this.state.expression.slice(1, -4) : this.state.expression.slice(0, -3);
					tmpRes = math.multiply(math.bignumber(leftOperand), math.bignumber(this.state.input)).toString();
					tmpExp = this.state.expression + (this.state.input[0] !== '-' ? this.state.input : '(' + this.state.input + ')');
				}
				else {
					tmpRes = math.multiply(math.bignumber(tmpResults[tmpResults.length - 2].result), math.bignumber(this.state.input)).toString();
					tmpExp = this.state.expression + (this.state.input[0] !== '-' ? this.state.input : '(' + this.state.input + ')');
				}
				break;
			}
			case '/': {
				if (!this.state.binaryCalcFromExp) {
					let leftOperand = this.state.expression[0] === '(' ? this.state.expression.slice(1, -4) : this.state.expression.slice(0, -3);
					tmpRes = math.divide(math.bignumber(leftOperand), math.bignumber(this.state.input)).toString();
					tmpExp = this.state.expression + (this.state.input[0] !== '-' ? this.state.input : '(' + this.state.input + ')');
				}
				else {
					tmpRes = math.divide(math.bignumber(tmpResults[tmpResults.length - 2].result), math.bignumber(this.state.input)).toString();
					tmpExp = this.state.expression + (this.state.input[0] !== '-' ? this.state.input : '(' + this.state.input + ')');
				}
				break;
			}
			default:
				break;
		}

		_.last(tmpResults).expression = tmpExp;				
		_.last(tmpResults).result = tmpRes;
		this.setState({
			expression: tmpExp,
			result: tmpRes,
			input: '',
			results: tmpResults,
			prevFunc: '',
			binaryCalcFromExp: false
		});
	},
	unary: function(expFromInput, calculateRes, expFromExp) {
		let tmpExp = '';
		let tmpRes = '';
		let tmpResults = this.state.results;
		if (this.state.input !== '') {
			tmpExp = expFromInput(this.state.input);
			tmpRes = calculateRes(this.state.input);
			tmpResults.push({
				expression: tmpExp,
				result: tmpRes
			});
			this.setState({
				expression: tmpExp,
				result: tmpRes,
				input: '',
				results: tmpResults
			});		
		}
		else {
			if (this.state.expression !== '') {
				tmpExp = expFromExp(this.state.expression);
				tmpRes = calculateRes(this.state.result);
				tmpResults.push({
					expression: tmpExp,
					result: tmpRes
				});
				this.setState({
					expression: tmpExp,
					result: tmpRes,
					results: tmpResults
				});
			}
		}			
	},
	binary: function(makeExp, func) {
		let tmpExp = '';
		let tmpRes = '';
		let tmpResults = this.state.results;			
		if (this.state.input !== '') {
			tmpExp = makeExp(this.state.input);
			tmpResults.push({
				expression: tmpExp,
				result: ''
			});
			this.setState({
				expression: tmpExp,
				result: '',
				input: '',
				results: tmpResults,
				prevFunc: func 
			});
		}
		else {
			if (this.state.expression !== '') {
				tmpExp = makeExp(this.state.expression, true);
				this.setState({ binaryCalcFromExp: true });
				tmpResults.push({
					expression: tmpExp,
					result: ''
				});
				this.setState({
					expression: tmpExp,
					result: '',
					input: '',
					results: tmpResults,
					prevFunc: func 
				});
			}
		}
	},
	handler: function(func) {

		if (this.state.prevFunc !== '' && (func !== '0' && func !== '1' && func !== '2' && func !== '3' &&
										   func !== '4' && func !== '5' && func !== '6' && func !== '7' &&
										   func !== '8' && func !== '9' && func !== '.' && func !== 'clean' &&
										   func !== 'plus-minus' && func !== 'pi' && func !== 'e' &&
										   func !== 'backspace' && func !== 'clear everything')) {
			return;
		}

		console.log(func);
		switch(func) {
			//trigonometric--------------------------------------------------------------------------
			case 'sin':
			case 'asin':
			case 'sinh':
			case 'asinh':
			case 'cos':
			case 'acos':
			case 'cosh':
			case 'acosh':
			case 'tan':
			case 'atan':
			case 'tanh':
			case 'atanh':
			case 'sec':
			case 'asec':
			case 'sech':
			case 'asech':
			case 'csc':
			case 'acsc':
			case 'csch':
			case 'acsch':
			case 'cot':
			case 'acot':
			case 'coth':
			case 'acoth': {
				let expFromInput = null;
				let calculateRes = null;
				let expFromExp = null;

				if (!this.state.isDeg) {
					expFromInput = str => func + '(' + math.bignumber(str).toString() + ')';
					calculateRes = str => { 
						//exclusion results in radians--------------------------------------------
						let input = math.mod(math.bignumber(str), math.multiply(math.bignumber('2'), math.bignumber(math.pi.toString()))).toString(); //modulo of 2*pi
						switch(func) {
							case 'sin':
								if (input === '0' || input === '3.141592653589793') {
									return '0';
								}
								if (input === '0.5235987755982988' || input === '2.617993877991494') {
									return '0.5';
								}
								if (input === '1.570796326794897') {
									return '1';
								}
								if (input === '3.665191429188092' || input === '5.759586531581287') {
									return '-0.5';
								}
								if (input === '4.712388980384691') {
									return '-1';
								}	
								break;
							default:
								break;
						};
						return math[func](math.bignumber(str)).toString(); 
					};
					expFromExp = str => func + '(' + str + ')';
				}
				else {
					expFromInput = str => func + '(' + math.bignumber(str).toString() + '&deg;)';
					calculateRes = str => {
						//exclusion results in degrees--------------------------------------------
						let input = math.mod(math.bignumber(str), math.bignumber('360')).toString(); //modulo of 360 degrees
						switch(func) {
							case 'sin':
								if (input === '0' || input === '180') {
									return '0';
								}
								if (input === '30' || input === '150') {
									return '0.5';
								}
								if (input === '90') {
									return '1';
								}
								if (input === '210' || input === '330') {
									return '-0.5';
								}
								if (input === '270') {
									return '-1';
								}
								break;
							case 'cos':
								if (input === '0') {
									return '1';
								}
								if (input === '60' || input === '300') {
									return '0.5';
								}
								if (input === '90' || input === '270') {
									return '0';
								}
								if (input === '180') {
									return '-1';
								}
								if (input === '120' || input === '240') {
									return '-0.5';
								}
								break;
							case 'tan':
								if (input === '0' || input === '180') {
									return '0';
								}
								if (input === '45' || input === '225') {
									return '1';
								}
								if (input === '90' || input === '270') {
									return Infinity;
								}
								
								if (input === '135' || input === '315') {
									return '-1';
								}
								break;
							case 'sec':
								if (input === '0') {
									return '1';
								}
								if (input === '60' || input === '300') {
									return '2';
								}
								if (input === '90' || input === '270') {
									return Infinity;
								}
								if (input === '120' || input === '240') {
									return '-2';
								}
								if (input === '180') {
									return '-1';
								}
								break;
							case 'csc':
								if (input === '0' || input === '180') {
									return Infinity;
								}
								if (input === '30' || input === '150') {
									return '2';
								}
								if (input === '90') {
									return '1';
								}
								if (input === '210' || input === '330') {
									return '-2';
								}
								if (input === '270') {
									return '-1';
								}
								break;
							case 'cot':
								if (input === '0' || input === '180') {
									return Infinity;
								}
								if (input === '45' || input === '225') {
									return '1';
								}
								if (input === '90' || input === '270') {
									return '0';
								}
								
								if (input === '135' || input === '315') {
									return '-1';
								}
								break;
							default:
								break;
						};
						return math[func](math.divide(math.multiply(math.bignumber(str), math.bignumber(math.pi)), math.bignumber('180'))).toString(); 
					};
					expFromExp = str => func + '(' + str + '&deg;)';
				} 

				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			//rounding--------------------------------------------------------------------------------
			case 'round':
			case 'ceil':
			case 'floor': {
				let expFromInput = str => func + '(' + math.bignumber(str).toString() + ')';
				let calculateRes = str => math[func](math.bignumber(str)).toString();
				let expFromExp = str => func + '(' + str + ')';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
 			}
 			//logarithmic----------------------------------------------------------------------------
			case 'ln': {
				let expFromInput = str => func + '(' + math.bignumber(str).toString() + ')';
				let calculateRes = str => math.log(math.bignumber(str), math.e).toString();
				let expFromExp = str => func + '(' + str + ')';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			case 'lg': {
				let expFromInput = str => func + '(' + math.bignumber(str).toString() + ')';
				let calculateRes = str => math.log(math.bignumber(str), math.bignumber('10')).toString();
				let expFromExp = str => func + '(' + str + ')';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			case 'lb': {
				let expFromInput = str => func + '(' + math.bignumber(str).toString() + ')';
				let calculateRes = str => math.log(math.bignumber(str), math.bignumber('2')).toString();
				let expFromExp = str => func + '(' + str + ')';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			case 'log': {
				let makeExp = str => 'log<sub>' + str + '</sub>';
				this.binary(makeExp, func);
				break;
			}
			//nonlinear------------------------------------------------------------------------------
			case 'sqr': {
				let expFromInput = str => math.bignumber(str).toString() + '<sup>2</sup>';
				let calculateRes = str => math.pow(math.bignumber(str), math.bignumber('2')).toString();
				let expFromExp = str => '(' + str + ')<sup>2</sup>';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			case 'power': {
				let makeExp = str => str + ' ^';
				this.binary(makeExp, func);
				break;
			}
			case 'exp': {
				let expFromInput = str => 'e<sup>' + math.bignumber(str).toString() + '</sup>';
				let calculateRes = str => math.pow(math.bignumber(math.e), math.bignumber(str)).toString();
				let expFromExp = str => 'e<sup>' + str + '</sup>';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			case 'sqrt': {
				let expFromInput = str => func + '(' + math.bignumber(str).toString() + ')';
				let calculateRes = str => math.sqrt(math.bignumber(str)).toString();
				let expFromExp = str => func + '(' + str + ')';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			case 'root': {
				let makeExp = str => '<sup>' + str + '</sup>' + '&#8730;';
				this.binary(makeExp, func);
				break;
			}
			case 'fact': {
				let expFromInput = str => math.bignumber(str).toString() + '!';
				let calculateRes = str => math.factorial(math.bignumber(str)).toString();
				let expFromExp = str => str + '!';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			case 'fract': {
				let expFromInput = str => '1/(' + math.bignumber(str).toString() + ')';
				let calculateRes = str => math.divide(math.bignumber('1'), math.bignumber(str)).toString();
				let expFromExp = str => '1/(' + str + ')';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			//constants-------------------------------------------------------------------------------
			case 'pi': {
				this.setState({ input: math.pi.toString() });
				break;
			}
			case 'e': {
				this.setState({ input: math.e.toString() });
				break;
			}
			//arithmetic------------------------------------------------------------------------------
			case 'perc': {
				break;
			}

			case 'abs': {
				let expFromInput = str => func + '(' + math.bignumber(str).toString() + ')';
				let calculateRes = str => math.abs(math.bignumber(str)).toString();
				let expFromExp = str => func + '(' + str + ')';
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			}
			case 'div':
			case 'mod':
			case '+':
			case '-': {
				let makeExp = str => str + ' ' + func + ' ';
				this.binary(makeExp, func);
				break;
			}
			case '*':
			case '/': {
				let makeExp = str => {
					if (this.state.input !== '') {
						if (this.state.input[0] !== '-') {
							return str + ' ' + func + ' ';
						}
						else {
							return '(' + str + ') ' + func + ' ';
						}
					}
					else {
						return '(' + str + ') ' + func + ' ';
					}
				};
				this.binary(makeExp, func);
				break;
			}
			//controls------------------------------------------------------------------------------
			case 'clean': {
				this.setState({ input: '' });
				break;
			}
			case 'clear everything': {
				if (this.state.prevFunc) {
					let tmpResults = this.state.results;
					tmpResults.pop();
					this.setState({
						expression: '',
						result: '',
						results: tmpResults,
						input: '',
						binaryCalcFromExp: false,
						prevFunc: ''
					});
				}
				else {
					this.setState({ input: '' });
				}
				break;
			}
			case 'rad/deg': {
				let tmpIsDeg = !this.state.isDeg;
				this.setState({ isDeg: tmpIsDeg	});
				break;
			}
			case 'backspace': {
				let tmp = this.state.input;
				if (tmp.length === 2 && tmp[0] === '-') {
					tmp = '';
				}
				else {
					tmp = tmp.slice(0, -1);
				}
				this.setState({ input: tmp });
				break;
			}
			case '.': {
				if (this.state.input.length === 0) {
					this.setState({	input: '0.' });
				}
				else if (this.state.input.indexOf('.') === -1) {
					let tmp = this.state.input + func;
					this.setState({	input: tmp });	
				}
				break;
			}
			case 'plus-minus': {
				if (this.state.input !== '') {
					let tmp = math.bignumber(this.state.input * -1).toString();
					this.setState({ input: tmp });
				}
				break;
			}
			//digits----------------------------------------------------------------------------------------------
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9': {
				let tmp = this.state.input + func;
				tmp = math.bignumber(tmp).toString();
				this.setState({	input: tmp });
				break;
			}
			case '0': {
				if (this.state.input.indexOf('.') !== -1) {
					let tmp = this.state.input + func;
					this.setState({	input: tmp });
				} 
				else {
					let tmp = this.state.input + func;
					tmp = math.bignumber(tmp).toString();
					this.setState({ input: tmp });
				}
				break;
			}
			default:
				break;
		}

		//incorrect result handling-------------------------------------------------------------------------------
		if (_.has(_.last(this.state.results), 'result') && (isNaN(_.last(this.state.results).result) || _.last(this.state.results).result.indexOf('i') !== -1) && _.last(this.state.results).result !== 'Error') {
			let tmpResults = this.state.results;
			_.last(tmpResults).result = 'Error';
			this.setState({
				expression: '',
				result: '',
				results: tmpResults,
				input: '',
				binaryCalcFromExp: false,
				prevFunc: ''
			});
		}
		
		//scroll list of results to the bottom---------------------------------------------------------------------
		this.scrollDown();
	},
	render: function() {
		let btnTemplate = this.props.funcs.map(function(array, i) {
			return (
				<ul key={ i }>
					{ array.map(function(item, j) {

						if (item.name === 'rad/deg') {
							return <li key={ j }>
										<input 
											id="cb3" 
											type="checkbox" 
											className="tgl tgl-skewed" 
											onClick={ () => this.handler(item.value || item.name) }
										/>
										<label
											data-tg-off="rad" 
											data-tg-on="deg" 
											htmlFor="cb3" 
											className="tgl-btn"
										/>
						            </li>
						}
						else {
							return <li key={ j }>
						            	<FlatButton
						            		style={ style.flatButton } 
						            		onClick={ () => this.handler(item.value || item.name) } 
						            		label={ 
						            			<span dangerouslySetInnerHTML={ { __html: item.name } } value={ item.value || item.name }></span> 
						            		}
						            		labelStyle={ (item.value === 'clean' || item.value === 'clear everything') ? _.merge({}, style.flatButton.label, { textTransform: 'uppercase' }) : style.flatButton.label }
						            	>
						            	</FlatButton>
						            </li>
						}
					}, this) }
				</ul>
			);
		}, this);
		
		return (
			<div>
				<section id="display">
					<div className="results" id="results">
						{ this.state.results.map(function (item, index) {
							return <div key={ index } className="result animated fadeInUp">
										<div className="expression" 
										     dangerouslySetInnerHTML={ { __html: item.expression } }
										     value={ item.expression }
										     onClick={ () => this.expClick(index) }></div>
										<div className="equal">=</div>
										<div className="answer"
										     onClick={ () => this.answerClick(index) }>{ item.result }</div>
							   		</div>
						}, this) }
					</div>
					<div className="input">
						<div className={ 'type ' + ((this.state.input !== '') ? 'type-active' : '') }>
							{ this.state.input }
						</div>
						<FlatButton
							style={ style.equalButton }
							onClick={ this.equalHandler }
							label="="
							labelStyle={ style.equalButton.label }
						/>
					</div>
				</section>
				<section id="operations">
					<Paper style={ style.paperButtons } zDepth={ 2 } rounded={ false }>
						<div className="oper"> 
							{ btnTemplate }
						</div>
					</Paper>
				</section>
			</div>
		);
	}
});

let Footer = React.createClass({
	render: function() {
		return (
			<footer>
            	<div className="social">
                	<div>
                    	<span>Tell about </span>
                    	<span className="title">oncalc</span>
                	</div>

                	<a className="fa-stack fa-lg">
                    	<i className="fa fa-circle fa-stack-2x"></i>
                    	<i className="fa fa-facebook fa-stack-1x inverse"></i>
                	</a>
                	
                	<a className="fa-stack fa-lg">
                    	<i className="fa fa-circle fa-stack-2x"></i>
                    	<i className="fa fa-twitter fa-stack-1x inverse"></i>
                	</a>
                	
                	<a className="fa-stack fa-lg">
                    	<i className="fa fa-circle fa-stack-2x"></i>
                    	<i className="fa fa-vk fa-stack-1x inverse"></i>
                	</a>
            	</div>

            	<div className="mark">
                	<span>{ new Date().getFullYear() } made by</span>
                	<span className="author">ashtrie</span>
            	</div>
        	</footer>
		);
	}
});

let ReactTransitionGroup = require('react-addons-css-transition-group');

let App = React.createClass({
	getInitialState: function() {
		return {
			key: '',
			mounted: false,
		};
	},
	keyHandler: function(event) {
		event.preventDefault();
		this.setState({ key: event.key })
	},
	componentWillMount: function() {
		//this.setState({ mounted: true });
	},
	componentDidMount: function() {
		this.setState({ mounted: true });
		setTimeout(() => ReactDOM.findDOMNode(this.refs.page).focus(), 0);
  		//ReactDOM.findDOMNode(this.refs.page).focus();
	},
	render: function() {
		let child = null;
		if (this.state.mounted) {
			child = (
				<div className="app" ref="page" tabIndex="0" onKeyDown={ this.keyHandler }>
					<Header/>
					<Calculate funcs={ funcs } keyPressed={ this.state.key } />
					<Footer/>
				</div>
			);
		}
		else  {
			// child = (
			// 	<div className="loading-gif"></div>
			// );
			child = null;
		}

		return (
			<ReactTransitionGroup transitionName="example" transitionEnterTimeout={ 500 } transitionLeaveTimeout={ 300 }>
				{ child }
			</ReactTransitionGroup>
		);
	}
});

ReactDOM.render(
	<MuiThemeProvider muiTheme={ style.theme }>
		<App/>
	</MuiThemeProvider>, document.getElementById('root'));