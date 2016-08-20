import React from 'react';
import ReactDOM from 'react-dom';
import math from 'mathjs';
import _ from 'lodash';

const numsAndCtrls = [
    [{ name: 'C', value: 'clean' }, { name: '1' }, { name: '4' }, { name: '7' }],
    [{ name: 'CE', value: 'clear everything' }, { name: '2' }, { name: '5' }, { name: '8' }],
    [{ name: 'rad/deg' }, { name: '3' }, { name: '6' }, { name: '9' }],
    [{ name: '<i class="fa fa-arrow-circle-left"></i>', value: 'backspace' },
     { name: '&#177;', value: 'plus-minus' }, { name: '.' }, { name: '0' }]
];

const operAndConst = [
    [{ name: 'ln' }, { name: 'lg' }, { name: 'lb' }, { name: 'log<sub>y</sub>x', value: 'log' }],
    [{ name: '&#8730;x', value: 'sqrt' }, { name: '<sup>y</sup>&#8730;x', value: 'root' },
     { name: 'x!', value: 'fact' }, { name: '1/x', value: 'fract' }],
    [{ name: 'round' }, { name: 'ceil' }, { name: 'floor' }, { name: '&#960;', value: 'pi' }],
    [{ name: 'x<sup>2</sup>', value: 'sqr' }, { name: 'x<sup>y</sup>', value: 'power' },
     { name: 'e<sup>x</sup>', value: 'exp' }, { name: 'e' }],
    [{ name: '%', value: 'perc' }, { name: 'abs' }, { name: 'div' }, { name: 'mod' }],
    [{ name: '+' }, { name: '-' }, { name: '&#215;', value: '*' }, { name: '&#247;', value: '/'}]
];

const trigFuncs = [
    [{ name: 'sin' }, { name: 'asin' }, { name: 'sinh' }, { name: 'asinh' }],
    [{ name: 'cos' }, { name: 'acos' }, { name: 'cosh' }, { name: 'acosh' }],
    [{ name: 'tan' }, { name: 'atan' }, { name: 'tanh' }, { name: 'atanh' }],
    [{ name: 'sec' }, { name: 'asec' }, { name: 'sech' }, { name: 'asech' }],
    [{ name: 'csc' }, { name: 'acsc' }, { name: 'csch' }, { name: 'acsch' }],
    [{ name: 'cot' }, { name: 'acot' }, { name: 'coth' }, { name: 'acoth' }]
];

var Header = React.createClass({
	render: function() {
		return (
			<header>
				<span className="title">Oncalc</span>
				<span className="description"> - Online Calculator</span>
			</header>
		);
	}
});

var Calculate = React.createClass({
	propTypes: {
		numsAndCtrls: React.PropTypes.arrayOf(React.PropTypes.array).isRequired,	
		operAndConst: React.PropTypes.arrayOf(React.PropTypes.array).isRequired,
		trigFuncs: React.PropTypes.arrayOf(React.PropTypes.array).isRequired,
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
	scrollDown: function() {
		// let out = document.getElementById('results');
		// //results.scrollTop = results.scrollHeight;
		// let isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
		// if(isScrolledToBottom) {
		// 	out.scrollTop = out.scrollHeight - out.clientHeight;
		// }

		setInterval(function() {
			var elem = document.getElementById('results');
  			elem.scrollTop = elem.scrollHeight;
		}, 500);
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
				this.handler('clean everything');
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
	
		if (this.state.prevFunc === '' && this.state.input === '') {
			return;		
		}
		console.log('equal');

		var tmpExp = '';
		var tmpRes = '';
		var tmpResults = this.state.results;
		switch(this.state.prevFunc) {
			case 'log':
				if (!this.state.binaryCalcFromExp) {
					var leftOperand = this.state.expression.match(/<sub>(.*?)<\/sub>/g)[0].replace(/<\/?sub>/g, '');
					tmpRes = math.log(math.number(this.state.input), math.number(leftOperand)).toString();
				}
				else {
					tmpRes = math.log(math.number(this.state.input), math.number(tmpResults[tmpResults.length - 2].result)).toString();
				}
				tmpExp = this.state.expression + this.state.input;
				break;

			case 'power':
				var leftOperand = this.state.expression.slice(0, -2); 		
				if (!this.state.binaryCalcFromExp) {
					tmpRes = math.pow(math.number(leftOperand), math.number(this.state.input)).toString();
					tmpExp = leftOperand + '<sup>' + this.state.input + '</sup>';
				}
				else {
					tmpRes = math.pow(math.number(tmpResults[tmpResults.length - 2].result), math.number(this.state.input)).toString();
					tmpExp = '(' + leftOperand + ')' + '<sup>' + this.state.input + '</sup>';
				}
				break;

			case 'root':
				if (!this.state.binaryCalcFromExp) {
					var leftOperand = this.state.expression.match(/<sup>(.*?)<\/sup>/g)[0].replace(/<\/?sup>/g, '');
					tmpRes = math.nthRoot(math.number(this.state.input), math.number(leftOperand)).toString();
				}
				else {
					tmpRes = math.nthRoot(math.number(this.state.input), math.number(tmpResults[tmpResults.length - 2].result)).toString();
				}
				tmpExp = this.state.expression + this.state.input;
				break;

			case 'mod': 		
				var leftOperand = this.state.expression.slice(0, -5);
				if (!this.state.binaryCalcFromExp) {
					tmpRes = math.mod(math.number(leftOperand), math.number(this.state.input)).toString();
					tmpExp = this.state.expression + this.state.input;
				}
				else {
					tmpRes = math.mod(math.number(tmpResults[tmpResults.length - 2].result), math.number(this.state.input)).toString();
					tmpExp = '(' + leftOperand + ') mod ' + this.state.input;
				}
				break;

			case 'div': 		
				var leftOperand = this.state.expression.slice(0, -5);
				if (!this.state.binaryCalcFromExp) {
					tmpRes = math.floor(math.divide(math.number(leftOperand), math.number(this.state.input))).toString();
					tmpExp = this.state.expression + this.state.input;
				}
				else {
					tmpRes = math.floor(math.divide(math.number(tmpResults[tmpResults.length - 2].result), math.number(this.state.input))).toString();
					tmpExp = '(' + leftOperand + ') div ' + this.state.input;
				}
				break;

			case '+': 		
				if (!this.state.binaryCalcFromExp) {
					var leftOperand = this.state.expression.slice(0, -3);
					tmpRes = math.add(math.number(leftOperand), math.number(this.state.input)).toString();
				}
				else {
					tmpRes = math.add(math.number(tmpResults[tmpResults.length - 2].result), math.number(this.state.input)).toString();
				}
				tmpExp = this.state.expression + this.state.input;
				break;

			case '-': 		
				if (!this.state.binaryCalcFromExp) {
					var leftOperand = this.state.expression.slice(0, -3);
					tmpRes = math.subtract(math.number(leftOperand), math.number(this.state.input)).toString();
				}
				else {
					tmpRes = math.subtract(math.number(tmpResults[tmpResults.length - 2].result), math.number(this.state.input)).toString();
				}
				tmpExp = this.state.expression + this.state.input;
				break;

			case '*':
				var leftOperand = this.state.expression.slice(0, -3); 		
				if (!this.state.binaryCalcFromExp) {
					tmpRes = math.multiply(math.number(leftOperand), math.number(this.state.input)).toString();
					tmpExp = this.state.expression + this.state.input;
				}
				else {
					tmpRes = math.multiply(math.number(tmpResults[tmpResults.length - 2].result), math.number(this.state.input)).toString();
					tmpExp = '(' + leftOperand + ') * ' + this.state.input;
				}
				break;

			case '/':
				var leftOperand = this.state.expression.slice(0, -3); 		
				if (!this.state.binaryCalcFromExp) {
					tmpRes = math.divide(math.number(leftOperand), math.number(this.state.input)).toString();
					tmpExp = this.state.expression + this.state.input;
				}
				else {
					tmpRes = math.divide(math.number(tmpResults[tmpResults.length - 2].result), math.number(this.state.input)).toString();
					tmpExp = '(' + leftOperand + ') / ' + this.state.input;
				}
				break;

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
		var tmpExp = '';
		var tmpRes = '';
		var tmpResults = this.state.results;
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
		var tmpExp = '';
		var tmpRes = '';
		var tmpResults = this.state.results;			
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
				tmpExp = makeExp(this.state.expression);
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
										   func !== 'plus-minus' && func !== 'backspace' && func !== 'pi' && func !== 'e')) {
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
			case 'acoth':
				var expFromInput;
				var calculateRes;
				var expFromExp;

				if (!this.state.isDeg) {
					expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
					calculateRes = function (str) {	return math[func](math.number(str)).toString(); };
					expFromExp = function (str) { return func + '(' + str + ')'; };
				}
				else {
					expFromInput = function (str) {	return func + '(' + math.number(str).toString() + '&deg;)'; };
					calculateRes = function (str) {	
						return math[func](math.divide(math.multiply(math.number(str), math.number(math.pi)), math.number('180'))).toString(); 
					};
					expFromExp = function (str) { return func + '(' + str + '&deg;)'; };
				} 

				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			//rounding--------------------------------------------------------------------------------
			case 'round':
			case 'ceil':
			case 'floor':
				var expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math[func](math.number(str)).toString(); };
				var expFromExp = function (str) { return func + '(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
 			
 			//logarithmic----------------------------------------------------------------------------
			case 'ln':
				var expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math.log(math.number(str), math.e).toString(); };
				var expFromExp = function (str) { return func + '(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			case 'lg':
				var expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math.log(math.number(str), math.number('10')).toString(); };
				var expFromExp = function (str) { return func + '(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			case 'lb':
				var expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math.log(math.number(str), math.number('2')).toString(); };
				var expFromExp = function (str) { return func + '(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			case 'log':
				var makeExp = function (str) { return 'log<sub>' + str + '</sub>'; };
				this.binary(makeExp, func);
				break;

			//nonlinear------------------------------------------------------------------------------
			case 'sqr':
				var expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math.pow(math.number(str), math.number('2')).toString(); };
				var expFromExp = function (str) { return func + '(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			case 'power':
				var makeExp = function (str) { return str + ' ^'; };
				this.binary(makeExp, func);
				break;

			case 'exp':
				var expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math.pow(math.number(math.e), math.number(str)).toString(); };
				var expFromExp = function (str) { return func + '(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			case 'sqrt':
				var expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math.sqrt(math.number(str)).toString(); };
				var expFromExp = function (str) { return func + '(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			case 'root':
				var makeExp = function (str) { return '<sup>' + str + '</sup>' + '&#8730;'; };
				this.binary(makeExp, func);
				break;

			case 'fact':
				var expFromInput = function (str) {	return math.number(str).toString() + '!'; };
				var calculateRes = function (str) {	return math.factorial(math.number(str)).toString(); };
				var expFromExp = function (str) { return str + '!'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			case 'fract':
				var expFromInput = function (str) {	return '1/(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math.divide(math.number('1'), math.number(str)).toString(); };
				var expFromExp = function (str) { return '1/(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;
			
			//constants-------------------------------------------------------------------------------
			case 'pi':
				this.setState({ input: math.pi });
				break;
			case 'e':
				this.setState({ input: math.e });
				break;
			
			//arithmetic------------------------------------------------------------------------------
			case 'perc':
				break;

			case 'abs':
				var expFromInput = function (str) {	return func + '(' + math.number(str).toString() + ')'; };
				var calculateRes = function (str) {	return math.abs(math.number(str)).toString(); };
				var expFromExp = function (str) { return func + '(' + str + ')'; };
				this.unary(expFromInput, calculateRes, expFromExp);
				break;

			case 'div':
			case 'mod':
			case '+':
			case '-':
			case '*':
			case '/':
				var makeExp = function (str) { return str + ' ' + func + ' '; };
				this.binary(makeExp, func);
				break;

			//controls------------------------------------------------------------------------------
			case 'clean':
				if (this.state.results.length !== 0 && this.state.expression !== '') { //a bug there!!!!!!!!!!!!!!1
					var tmpResults = this.state.results;
					tmpResults = tmpResults.pop();
					this.setState({ results: tmpResults });
				}
				this.setState({
					expression: '',
					result:  '',
					input: '',
					binaryCalcFromExp: false,
					prevFunc: ''
				});
				break;

			case 'rad/deg':
				var tmpIsDeg = !this.state.isDeg;
				this.setState({ isDeg: tmpIsDeg	});
				break;

			case 'backspace':
				var tmp = this.state.input;
				if (tmp.length === 2 && tmp[0] === '-') {
					tmp = '';
				}
				else {
					tmp = tmp.slice(0, -1);	
				}
				this.setState({ input: tmp });
				break;

			case '.':
				if (this.state.input.length === 0) {
					this.setState({	input: '0.' });
				}
				else if (this.state.input.indexOf('.') === -1) {
					var tmp = this.state.input + func;
					this.setState({	input: tmp });	
				}
				break;

			case 'plus-minus':
				var tmp = math.number(this.state.input * -1).toString();
				this.setState({ input: tmp });
				break;

			//digits----------------------------------------------------------------------------------------------
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
				var tmp = this.state.input + func;
				tmp = math.number(tmp).toString();
				this.setState({	input: tmp });
				break;
			case '0':
				if (this.state.input.indexOf('.') !== -1) {
					var tmp = this.state.input + func;
					this.setState({	input: tmp });
				} 
				else {
					var tmp = this.state.input + func;
					tmp = math.number(tmp).toString();
					this.setState({ input: tmp });
				}
				break;
			
			default:
				break;
		}

		//incorrect result handling-------------------------------------------------------------------------------
		if (_.has(_.last(this.state.results), 'result') && _.last(this.state.results).result === 'NaN') {
			var tmpResults = this.state.results;
			_.last(tmpResults).result = 'Error';
			this.setState({
				results: tmpResults,
				expression: '',
				result: '',
				input: ''
			});
		}

		//scroll list of results to the bottom---------------------------------------------------------------------
		//this.scrollDown();
	},
	render: function() {
		var numsAndCtrls = this.props.numsAndCtrls;
		var operAndConst = this.props.operAndConst;
		var trigFuncs = this.props.trigFuncs;
		
		var btnTemplate = trigFuncs.concat(operAndConst, numsAndCtrls).map(function(array, i) {
			return (
				<ul key={ i }>
					{ array.map(function(item, j) {

						if (item.name === 'rad/deg') {
							return <li key={ j }>
						            	<input id="cb3" type="checkbox" className="tgl tgl-skewed"/>
										<label onClick={ () => this.handler(item.value || item.name) } data-tg-off="rad" 
										       data-tg-on="deg" htmlFor="cb3" className="tgl-btn"></label>  
						            </li>
						}
						else {
							return <li key={ j } 
						    	       dangerouslySetInnerHTML={ { __html: item.name } }
						        	   value={ item.value || item.name }
						               onClick={ () => this.handler(item.value || item.name) }></li>
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
							return <div key={ index } className="result">
										<div className="expression" 
										     dangerouslySetInnerHTML={ { __html: item.expression } }
										     value={ item.expression }
										     onClick={ () => expClick(index) }></div>
										<div className="equal">=</div>
										<div className="answer"
										     onClick={ () => this.answerClick(index) }>{ item.result }</div>
							   		</div>
						}, this) }
					</div>
					<div className="input">
						<div className="type">{ this.state.input }</div>
						<div className="equal" onClick={ this.equalHandler }>=</div>
					</div>
				</section>
				<section id="operations">
					<div className="oper"> 
						{ btnTemplate }
					</div>
				</section>
			</div>
		);
	}
});

var Footer = React.createClass({
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

var App = React.createClass({
	getInitialState: function() {
		return {
			key: ''
		};
	},
	keyHandler: function(event) {
		this.setState({ key: event.key })
	},
	componentDidMount: function() {
  		ReactDOM.findDOMNode(this.refs.page).focus(); 
	},
	render: function() {
		return (
			<div className="app" ref="page" tabIndex="0" onKeyDown={ this.keyHandler }>
				<Header/>
				<Calculate numsAndCtrls={ numsAndCtrls } operAndConst={ operAndConst } trigFuncs={ trigFuncs } keyPressed={ this.state.key } />
				<Footer/>
			</div>
		);
	}
});

ReactDOM.render(<App/>, document.getElementById('root'));